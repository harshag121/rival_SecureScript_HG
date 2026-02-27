import axios from 'axios';

export function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as
      | { message?: string | string[] }
      | undefined;

    if (Array.isArray(payload?.message) && payload.message.length > 0) {
      return payload.message[0];
    }
    if (typeof payload?.message === 'string' && payload.message.trim()) {
      return payload.message;
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}
