
interface APIEndpoint {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  timeout?: number;
}

interface APIResponse<T = any> {
  data: T;
  status: number;
  success: boolean;
  error?: string;
}

export class APIIntegrationManager {
  private static instance: APIIntegrationManager;
  private baseConfig: Partial<APIEndpoint>;
  private rateLimiter: Map<string, number> = new Map();

  private constructor() {
    this.baseConfig = {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  static getInstance(): APIIntegrationManager {
    if (!APIIntegrationManager.instance) {
      APIIntegrationManager.instance = new APIIntegrationManager();
    }
    return APIIntegrationManager.instance;
  }

  private checkRateLimit(endpoint: string, maxRequests = 60, window = 60000): boolean {
    const now = Date.now();
    const key = `${endpoint}-${Math.floor(now / window)}`;
    const current = this.rateLimiter.get(key) || 0;
    
    if (current >= maxRequests) {
      return false;
    }
    
    this.rateLimiter.set(key, current + 1);
    return true;
  }

  async makeRequest<T = any>(
    endpoint: APIEndpoint,
    data?: any,
    options: {
      retries?: number;
      retryDelay?: number;
      skipRateLimit?: boolean;
    } = {}
  ): Promise<APIResponse<T>> {
    const { retries = 3, retryDelay = 1000, skipRateLimit = false } = options;

    if (!skipRateLimit && !this.checkRateLimit(endpoint.url)) {
      throw new Error('Rate limit exceeded');
    }

    const config = {
      ...this.baseConfig,
      ...endpoint,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    try {
      const response = await fetch(config.url, {
        method: config.method,
        headers: config.headers,
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();

      return {
        data: responseData,
        status: response.status,
        success: true,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (retries > 0 && !controller.signal.aborted) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return this.makeRequest(endpoint, data, { 
          ...options, 
          retries: retries - 1 
        });
      }

      return {
        data: null,
        status: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Webhook integration
  async triggerWebhook(url: string, payload: any): Promise<APIResponse> {
    return this.makeRequest({
      url,
      method: 'POST',
    }, payload);
  }

  // Third-party service integrations
  async integrateSlack(webhookUrl: string, message: string): Promise<APIResponse> {
    return this.makeRequest({
      url: webhookUrl,
      method: 'POST',
    }, {
      text: message,
      username: 'WordLens',
      icon_emoji: ':memo:',
    });
  }

  async integrateZapier(webhookUrl: string, data: any): Promise<APIResponse> {
    return this.makeRequest({
      url: webhookUrl,
      method: 'POST',
    }, {
      ...data,
      timestamp: new Date().toISOString(),
      source: 'WordLens',
    });
  }

  async integrateDiscord(webhookUrl: string, content: string): Promise<APIResponse> {
    return this.makeRequest({
      url: webhookUrl,
      method: 'POST',
    }, {
      content,
      username: 'WordLens',
      avatar_url: 'https://example.com/wordlens-avatar.png',
    });
  }

  // Email service integration (generic)
  async sendEmail(
    serviceUrl: string,
    emailData: {
      to: string;
      subject: string;
      body: string;
      isHtml?: boolean;
    }
  ): Promise<APIResponse> {
    return this.makeRequest({
      url: serviceUrl,
      method: 'POST',
    }, emailData);
  }

  // Analytics integration
  async sendAnalyticsEvent(
    analyticsUrl: string,
    eventData: {
      event: string;
      properties: Record<string, any>;
      userId?: string;
    }
  ): Promise<APIResponse> {
    return this.makeRequest({
      url: analyticsUrl,
      method: 'POST',
    }, {
      ...eventData,
      timestamp: Date.now(),
    });
  }

  // Configuration management
  setBaseConfig(config: Partial<APIEndpoint>): void {
    this.baseConfig = { ...this.baseConfig, ...config };
  }

  // Health check for external APIs
  async healthCheck(url: string): Promise<boolean> {
    try {
      const response = await this.makeRequest({
        url,
        method: 'GET',
        timeout: 5000,
      }, null, { skipRateLimit: true });
      return response.success;
    } catch {
      return false;
    }
  }
}

export const apiIntegrations = APIIntegrationManager.getInstance();

// Predefined integration helpers
export const integrationHelpers = {
  slack: (webhookUrl: string, message: string) => 
    apiIntegrations.integrateSlack(webhookUrl, message),
  
  zapier: (webhookUrl: string, data: any) => 
    apiIntegrations.integrateZapier(webhookUrl, data),
  
  discord: (webhookUrl: string, content: string) => 
    apiIntegrations.integrateDiscord(webhookUrl, content),
  
  webhook: (url: string, payload: any) => 
    apiIntegrations.triggerWebhook(url, payload),
};
