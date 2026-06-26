/**
 * Utility functions for making API requests.
 *
 * url: The endpoint URL for the API request. This should be relative to the base API URL (e.g., 'inquiries/1').
 * options: Optional configuration for the fetch request, such as method, headers, body, etc.
 * onData: A callback function that will be called with the parsed JSON data if the request is successful.
 * onError: A callback function that will be called with the error object if the request fails.
 * onFinally: A callback function that will be called when the request is completed, regardless of success or failure.
 */
export async function apiGet<T = any>({ url, options, onData, onError, onFinally }: {
  url: string,
  options?: RequestInit,
  onData?: (data: T[]) => void,
  onError?: (error: any) => void,
  onFinally?: () => void,
}
): Promise<T[]> {
  return fetch(`/api/${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options?.headers,
    },
  }).then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }).then(data => {
    console.log('API response data:', data);
    onData?.(data.data);
    return data;
  }).catch(error => {
    console.error('Error fetching JSON:', error);
    onError?.(error);
    throw error;
  }).finally(() => {
    console.log('API request completed for URL:', url);
    onFinally?.();
  });
}

export async function apiPost<T = any>({ url, body, onData, onError, onFinally }: {
  url: string,
  body: any,
  onData?: (data: T[]) => [void],
  onError?: (error: any) => void,
  onFinally?: () => void,
}): Promise<T[]> {
  return apiGet<T>({
    url,
    options: {
      method: 'POST',
      body: JSON.stringify(body),
    },
    ...(onData && { onData }),
    ...(onError && { onError }),
    ...(onFinally && { onFinally }),
  });
}
