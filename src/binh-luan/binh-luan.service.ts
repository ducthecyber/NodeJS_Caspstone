import { Injectable, HttpCode, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ApiTags } from '@nestjs/swagger';
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
            message:"Lấy thông tin thành công",
            content: data,
            dateTime: jsonDate
        }
    }

    //TAO BINH LUAN MOI
    @HttpCode(201)
    async binhLuanMoi(id: number, ma_phong: number, ma_nguoi_binh_luan: number, date: any, noi_dung: string, sao_binh_luan: number): Promise<any> {
        let jsonDate = (new Date()).toJSON();

        try {
            let checkAuthRoomId = await this.checkAuthRoomId(Number(ma_phong));
            let checkAuthUserId = await this.checkAuthUserId(Number(ma_nguoi_binh_luan));
            if (checkAuthRoomId && checkAuthUserId) {
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
                    distinct: ['ma_nguoi_binh_luan'],
                    orderBy: {
                        id: 'desc'
                    }
                })
                console.log(newPost)
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
            } else {
                return false
            }
        }
        catch {
            throw new HttpException({
                statusCode: 400,
                message: "Mã phòng hoặc mã người bình luận không tồn tại",
                content: null,
                dateTime: jsonDate
            }, HttpStatus.BAD_REQUEST)
        }

    }

    //EDIT BINH LUAN
    @HttpCode(200)
    async chinhSuaBinhLuan(idParam: number, ma_phong: number, ma_nguoi_binh_luan: number, date: any, noi_dung: string, sao_binh_luan: number): Promise<any> {
        let jsonDate = (new Date()).toJSON();
        try {
            let checkAuthRoomId = await this.checkAuthRoomId(Number(ma_phong));
            let checkAuthUserId = await this.checkAuthUserId(Number(ma_nguoi_binh_luan));
            if (checkAuthRoomId && checkAuthUserId) {
                await this.prisma.binhLuan.update({
                    data: { ma_phong, ma_nguoi_binh_luan, ngay_binh_luan: date, noi_dung, sao_binh_luan },
                    where: {
                        id: Number(idParam)
                    }
                })

                let updateInfo = await this.prisma.binhLuan.findFirst({
                    where: { id: idParam }
                })
                return {
                    statusCode: 200,
                    message: "Chỉnh sửa thành công",
                    content: updateInfo,
                    dateTime: jsonDate
                }
            }
            else {
                return false
            }
        }
        catch {
            throw new HttpException({
                statusCode: 400,
                message: "Mã phòng hoặc mã người bình luận không tồn tại",
                content: null,
                dateTime: jsonDate
            }, HttpStatus.BAD_REQUEST)
        }

    }

    //CHECK QUYỀN CHỈNH SỬA
    async checkAuthAccount(id: number): Promise<any> {
        let checkData = await this.prisma.nguoiDung.findFirst({
            where: {
                id
            }
        })
        if (checkData.role === "ADMIN" || checkData.role === "admin") {
            return true
        }
        else {
            let jsonDate = (new Date()).toJSON();
            throw new HttpException({
                statusCode: 403,
                message: "User không phải quyền admin",
                content: null,
                dateTime: jsonDate
            }, HttpStatus.FORBIDDEN)

        }
    }

    //XÓA BÌNH LUẬN
    async deleteComment(idDelete: number): Promise<any> {

        let jsonDate = (new Date()).toJSON();
        try {
            let checkIdComment = await this.prisma.binhLuan.findFirst({
                where: {
                    id: idDelete
                }
            })
            if (checkIdComment.id !== null) {
                await this.prisma.binhLuan.delete({
                    where: {
                        id: idDelete
                    }
                })
                return {
                    statusCode: 200,
                    message: "Xóa bình luận thành công",
                    content: null,
                    dateTime: jsonDate
                }
            } else {
                return false
            }
        } catch (err) {
            throw new HttpException({
                statusCode: 400,
                message: "Comment này đã xóa hoặc không tồn tại",
                content: null,
                dateTime: jsonDate
            }, HttpStatus.BAD_REQUEST)

        }

    }

    //GET BÌNH LUẬN THEO MÃ PHÒNG
    async getCommentById(idPhong: number): Promise<any> {

        let jsonDate = (new Date()).toJSON();
      
            let checkAuthRoomId = await this.checkAuthRoomId(Number(idPhong))
            let data = await this.prisma.binhLuan.findMany({
                where: {
                    ma_phong:idPhong
                }
            })
            if (checkAuthRoomId.check === true && data.length > 0) {
                return {
                    statusCode: 200,
                    message:"Lấy thông tin thành công",
                    content: data,
                    dateTime: jsonDate
                }
            }
            if(checkAuthRoomId.check === true && data.length ===0){
                throw new HttpException({
                    statusCode: 404,
                    message: "Chưa có người bình luận mã phòng này",
                    content: null,
                    dateTime: jsonDate
                }, HttpStatus.NOT_FOUND)
            }
            else{
                throw new HttpException({
                    statusCode: 400,
                    message: "Mã phòng này không có nha người ơi",
                    content: null,
                    dateTime: jsonDate
                }, HttpStatus.BAD_REQUEST)
            }

        

    }

    //CHECK HỢP LỆ MÃ PHÒNG
    async checkAuthRoomId(ma_phong: number): Promise<any> {

        let checkId = await this.prisma.phong.findFirst({
            where: {
                id: ma_phong
            }
        })
        console.log(checkId)
        if (checkId === null) {
            return {
                check: false,
            }
        } else {
            return {
                check: true,
            }
        }


    }

    //CHECK HỢP LỆ MÃ NGƯỜI BÌNH LUẬN
    async checkAuthUserId(ma_user: number): Promise<any> {

        let checkId = await this.prisma.nguoiDung.findFirst({
            where: {
                id: ma_user
            }
        })

        if (checkId === null) {
            return {
                check: false,
            }
        } else {
            return {
                check: true,
            }
        }


    }

}

