import { Injectable, HttpCode } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class BinhLuanService {
    constructor(
        private jwt: JwtService,
        private config: ConfigService
    ) { }

    private prisma = new PrismaClient();

    //getDANH SACH BINH LUAN
    @HttpCode(200)
    async binhLuanList(): Promise<any> {
        let data = await this.prisma.binhLuan.findMany()
        return {
            statusCode: 200,
            content: data
        }
    }

    //TAO BINH LUAN MOI
    @HttpCode(200)
    async binhLuanMoi(id: number, ma_phong: number, ma_nguoi_binh_luan: number, date: any, noi_dung: string, sao_binh_luan: number): Promise<any> {
        let inputId = await this.prisma.binhLuan.findFirst({
            where: {
                id
            }
        })
        if (inputId === null) {
            await this.prisma.binhLuan.create({
                data: {
                    id, ma_phong, ma_nguoi_binh_luan, ngay_binh_luan: date, noi_dung, sao_binh_luan
                }
            });

            return {
                statusCode: 201,
                message: "Thêm mới thành công",
                content: {
                    id, ma_phong, ma_nguoi_binh_luan, ngay_binh_luan: date, noi_dung, sao_binh_luan
                }
            }
        }
        else {
            return "Mã Id đã tồn tại"
        }

    }
}
