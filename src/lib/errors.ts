import { NextResponse } from 'next/server';

export class AppError extends Error {
  code: string;
  status: number;

  constructor(code: string, message: string, status = 400) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
  }
}

export function errorResponse(code: string, message: string, status = 400): NextResponse {
  return NextResponse.json(
    {
      error: {
        code,
        message,
      },
    },
    { status }
  );
}

export function handleAppError(err: unknown): NextResponse {
  if (err instanceof AppError) {
    return errorResponse(err.code, err.message, err.status);
  }

  // Never expose raw internal errors to clients
  return errorResponse(
    'INTERNAL_ERROR',
    'An unexpected error occurred while analyzing the content. Please try again.',
    500
  );
}
