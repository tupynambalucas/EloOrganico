export interface HttpError extends Error {
  response: Response;
  body?: unknown;
}

let csrfToken: string | null = null;

export function setCsrfToken(token: string) {
  csrfToken = token;
}

async function fetchNewCsrfToken(): Promise<string> {
  const res = await fetch('/api/csrf-token');
  if (!res.ok) throw new Error('Falha crítica ao renovar CSRF');
  const data = await res.json();
  return data.token;
}

export async function sendJSON<T>(
  url: string, 
  options: RequestInit & { json?: unknown; _retry?: boolean } = {} // Adicionado _retry
): Promise<T> {
  const { json, headers, _retry, ...restOptions } = options;

  const reqHeaders = new Headers(headers);

  if (json) {
    reqHeaders.set('Content-Type', 'application/json');
  }

  if (csrfToken && options.method && !['GET', 'HEAD'].includes(options.method.toUpperCase())) {
    reqHeaders.set('x-csrf-token', csrfToken);
  }

  const fetchOptions: RequestInit = {
    ...restOptions,
    headers: reqHeaders,
    body: json ? JSON.stringify(json) : undefined,
  };

  const response = await fetch(url, fetchOptions);

  if (response.status === 403 && !_retry) {
    try {
      const newToken = await fetchNewCsrfToken();
      setCsrfToken(newToken);

      return await sendJSON<T>(url, { ...options, _retry: true });
    } catch (refreshErr) {
      console.error('Falha na tentativa de renovação do CSRF:', refreshErr);
    }
  }
  if (!response.ok) {
    const error = new Error(`HTTP error! status: ${response.status}`) as HttpError;
    error.response = response;
    try {
      error.body = await response.json();
    } catch {
      error.body = await response.text();
    }

    if (typeof error.body === 'object' && error.body !== null && 'message' in error.body) {
        error.message = (error.body as { message: string }).message;
    }

    throw error;
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json() as Promise<T>;
  }

  return null as unknown as Promise<T>;
}