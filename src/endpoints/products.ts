import type { AppieClient } from "../client.js";
import type { GraphQLResponse } from "../types.js";

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
}
