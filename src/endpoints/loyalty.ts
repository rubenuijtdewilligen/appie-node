import type { AppieClient } from "../client.js";
import type {
  AirMilesBalanceData,
  GraphQLResponse,
  KoopzegelsBalanceData,
} from "../types.js";

export class LoyaltyFlow {
  private client: AppieClient;

  constructor(client: AppieClient) {
    this.client = client;
  }

  /**
   * Retrieves the current Koopzegels balance, including full booklets, total invested money, accumulated interest, and total payout value.
   */
  public async getKoopzegelsBalance(): Promise<KoopzegelsBalanceData> {
    const query = `
      query FetchKoopzegels {
        purchaseStampBalance {
          points {
            currentBookletPoints
            fullBooklets
            totalPoints
          }
          money {
            invested { amount }
            interest { amount }
            payout { amount }
          }
        }
      }
    `;

    const response =
      await this.client.graphql<GraphQLResponse<KoopzegelsBalanceData>>(query);

    if (response.errors) {
      throw new Error(`GraphQL Error: ${response.errors[0]?.message}`);
    }

    return response.data;
  }

  /**
   * Retrieves the current Air Miles balance.
   */
  public async getAirMilesBalance(): Promise<number> {
    const query = `
      query FetchAirMiles {
        milesBalance {
          balance
        }
      }
    `;

    const response =
      await this.client.graphql<GraphQLResponse<AirMilesBalanceData>>(query);

    if (response.errors) {
      throw new Error(`GraphQL Error: ${response.errors[0]?.message}`);
    }

    return response.data.milesBalance.balance;
  }
}
