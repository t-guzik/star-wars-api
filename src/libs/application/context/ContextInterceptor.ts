import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { nanoid } from 'nanoid';
import { RequestContextService } from './AppRequestContext';

@Injectable()
export class ContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const requestId = request?.body?.requestId ?? nanoid(6);

    RequestContextService.setRequestId(requestId);

    return next.handle();
  }
}
