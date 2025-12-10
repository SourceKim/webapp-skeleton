declare module '@/exceptions/http.exception' {
  export class HttpException extends Error {
    public status: number;
    public message: string;
    public error?: any;
    constructor(status: number, message: string, error?: any);
  }
} 