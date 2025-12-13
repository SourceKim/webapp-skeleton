declare module '@/exceptions/http.exception' {
  export class HttpException extends Error {
    public status: number;
    public message: string;
    public error?: unknown;
    constructor(status: number, message: string, error?: unknown);
  }
} 