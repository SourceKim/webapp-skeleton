import type { ErrorDetail } from '@/types/error';

declare module '@/exceptions/http.exception' {
  export class HttpException extends Error {
    public status: number;
    public message: string;
    public error?: ErrorDetail;
    constructor(status: number, message: string, error?: ErrorDetail);
  }
} 