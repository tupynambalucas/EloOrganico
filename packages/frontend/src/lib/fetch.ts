export interface HttpError extends Error {
  response: Response;
  body?: unknown;
}

export async function sendJSON<T>(
  url: string, 
  options: RequestInit & { json?: unknown } = {} 
): Promise<T> {
  const { json, ...fetchOptions } = options;

  try {
    if (json) {
      fetchOptions.headers = {
        ...fetchOptions.headers,
        'Content-Type': 'application/json',
      };
      fetchOptions.body = JSON.stringify(json);
    }
  } catch (err) {
    console.error(err);
    throw new Error("Falha ao preparar os dados para envio.");
  }

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    const error = new Error(`HTTP error! status: ${response.status}`) as HttpError;
    
    error.response = response;

    try {
      error.body = await response.json();
    } catch {
      error.body = await response.text();
    }
    
    throw error;
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json() as Promise<T>;
  }

  return null as unknown as Promise<T>;
}