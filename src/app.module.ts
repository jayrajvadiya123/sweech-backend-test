import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { PostModule } from "./post/post.module";
import { CommentModule } from "./comment/comment.module";
import { LoginHistoryModule } from "./login-history/login-history.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    AuthModule,
    UserModule,
    PostModule,
    CommentModule,
    LoginHistoryModule,
  ],
})
export class AppModule {}
