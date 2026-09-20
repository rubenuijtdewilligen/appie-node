import type { AppieClient } from "./client.js";

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export class AuthFlow {
  private client: AppieClient;

  constructor(client: AppieClient) {
    this.client = client;
  }

  /**
   * Retrieves an anonymous token (useful for public endpoints like product search)
   */
  public async getAnonymousToken(): Promise<AuthResponse> {
    const response = await this.client.request<AuthResponse>(
      "/mobile-auth/v1/auth/token/anonymous",
      {
        method: "POST",
        body: JSON.stringify({ clientId: "appie-ios" }),
      },
    );

    this.client.setToken(response.access_token);
    return response;
  }

  /**
   * Generates the URL for browser-based login
   */
  public createLoginUrl(redirectUri = "appie://login-exit"): string {
    return `https://login.ah.nl/login?client_id=appie-ios&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}`;
  }

  /**
   * Exchanges an authorization code for access and refresh tokens
   */
  public async exchangeToken(code: string): Promise<AuthResponse> {
    const response = await this.client.request<AuthResponse>(
      "/mobile-auth/v1/auth/token",
      {
        method: "POST",
        body: JSON.stringify({ clientId: "appie-ios", code }),
      },
    );

    this.client.setToken(response.access_token);
    return response;
  }

  /**
   * Refreshes the access token using a refresh token
   */
  public async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await this.client.request<AuthResponse>(
      "/mobile-auth/v1/auth/token/refresh",
      {
        method: "POST",
        body: JSON.stringify({ clientId: "appie-ios", refreshToken }),
      },
    );

    this.client.setToken(response.access_token);
    return response;
  }
}
