export class AppieClient {
  private token: string | null = null;
  private readonly API_URL = "https://api.ah.nl";

  constructor(token?: string) {
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
      "User-Agent": "Appie/8.22.3",
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
        `API Error ${response.status} op ${endpoint}: ${errorText}`,
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
