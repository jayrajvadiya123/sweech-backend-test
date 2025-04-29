import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findUserByEmail(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { email },
      select: {
        id: true,
        username: true,
        createdAt: true,
      },
    });
    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.updateMany({
      where: { id },
      data: updateUserDto,
    });
  }
}
