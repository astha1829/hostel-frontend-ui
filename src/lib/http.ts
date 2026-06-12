const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

class HttpError extends Error {
  status: number;
  info?: any;

  constructor(message: string, status: number, info?: any) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.info = info;
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...customConfig } = options;
  
  // Construct URL with query parameters if present
  let url = `${BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const defaultHeaders: HeadersInit = options.body instanceof FormData ? {} : {
    "Content-Type": "application/json",
  };

  const config: RequestInit = {
    method: options.method || "GET",
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    ...customConfig,
  };

  if (config.body && typeof config.body === "object" && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    
    let responseData: any;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
      let errorMessage = responseData?.message || `HTTP error! Status: ${response.status}`;
      if (Array.isArray(errorMessage) && errorMessage.length > 0) {
        errorMessage = errorMessage[0];
      } else if (response.status === 422 && responseData?.errors && typeof responseData.errors === 'object') {
        const firstErrorKey = Object.keys(responseData.errors)[0];
        if (firstErrorKey && Array.isArray(responseData.errors[firstErrorKey]) && responseData.errors[firstErrorKey].length > 0) {
          errorMessage = responseData.errors[firstErrorKey][0];
        }
      }

      throw new HttpError(
        errorMessage,
        response.status,
        responseData
      );
    }

    // Unwrap Laravel success responses that wrap data
    if (responseData && typeof responseData === "object" && responseData.status === "Success" && "data" in responseData) {
      return responseData.data as T;
    }

    return responseData as T;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    // Network or internal parsing error
    throw new HttpError(
      error instanceof Error ? error.message : "Network request failed",
      500
    );
  }
}

export const http = {
  get: <T>(endpoint: string, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(endpoint, { ...options, method: "GET" }),
    
  post: <T>(endpoint: string, body?: any, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(endpoint, { ...options, method: "POST", body }),
    
  put: <T>(endpoint: string, body?: any, options?: Omit<RequestOptions, "method" | "body">) => {
    if (body instanceof FormData) {
      body.append("_method", "PUT");
      return request<T>(endpoint, { ...options, method: "POST", body });
    }
    return request<T>(endpoint, { ...options, method: "PUT", body });
  },
    
  patch: <T>(endpoint: string, body?: any, options?: Omit<RequestOptions, "method" | "body">) => {
    if (body instanceof FormData) {
      body.append("_method", "PATCH");
      return request<T>(endpoint, { ...options, method: "POST", body });
    }
    return request<T>(endpoint, { ...options, method: "PATCH", body });
  },
    
  delete: <T>(endpoint: string, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};
export { HttpError };
