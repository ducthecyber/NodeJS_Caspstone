import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatPhongService {
    constructor(
        private jwt: JwtService,
        private config: ConfigService
    ) { }

    private prisma = new PrismaClient();

    //get DANH SÁCH PHÒNG
    @HttpCode(200)
    async getListDatPhong(): Promise<any> {
        let data = await this.prisma.datPhong.findMany();
        let jsonDate = (new Date()).toJSON();

        return {
            statusCode: 200,
            message: "Lấy thông tin thành công",
            content: data,
            dateTime: jsonDate
        }
    }

    //LẤY DANH SÁCH ĐẶT PHÒNG THEO ID
    async getDatPhongById(id: number): Promise<any> {
        let checkId = await this.prisma.datPhong.findFirst({
            where: {
                id
            }
        })
        let jsonDate = (new Date()).toJSON();
        if (checkId === null) {
            throw new HttpException({
                statusCode: 404,
                message: "Mã đặt phòng không tồn tại trong danh sách",
                content:null,
                dateTime: jsonDate
            },HttpStatus.NOT_FOUND)
        }
        else {
            let data = await this.prisma.datPhong.findFirst({
                where: {
                    id
                }
            })
            return {
                statusCode: 200,
                message: "Lấy thông tin đặt phòng thành công",
                content: data,
                dateTime: jsonDate
            }
        }

    }
    //CHECK QUYỀN THÊM MỚI PHÒNG
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
            return {
                data: {
                    statusCode: 403,
                    content: "User không phải quyền admin",
                    dateTime: jsonDate
                }
            }
        }
    }

    // thêm đặt phòng mới
    async themDatPhongMoi(id: number, ma_phong: number, dateArrive: any, dateLeave: any, so_luong_khach: number, ma_nguoi_dat: number): Promise<any> {
        let jsonDate = (new Date()).toJSON();

        try {
            let checkAuthRoomId = await this.checkAuthRoomId(ma_phong)
            let checkAuthUserId = await this.checkAuthUserId(ma_nguoi_dat)
            // Query createOnePhong is required to return data, but found no record(s).có thể xảy ra khi id truyền vào là 0
            if (checkAuthRoomId && checkAuthUserId) {
                await this.prisma.datPhong.create({
                    data: {
                        ma_phong, ngay_den: dateArrive, ngay_di: dateLeave, so_luong_khach, ma_nguoi_dat
                    }
                })
                // https://stackoverflow.com/questions/70834547/prisma-client-query-for-latest-values-of-each-user
                let newBooking = await this.prisma.datPhong.findFirst({
                    where: {
                        ma_phong
                    },
                    // distinct: ['ma_nguoi_binh_luan'],
                    orderBy: {
                        id: 'desc'
                    }
                })
                return {
                    statusCode: 201,
                    message: "Thêm đặt phòng mới thành công",
                    content: {
                        id: newBooking.id,
                        ma_phong,
                        ngay_den: dateArrive,
                        ngay_di: dateLeave,
                        so_luong_khach,
                        ma_nguoi_dat,
                    },
                    dateTime: jsonDate
                }
            } else {
                return false
            }
        }
        catch {
            throw new HttpException({
                statusCode: 404,
                message: "Kiểm tra lại mã người dùng hoặc mã phòng",
                content: null,
                dateTime: jsonDate
            }, HttpStatus.BAD_REQUEST)
        }
    }

    //CHỈNH SỬA THÔNG TIN PHÒNG THEO ID DAT PHÒNG
    @HttpCode(200)
    async chinhSuaInfoDatPhong(idParam: number, id: number, ma_phong: number, dateArrive: any, dateLeave: any, so_luong_khach: number, ma_nguoi_dat: number): Promise<any> {
        let jsonDate = (new Date()).toJSON();
        let checkAuthBookingId = await this.checkAuthBookingId(idParam)
        let checkAuthUserId = await this.checkAuthUserId(ma_nguoi_dat)
        let checkAuthRoomId = await this.checkAuthRoomId(ma_phong);
        if (checkAuthBookingId.check === true && checkAuthUserId.check === true && checkAuthRoomId.check === true) {
            await this.prisma.datPhong.update({
                data: {
                    ma_phong, ngay_den: dateArrive, ngay_di: dateLeave, so_luong_khach, ma_nguoi_dat
                },
                where: {
                    id: Number(idParam)
                }
            })
            let updateDatPhong = await this.prisma.datPhong.findFirst({
                where: {
                    id: idParam
                }
            })
            return {
                statusCode: 200,
                message: "Chỉnh sửa thành công",
                content: updateDatPhong,
                dateTime: jsonDate
            }
        }
        if (!checkAuthBookingId.check) {
            throw new HttpException({
                statusCode: 404,
                message: "Mã đặt phòng không tồn tại",
                content: null,
                dateTime: jsonDate
            }, HttpStatus.NOT_FOUND)
        }
        if (!checkAuthUserId.check) {
            throw new HttpException({
                statusCode: 404,
                message: "Mã người đặt không tồn tại",
                content: null,
                dateTime: jsonDate
            }, HttpStatus.NOT_FOUND)
        }
        if (!checkAuthRoomId.check) {
            throw new HttpException({
                statusCode: 404,
                message: "Mã phòng không tồn tại",
                content: null,
                dateTime: jsonDate
            }, HttpStatus.NOT_FOUND)
        }
        else {
            throw new HttpException({
                statusCode: 404,
                message: "Please. Kiểm tra lại những mã truyền vào",
                content: null,
                dateTime: jsonDate
            }, HttpStatus.NOT_FOUND)
        }

    }

    //CHECK HỢP LỆ MÃ NGƯỜI ĐẶT
    async checkAuthUserId(ma_nguoi_dat: number,): Promise<any> {

        let checkId = await this.prisma.nguoiDung.findFirst({
            where: {
                id: ma_nguoi_dat
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

    //CHECK HỢP LỆ MÃ ĐẶT PHÒNG
    async checkAuthBookingId(ma_dat_phong: number): Promise<any> {

        let checkId = await this.prisma.datPhong.findFirst({
            where: {
                id: ma_dat_phong
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

    //CHECK HỢP LỆ MÃ PHÒNG
    async checkAuthRoomId(ma_phong: number): Promise<any> {

        let checkId = await this.prisma.phong.findFirst({
            where: {
                id: ma_phong
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
    //LẤY DANH SÁCH ĐẶT PHÒNG THEO MÃ NGƯỜI DÙNG
    async getDatPhongByIdUser(maNguoiDung: number): Promise<any> {
        let jsonDate = (new Date()).toJSON();
        //không có await ở checkAuthUserId thì sẽ báo lỗi "check" property không tồn tại trong Promise<any>
        let checkAuthUserId = await this.checkAuthUserId(maNguoiDung);
        if (checkAuthUserId.check === true) {
            let data = await this.prisma.datPhong.findMany({
                where: {
                    ma_nguoi_dat: maNguoiDung
                },
                orderBy: {
                    id: "desc"
                }
            })
            if (data.length !== 0) {
                return {
                    statusCode: 200,
                    message: "Lấy thông tin thành công",
                    content: data,
                    dateTime: jsonDate
                }
            } else {
                throw new HttpException({
                    statusCode: 404,
                    message: "Người dùng chưa đặt phòng",
                    content: null,
                    dateTime: jsonDate
                }, HttpStatus.BAD_REQUEST)
            }
        }
        else {
            throw new HttpException({
                statusCode: 404,
                message: "Mã người dùng không tồn tại",
                content: null,
                dateTime: jsonDate
            }, HttpStatus.BAD_REQUEST)
        }

    }

    //XÓA THÔNG TIN PHÒNG
    async xoaDatPhong(idDelete: number): Promise<any> {
        let checkAuthBookingId = await this.checkAuthBookingId(idDelete);
        let jsonDate = (new Date()).toJSON();
        if (checkAuthBookingId.check) {
            await this.prisma.datPhong.delete({
                where: {
                    id: idDelete
                }
            })
            return {
                data: {
                    statusCode: 200,
                    message: "Xóa thông tin đặt phòng thành công",
                    content: null,
                    dateTime: jsonDate
                }
            }
        } else {
            throw new HttpException({
                statusCode: 404,
                message: "Mã đặt phòng này đã xóa hoặc chưa từng tồn tại",
                content: null,
                dateTime: jsonDate
            }, HttpStatus.NOT_FOUND)

        }

    }

}
