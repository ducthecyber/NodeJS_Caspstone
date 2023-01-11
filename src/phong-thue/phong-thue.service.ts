import { HttpCode, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PhongThueService {
    constructor(
        private jwt: JwtService,
        private config: ConfigService
    ) { }

    private prisma = new PrismaClient();

    //get DANH SÁCH PHÒNG
    @HttpCode(200)
    async getListPhong(): Promise<any> {
        let data = await this.prisma.phong.findMany();
        let jsonDate = (new Date()).toJSON();

        return {
            statusCode: 200,
            content: data,
            dateTime: jsonDate
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

    // thêm phòng mới
    @HttpCode(201)
    async themPhongMoi(id: number, ten_phong: string, khach: number, phong_ngu: number, giuong: number, phong_tam: number, mo_ta: string, gia_tien: number, may_giat: boolean, ban_la: boolean, tivi: boolean, dieu_hoa: boolean, wifi: boolean, bep: boolean, do_xe: boolean, ho_boi: boolean, ban_ui: boolean, hinh_anh: string, ma_vi_tri: number): Promise<any> {
        // Query createOnePhong is required to return data, but found no record(s).có thể xảy ra khi id truyền vào là 0
        await this.prisma.phong.create({
            data: {
                ten_phong, khach, phong_ngu, giuong, phong_tam, mo_ta, gia_tien, may_giat, ban_la, tivi, dieu_hoa, wifi, bep, do_xe, ho_boi, ban_ui, hinh_anh, ma_vi_tri
            }
        })
        // https://stackoverflow.com/questions/70834547/prisma-client-query-for-latest-values-of-each-user
        let newRoom = await this.prisma.phong.findFirst({
            where: {
                ten_phong
            },
            // distinct: ['ma_nguoi_binh_luan'],
            orderBy: {
                id: 'desc'
            }
        })
        let jsonDate = (new Date()).toJSON();
        return {
            statusCode: 201,
            message: "Thêm phòng mới thành công",
            content: {
                id: newRoom.id,
                ten_phong,
                khach,
                phong_ngu,
                giuong,
                phong_tam,
                mo_ta,
                gia_tien,
                may_giat,
                ban_la,
                tivi,
                dieu_hoa,
                wifi,
                bep,
                do_xe,
                ho_boi,
                ban_ui,
                hinh_anh,
                ma_vi_tri
            },
            dateTime: jsonDate
        }
    }

    //LẤY DANH SÁCH PHÒNG THEO MÃ VỊ TRÍ
    async getPhongByViTri(maViTri: number): Promise<any> {

        let data = await this.prisma.phong.findMany({
            where: {
                ma_vi_tri: maViTri
            }
        })
        let checkListViTri = await this.prisma.viTri.findFirst({
            where: {
                id: maViTri
            }
        })
        let jsonDate = (new Date()).toJSON();
        try {
            if (data.length > 0) {
                return {
                    statusCode: 200,
                    content: data,
                    dateTime: jsonDate
                }
            }
            if (checkListViTri === null) {
                return {
                    statusCode: 404,
                    content: "Mã vị trí này không tồn tại trong danh sách vị trí",
                    dateTime: jsonDate
                }
            }
            else {
                return {
                    statusCode: 404,
                    content: "Mã vị trí này chưa có phòng sử dụng",
                    dateTime: jsonDate
                }
            }
        } catch {
            return false
        }
    }

    //LẤY DANH SÁCH PHÒNG THEO PHÂN TRANG
    async getPhongByPage(pageIndex: number, pageSize: number, keyWord: string): Promise<any> {


        let jsonDate = (new Date()).toJSON();
        try {
            if (keyWord === undefined) {

                let data = await this.prisma.phong.findMany({
                    skip: pageIndex - 1,
                    take: pageSize,
                    orderBy: { id: 'desc' }
                })
                let totalRow = await this.prisma.phong.count({
                    skip: pageIndex - 1,
                    take: pageSize,
                })
                console.log("total", data.length)
                if (data.length > 0) {
                    return {
                        statusCode: 200,
                        content: {
                            pageIndex,
                            pageSize,
                            totalRow,
                            keyWord,
                            data
                        },
                        dateTime: jsonDate
                    }
                }
                else {
                    return {
                        statusCode: 400,
                        message: "Yêu cầu không hợp lệ",
                        content: "Số trang và số lượng phần tử phải lớn hơn 0",
                        dateTime: jsonDate
                    }
                }
            }
            else {
                let totalRow = await this.prisma.phong.count({
                    skip: pageIndex - 1,
                    take: pageSize,

                    where: {
                        OR: [
                            {
                                mo_ta: {
                                    contains: keyWord
                                },
                            },
                            {
                                ten_phong: {
                                    contains: keyWord
                                }
                            },

                        ]
                    },
                })
                let data = await this.prisma.phong.findMany({
                    skip: pageIndex - 1,
                    take: pageSize,
                    where: {
                        OR: [
                            {
                                mo_ta: {
                                    contains: keyWord
                                },
                            },

                            {
                                ten_phong: {
                                    contains: keyWord
                                }
                            },

                        ]
                    },
                    orderBy: { id: 'desc' }
                })
                console.log("total", data.length)

                if (data.length > 0) {
                    return {
                        statusCode: 200,
                        content: {
                            pageIndex,
                            pageSize,
                            totalRow,
                            keyWord,
                            data
                        },
                        dateTime: jsonDate
                    }
                }

                else {
                    return {
                        statusCode: 404,
                        message: "Không tìm thấy kết quả phù hợp",
                        content: data,
                        dateTime: jsonDate
                    }
                }
            }

        } catch {

            return {
                statusCode: 400,
                message: "Yêu cầu không hợp lệ",
                content: "Số trang và số phần tử phải lớn 0 và không vượt quá giá trị cơ sở dữ liệu",
                dateTime: jsonDate
            }
        }
    }

    //LẤY DANH SÁCH PHÒNG THEO ID
    async getPhongById(id: number): Promise<any> {
        let checkId = await this.prisma.phong.findFirst({
            where: {
                id
            }
        })
        let jsonDate = (new Date()).toJSON();
        if (checkId === null) {
            return {
                statusCode: 403,
                message: "Mã Id không tồn tại trong danh sách",
                dateTime: jsonDate
            }
        }
        else {
            let data = await this.prisma.phong.findFirst({
                where: {
                    id
                }
            })
            return {
                statusCode: 200,
                message: "Lấy thông tin phòng thành công",
                content: data,
                dateTime: jsonDate
            }
        }

    }

    //CHỈNH SỬA THÔNG TIN PHÒNG THEO ID PHÒNG
    @HttpCode(200)
    async chinhSuaInfoPhong(idParam: number, id: number, ten_phong: string, khach: number, phong_ngu: number, giuong: number, phong_tam: number, mo_ta: string, gia_tien: number, may_giat: boolean, ban_la: boolean, tivi: boolean, dieu_hoa: boolean, wifi: boolean, bep: boolean, do_xe: boolean, ho_boi: boolean, ban_ui: boolean, hinh_anh: string, ma_vi_tri: number): Promise<any> {
        let jsonDate = (new Date()).toJSON();

        let checkId = await this.prisma.phong.findFirst({
            where: {
                id: idParam
            }
        })
        if (checkId === null) {
            return {
                statusCode: 403,
                message: "Mã Id không tồn tại trong danh sách",
                dateTime: jsonDate
            }
        } else {
            await this.prisma.phong.update({
                data: {
                    ten_phong, khach, phong_ngu, giuong, phong_tam, mo_ta, gia_tien, may_giat, ban_la, tivi, dieu_hoa, wifi, bep, do_xe, ho_boi, ban_ui, hinh_anh, ma_vi_tri
                },
                where: {
                    id: Number(idParam)
                }
            })
            let updateUser = await this.prisma.phong.findFirst({
                where:{id:idParam}
            })

            return {
                statusCode: 201,
                message: "Chỉnh sửa thành công",
                content:updateUser,
                dateTime: jsonDate
            }
        }
    }

    //XÓA THÔNG TIN PHÒNG
    async xoaPhong(idDelete: number): Promise<any> {
        let checkIdComment = await this.prisma.phong.findFirst({
            where: {
                id: idDelete
            }
        })
        let jsonDate = (new Date()).toJSON();
        try {
            if (checkIdComment.id !== null) {
                await this.prisma.phong.delete({
                    where: {
                        id: idDelete
                    }
                })
                return {
                    data: {
                        statusCode: 201,
                        content: "Xóa thông tin phòng thành công",
                        dateTime: jsonDate
                    }
                }
            } else {
                return false
            }
        } catch (err) {
            return {
                data: {
                    statusCode: 404,
                    content: "Phòng này đã xóa hoặc chưa từng tồn tại",
                    dateTime: jsonDate
                }
            }
        }

    }

    //Upload HINH PHONG
    async uploadHinhPhong(maPhong:number,filename:string):Promise<any>{
        await this.prisma.phong.update({
            data:{hinh_anh:filename},
            where:{
                id:maPhong
            }
        })
        let jsonDate = (new Date()).toJSON();
        return {
                statusCode: 201,
                message: "Cập nhật ảnh thành công",
                content:filename,
                dateTime: jsonDate
        }
    } 
}
