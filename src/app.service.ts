import { Injectable, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(
    private jwt: JwtService
  ) { }

  prisma = new PrismaClient();

  getHello(): string {
    return 'Hello World!';
  }

  async getUser(): Promise<any[]> {
    let data = await this.prisma.nguoiDung.findMany();
    return data
  }

}
