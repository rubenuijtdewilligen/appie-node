import { AuthFlow } from "./auth.js";
import { ReceiptsFlow } from "./endpoints/receipts.js";
import { ProductsFlow } from "./endpoints/products.js";
import { MemberFlow } from "./endpoints/member.js";

export class AppieClient {
  public auth: AuthFlow;
  public receipts: ReceiptsFlow;
  public products: ProductsFlow;
  public member: MemberFlow;

  private token: string | null = null;
  private readonly API_URL = "https://api.ah.nl";

  constructor(token?: string) {
    this.auth = new AuthFlow(this);
    this.receipts = new ReceiptsFlow(this);
    this.products = new ProductsFlow(this);
    this.member = new MemberFlow(this);
    if (token) this.token = token;
  }

  public setToken(token: string) {
    this.token = token;
  }

  public async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const headers: Record<string, string> = {
      "x-application": "AHWEBSHOP",
      "User-Agent":
        "Appie/9.28 (iPhone17,3; iPhone; CPU OS 26_1 like Mac OS X)",
      "x-client-name": "appie-ios",
      "x-client-version": "9.28",
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API Error ${response.status} on ${endpoint}: ${errorText}`,
      );
    }

    return response.json() as Promise<T>;
  }

  public async graphql<T>(
    query: string,
    variables?: Record<string, unknown>,
  ): Promise<T> {
    const headers = {
      "x-apollo-operation-name": "Fetch",
      "x-apollo-operation-type": "query",
    };

    return this.request<T>("/graphql", {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
    });
  }
}
