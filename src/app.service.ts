import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AppService {
  prisma = new PrismaClient();

  getHello(): string {
    return 'Hello World!';
  }

  async getUser():Promise<any[]>{
    let data = await this.prisma.nguoiDung.findMany();
    return data
  }
}
