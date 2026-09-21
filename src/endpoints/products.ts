import type { AppieClient } from "../client.js";
import type {
  GraphQLProductData,
  GraphQLResponse,
  Nutrient,
  ProductCard,
  ProductDetailResponse,
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
