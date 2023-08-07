import { RequestContext } from 'nestjs-request-context';

export class AppRequestContext extends RequestContext {
  requestId: string;
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
}
