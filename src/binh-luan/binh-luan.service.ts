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
        let data = await this.prisma.binhLuan.findMany();
        let jsonDate = (new Date()).toJSON();

        return {
            statusCode: 200,
            content: data,
            dateTime: jsonDate
        }
    }

    //TAO BINH LUAN MOI
    @HttpCode(200)
    async binhLuanMoi(id: number, ma_phong: number, ma_nguoi_binh_luan: number, date: any, noi_dung: string, sao_binh_luan: number): Promise<any> {
        console.log(id, ma_phong, ma_nguoi_binh_luan, date, noi_dung, sao_binh_luan)
        await this.prisma.binhLuan.create({
            data: {
                ma_phong, ma_nguoi_binh_luan, ngay_binh_luan: date, noi_dung, sao_binh_luan
            }
        })
        // https://stackoverflow.com/questions/70834547/prisma-client-query-for-latest-values-of-each-user
        let newPost = await this.prisma.binhLuan.findFirst({
            where: {
                ma_nguoi_binh_luan
            },
            distinct:['ma_nguoi_binh_luan'],
            orderBy:{
                id:'desc'
            }
        })
        return {
            statusCode: 201,
            message: "Thêm mới thành công",
            content: {
                id: newPost.id,
                ma_phong,
                ma_nguoi_binh_luan,
                ngay_binh_luan: date,
                noi_dung,
                sao_binh_luan
            }
        }
    }

}

