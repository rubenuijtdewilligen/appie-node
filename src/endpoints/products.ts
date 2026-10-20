import type { AppieClient } from "../client.js";
import type {
  GraphQLProductData,
  GraphQLResponse,
  Nutrient,
  ProductCard,
  ProductDetailResponse,
  SearchProductsData,
  SearchProductsInput,
} from "../types.js";

export class ProductsFlow {
  private client: AppieClient;

  constructor(client: AppieClient) {
    this.client = client;
  }

  /**
   * Converts POS (physical store) receipt product IDs to Webshop product IDs.
   *
   * @param ids Array of POS product IDs (e.g., from receiptDetails.products.id)
   * @returns A record mapping the original POS ID to the Webshop ID
   */
  public async convertPosIds(ids: number[]): Promise<Record<number, number>> {
    const uniqueIds = Array.from(new Set(ids)).filter((id) => id > 0);

    if (uniqueIds.length === 0) {
      return {};
    }

    const aliases = uniqueIds
      .map((id, index) => `  p${index}: productConvertId(sourceId: ${id})`)
      .join("\n");

    const query = `query Convert {\n${aliases}\n}`;

    const response =
      await this.client.graphql<GraphQLResponse<Record<string, number | null>>>(
        query,
      );

    if (response.errors) {
      throw new Error(`GraphQL Error: ${response.errors[0]?.message}`);
    }

    const mapping: Record<number, number> = {};

    uniqueIds.forEach((id, index) => {
      const webshopId = response.data[`p${index}`];
      if (webshopId !== undefined && webshopId !== null && webshopId > 0) {
        mapping[id] = webshopId;
      }
    });

    return mapping;
  }

  /**
   * Searches products via GraphQL with full faceted filtering
   * (brand, Nutri-Score, diet, bonus, etc.).
   *
   * Note: this endpoint does not return bonusMechanism text for multi-buy
   * deals. Use `getMultiple` to enrich results with bonus data.
   *
   * @param input Search query, sorting, pagination and facets
   */
  public async searchProducts(
    input: SearchProductsInput,
  ): Promise<SearchProductsData["searchProducts"]> {
    const query = `
      query SearchProducts($input: SearchProductsInput!) {
        searchProducts(input: $input) {
          totalFound
          products {
            id title brand category salesUnitSize isSponsored
            priceV2 {
              now { amount }
              was { amount }
              discount { description promotionType segmentType }
            }
            imagePack { small { url width height } }
            availability { isOrderable }
          }
          facets {
            facets { label name type options { name value matches selected } }
            quickFilters { label name type options { name value matches selected } }
          }
        }
      }
    `;

    const searchInput: Record<string, unknown> = {
      query: input.query,
      page: {
        number: input.page?.number ?? 0,
        size: input.page?.size ?? 36,
      },
    };

    if (input.facets && input.facets.length > 0) {
      searchInput.facets = input.facets.map((facet) => ({
        label: facet.label,
        values: { values: facet.values.values },
      }));
    }

    const response = await this.client.graphql<GraphQLResponse<SearchProductsData>>(
      query,
      {
        input: {
          query: input.query,
          sortType: input.sortType ?? "RELEVANCE",
          searchInput,
        },
      },
      "SearchProducts",
    );

    if (response.errors) {
      throw new Error(`GraphQL Error: ${response.errors[0]?.message}`);
    }

    return response.data.searchProducts;
  }

  /**
   * Retrieves full details for a single product.
   *
   * @param webshopId The webshop ID of the product
   */
  public async getDetail(webshopId: number): Promise<ProductDetailResponse> {
    return await this.client.request<ProductDetailResponse>(
      `/mobile-services/product/detail/v4/fir/${webshopId}`,
    );
  }

  /**
   * Retrieves basic product cards for multiple products at once.
   * Includes categories, brands, nutriscore, and property icons (e.g., vegetarian).
   *
   * @param webshopIds Array of webshop IDs to fetch
   */
  public async getMultiple(webshopIds: number[]): Promise<ProductCard[]> {
    if (webshopIds.length === 0) return [];

    const uniqueIds = Array.from(new Set(webshopIds)).filter((id) => id > 0);

    const queryParams = new URLSearchParams();
    uniqueIds.forEach((id) => queryParams.append("ids", id.toString()));
    queryParams.append("sortOn", "INPUT_PRODUCT_IDS");

    // The API returns the array directly at the root, not nested under a 'products' key
    const response = await this.client.request<ProductCard[]>(
      `/mobile-services/product/search/v2/products?${queryParams.toString()}`,
    );

    return response || [];
  }

  /**
   * Retrieves lightweight nutritional information for a single product.
   *
   * @param webshopId The webshop ID of the product
   * @returns An array of nutrients, or an empty array if not found
   */
  public async getNutrition(webshopId: number): Promise<Nutrient[]> {
    const query = `
      query FetchProduct($productId: Int!) {
        product(id: $productId) {
          id
          tradeItem {
            nutritions {
              nutrients { type name value }
            }
          }
        }
      }
    `;

    const response = await this.client.graphql<
      GraphQLResponse<GraphQLProductData>
    >(query, { productId: webshopId });

    if (response.errors) {
      throw new Error(`GraphQL Error: ${response.errors[0]?.message}`);
    }

    const nutritions = response.data.product?.tradeItem?.nutritions;
    if (nutritions && nutritions.length > 0) {
      return nutritions[0]?.nutrients || [];
    }

    return [];
  }
}
