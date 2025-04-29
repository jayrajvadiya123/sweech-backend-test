import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        const ctx = context.switchToHttp().getResponse();
        return {
          statusCode: ctx.statusCode || 200,
          success: true,
          data,
        };
      })
    );
  }
}
