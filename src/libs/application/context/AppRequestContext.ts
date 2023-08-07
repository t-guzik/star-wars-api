import { RequestContext } from 'nestjs-request-context';
import { DatabaseTransactionConnection } from 'slonik';

export class AppRequestContext extends RequestContext {
  requestId: string;
  transactionConnection?: DatabaseTransactionConnection; // For global transactions
}

export class RequestContextService {
  static getContext(): AppRequestContext | null {
    return RequestContext.currentContext?.req || null;
  }

  static setRequestId(id: string): void {
    const ctx = this.getContext();
    if (ctx) {
      ctx.requestId = id;
    }
  }

  static getRequestId() {
    return this.getContext()?.requestId || 'UNKNOWN';
  }

  static getTransactionConnection(): DatabaseTransactionConnection | undefined {
    const ctx = this.getContext();

    return ctx?.transactionConnection;
  }

  static setTransactionConnection(
    transactionConnection?: DatabaseTransactionConnection,
  ): void {
    const ctx = this.getContext();
    if (ctx) {
      ctx.transactionConnection = transactionConnection;
    }
  }

  static cleanTransactionConnection(): void {
    const ctx = this.getContext();
    if (ctx) {
      ctx.transactionConnection = undefined;
    }
  }
}
