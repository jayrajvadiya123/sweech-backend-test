import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Response } from "express";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal server error";

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseBody = exception.getResponse();
      message = (responseBody as any).message || responseBody;
    }

    response.status(status).json({
      statusCode: status,
      success: false,
      data: {
        message: message,
      },
    });
  }
}
