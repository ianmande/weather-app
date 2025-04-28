import {API_URL} from '@config/constants';

interface ApiResponse<T> {
  data: T;
  statusCode: number;
  success: boolean;
  message: string;
}

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

class ApiService {
  baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: FetchOptions = {}): Promise<ApiResponse<T>> {
    const {params, ...fetchOptions} = options;

    let url = `${this.baseUrl}${endpoint}`;

    if (params) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        queryParams.append(key, value);
      });
      url += `?${queryParams.toString()}`;
    }

    const headers = new Headers(options.headers);
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.append('Content-Type', 'application/json');
    }

    const auth = localStorage.getItem('auth');

    if (auth) {
      try {
        const authData = JSON.parse(auth);
        headers.append('Authorization', `Bearer ${authData.access_token}`);
      } catch (error) {
        console.error('Error al parsear datos de autenticación', error);
      }
    }

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('auth');
      }

      let errorMessage: string;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || response.statusText;
      } catch {
        errorMessage = response.statusText;
      }

      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return {
        data: {} as T,
        statusCode: 204,
        success: true,
        message: 'Success with no content',
      };
    }

    return response.json();
  }

  get<T>(endpoint: string, options: FetchOptions = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {...options, method: 'GET'});
  }

  post<T>(endpoint: string, data?: unknown, options: FetchOptions = {}): Promise<ApiResponse<T>> {
    const body = data instanceof FormData ? data : data ? JSON.stringify(data) : undefined;

    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body,
    });
  }

  put<T>(endpoint: string, data?: unknown, options: FetchOptions = {}): Promise<ApiResponse<T>> {
    const body = data instanceof FormData ? data : data ? JSON.stringify(data) : undefined;

    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body,
    });
  }

  patch<T>(endpoint: string, data?: unknown, options: FetchOptions = {}): Promise<ApiResponse<T>> {
    const body = data instanceof FormData ? data : data ? JSON.stringify(data) : undefined;

    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body,
    });
  }

  delete<T>(endpoint: string, options: FetchOptions = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {...options, method: 'DELETE'});
  }
}

export const request = new ApiService(API_URL);
