import type { AppieClient } from "../client.js";
import type {
  AirMilesBalanceData,
  AirMilesTransaction,
  AirMilesTransactionsData,
  GraphQLResponse,
  KoopzegelsBalanceData,
  PremiumSavingsData,
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
        purchaseStampSavingGoal {
          name
          amount {
            amount
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

  /**
   * Retrieves the recent Air Miles transactions.
   */
  public async getAirMilesTransactions(): Promise<AirMilesTransaction[]> {
    const query = `
      query FetchAirMilesTransactions {
        milesTransactions {
          date
          domain
          description
          value
        }
      }
    `;

    const response =
      await this.client.graphql<GraphQLResponse<AirMilesTransactionsData>>(
        query,
      );

    if (response.errors) {
      throw new Error(`GraphQL Error: ${response.errors[0]?.message}`);
    }

    return response.data.milesTransactions || [];
  }

  /**
   * Retrieves the total savings accumulated through an AH Premium subscription,
   * including discounts on organic (bio) products, Bonus Box, and delivery.
   */
  public async getPremiumSavings(): Promise<
    PremiumSavingsData["subscriptionPremiumSavingsV2"]
  > {
    const query = `
      query FetchPremiumSavings {
        subscriptionPremiumSavingsV2 {
          lastUpdated
          subscriptionStartDate
          totalSavedAmount { amount }
          bioDiscountAmount { amount }
          bonusBoxDiscountAmount { amount }
          bonusBoxDiscountPremiumExclusiveAmount { amount }
          deliveryBundleDiscountAmount { amount }
          terraDiscountAmount { amount }
          totalAdditionalStamps
          additionalAirmilesObtained
        }
      }
    `;

    const response =
      await this.client.graphql<GraphQLResponse<PremiumSavingsData>>(query);

    if (response.errors) {
      throw new Error(`GraphQL Error: ${response.errors[0]?.message}`);
    }

    return response.data.subscriptionPremiumSavingsV2;
  }
}
