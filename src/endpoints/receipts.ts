import type { AppieClient } from "../client.js";
import type {
  GraphQLResponse,
  PosReceiptsPageData,
  PosReceiptDetailsData,
} from "../types.js";

export class ReceiptsFlow {
  private client: AppieClient;

  constructor(client: AppieClient) {
    this.client = client;
  }

  /**
   * Retrieves a list of all recent in-store receipts.
   */
  public async getAll(
    options: { offset?: number; limit?: number } = {},
  ): Promise<PosReceiptsPageData["posReceiptsPage"]["posReceipts"]> {
    const offset = options.offset ?? 0;
    const limit = options.limit ?? 100;

    const query = `
      query FetchPosReceipts($offset: Int!, $limit: Int!) {
        posReceiptsPage(pagination: {offset: $offset, limit: $limit}) {
          posReceipts {
            id
            dateTime
            totalAmount {
              amount
            }
          }
        }
      }
    `;

    const response = await this.client.graphql<
      GraphQLResponse<PosReceiptsPageData>
    >(query, { offset, limit });

    if (response.errors) {
      throw new Error(`GraphQL Error: ${response.errors[0]?.message}`);
    }

    return response.data.posReceiptsPage.posReceipts;
  }

  /**
   * Retrieves the full details of a specific receipt, including all items.
   * @param id The transaction ID (e.g., from getAll())
   */
  public async getById(
    id: string,
  ): Promise<PosReceiptDetailsData["posReceiptDetails"]> {
    const query = `
      query FetchReceipt($id: String!) {
        posReceiptDetails(id: $id) {
          id
          products {
            id
            quantity
            name
            price {
              amount
            }
            amount {
              amount
            }
          }
          discounts {
            name
            amount {
              amount
            }
          }
          payments {
            method
            amount {
              amount
            }
          }
        }
      }
    `;

    const response = await this.client.graphql<
      GraphQLResponse<PosReceiptDetailsData>
    >(query, { id });

    if (response.errors) {
      throw new Error(`GraphQL Error: ${response.errors[0]?.message}`);
    }

    return response.data.posReceiptDetails;
  }
}
