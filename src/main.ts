import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";
import { AllExceptionsFilter } from "./common/interceptors/exceptions.interceptors";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })
  );
  app.enableCors();
  app.setGlobalPrefix("api");

  const config = new DocumentBuilder()
    .setTitle("NestJS Backend API")
    .setDescription("API documentation")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  app.useGlobalInterceptors(new ResponseInterceptor());

  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(3001);
}
bootstrap();
