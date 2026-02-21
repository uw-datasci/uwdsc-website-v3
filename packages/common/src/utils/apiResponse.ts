import { NextResponse } from "next/server";

/**
 * Standardized helpers for NextResponse in API routes.
 * Use ApiResponse.* for consistent status codes and body shapes.
 */
export class ApiResponse {
  /**
   * Returns a 200 OK response with optional JSON body.
   */
  static ok<T>(data: T = {} as T, init?: ResponseInit): NextResponse {
    return NextResponse.json(data, { status: 200, ...init });
  }

  /**
   * Returns a 400 Bad Request response with error and optional message.
   */
  static badRequest(message?: string, error = "Bad Request"): NextResponse {
    const body = message ? { error, message } : { error };
    return NextResponse.json(body, { status: 400 });
  }

  /**
   * Returns a 401 Unauthorized response.
   */
  static unauthorized(message?: string, error = "Unauthorized"): NextResponse {
    const body = message ? { error, message } : { error };
    return NextResponse.json(body, { status: 401 });
  }

  /**
   * Returns a 404 Not Found response.
   */
  static notFound(error = "Not found"): NextResponse {
    return NextResponse.json({ error }, { status: 404 });
  }

  /**
   * Returns a 500 Internal Server Error response.
   * Message can be a string, Error, or unknown (from catch); error is the fallback title.
   */
  static serverError(
    message?: unknown,
    error = "Internal server error",
  ): NextResponse {
    const messageStr =
      message instanceof Error ? message.message : JSON.stringify(message);

    const body =
      messageStr === undefined ? { error } : { error, message: messageStr };
    return NextResponse.json(body, { status: 500 });
  }

  /**
   * Returns a JSON response with optional status and init.
   * Use for custom status codes or one-off body shapes.
   */
  static json<T>(data: T, status = 200, init?: ResponseInit): NextResponse {
    return NextResponse.json(data, { status, ...init });
  }

  /**
   * Returns a response with a string body and custom Content-Type.
   * Use for non-JSON responses (e.g. text/calendar, text/plain, text/csv).
   */
  static text(
    body: string,
    contentType: string,
    status = 200,
    init?: ResponseInit,
  ): NextResponse {
    return new NextResponse(body, {
      status,
      ...init,
      headers: {
        "Content-Type": contentType,
        ...init?.headers,
      },
    });
  }
}
