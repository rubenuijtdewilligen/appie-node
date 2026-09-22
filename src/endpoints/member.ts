import type { AppieClient } from "../client.js";
import type { GraphQLResponse, MemberProfileData } from "../types.js";

export class MemberFlow {
  private client: AppieClient;

  constructor(client: AppieClient) {
    this.client = client;
  }

  /**
   * Retrieves the current user's profile information, including their name,
   * contact details, linked cards, and audiences.
   */
  public async getProfile(): Promise<MemberProfileData["member"]> {
    const query = `
      query FetchMember {
        member {
          id
          emailAddress
          gender
          dateOfBirth
          phoneNumber
          isB2B
          name {
            first
            last
          }
          address {
            street
            houseNumber
            houseNumberExtra
            postalCode
            city
            countryCode
          }
          cards {
            bonus
            gall
            airmiles
          }
          customerProfileAudiences
        }
      }
    `;

    const response =
      await this.client.graphql<GraphQLResponse<MemberProfileData>>(query);

    if (response.errors) {
      throw new Error(`GraphQL Error: ${response.errors[0]?.message}`);
    }

    return response.data.member;
  }
}
