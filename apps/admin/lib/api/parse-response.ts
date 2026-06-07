const HEADSHOT_MAX_BYTES = 5 * 1024 * 1024;

function messageFromPlainText(status: number, text: string): string {
  const trimmed = text.trim();
  if (status === 413 || /request entity too large/i.test(trimmed)) {
    return "File is too large. Please use an image under 5 MB.";
  }
  if (trimmed) {
    return trimmed.length > 200 ? `${trimmed.slice(0, 200)}…` : trimmed;
  }
  return `Request failed (${status})`;
}

/**
 * Parse a fetch Response body as JSON when possible; otherwise throw a readable error.
 */
export async function parseJsonResponse<T = Record<string, unknown>>(
  response: Response,
): Promise<T> {
  const text = await response.text();
  if (!text) {
    return {} as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    const message = messageFromPlainText(response.status, text);
    throw Object.assign(new Error(message), {
      status: response.status,
      details: { raw: text },
    });
  }
}

export function assertHeadshotWithinLimit(file: File): void {
  if (file.size > HEADSHOT_MAX_BYTES) {
    throw new Error("File is too large. Please use an image under 5 MB.");
  }
}
