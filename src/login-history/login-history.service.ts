import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as moment from "moment";

@Injectable()
export class LoginHistoryService {
  constructor(private prisma: PrismaService) {}

  async recordLogin(userId: string, ipAddress: string) {
    await this.prisma.loginHistory.create({
      data: {
        userId,
        ipAddress,
        loginTime: new Date(),
      },
    });
  }

  async getLoginRecords(userId: string) {
    const records = await this.prisma.loginHistory.findMany({
      where: { userId },
      orderBy: { loginTime: "desc" },
      take: 30,
    });

    return records.map((record: any) => ({
      loginTime: moment(record.loginTime).format("YYYY-MM-DD HH:mm:ss"),
      ipAddress: record.ipAddress,
      username: record.user.username,
    }));
  }

  async getWeeklyRankings() {
    const startOfWeek = moment().startOf("week").add(1, "day").toDate();
    const endOfWeek = moment().endOf("week").add(1, "day").toDate();

    const logins = await this.prisma.loginHistory.groupBy({
      by: ["userId"],
      where: {
        loginTime: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
        userId: { not: null },
      },
      _count: {
        userId: true,
      },
    });

    const userIds = logins.map((l: any) => l.userId);
    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds as string[] } },
      select: { id: true, username: true },
    });

    const userMap = new Map(users.map((u: any) => [u.id, u.username]));

    const sorted = logins
      .map((login: any) => ({
        userId: login.userId as number,
        count: login._count.userId,
        username: userMap.get(login.userId) || null,
      }))
      .sort((a: any, b: any) => b.count - a.count);

    const rankings = [];
    let rank = 1;
    let prevCount = -1;
    let sameRankCount = 0;

    for (let i = 0; i < sorted.length && rankings.length < 20; i++) {
      const { username, count } = sorted[i];

      if (count !== prevCount) {
        rank += sameRankCount;
        sameRankCount = 1;
        prevCount = count;
      } else {
        sameRankCount++;
      }

      rankings.push({ name: username, loginCount: count, rank });
    }

    if (rankings.length === 0) {
      return [{ name: null, loginCount: null, rank: null }];
    }

    return rankings;
  }
}
