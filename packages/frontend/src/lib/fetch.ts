export interface HttpError extends Error {
  response: Response;
  body?: unknown;
}

let csrfToken: string | null = null;

export function setCsrfToken(token: string) {
  csrfToken = token;
}

export async function sendJSON<T>(
  url: string, 
  options: RequestInit & { json?: unknown } = {} 
): Promise<T> {
  const { json, headers, ...restOptions } = options;

  // Prepara Headers
  const reqHeaders = new Headers(headers);

  if (json) {
    reqHeaders.set('Content-Type', 'application/json');
  }

  // Injeção Automática de CSRF
  if (csrfToken && options.method && !['GET', 'HEAD'].includes(options.method.toUpperCase())) {
    reqHeaders.set('x-csrf-token', csrfToken);
  }

  // Recria o objeto de opções com tipagem correta (RequestInit)
  const fetchOptions: RequestInit = {
    ...restOptions,
    headers: reqHeaders,
    body: json ? JSON.stringify(json) : undefined,
  };

  try {
    // Validação ou logs pré-envio podem ser feitos aqui
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