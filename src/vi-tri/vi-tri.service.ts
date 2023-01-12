import { HttpCode, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ViTriService {
    constructor(
        private jwt: JwtService,
        private config: ConfigService
    ) { }

    private prisma = new PrismaClient();

    //GET DANH SACH VỊ TRÍ
    @HttpCode(200)
    async getListViTri(): Promise<any> {
        let data = await this.prisma.viTri.findMany();
        let jsonDate = (new Date()).toJSON();

        return {
            statusCode: 200,
            message: "Lấy thông tin thành công",
            content: data,
            dateTime: jsonDate
        }
    }

    // THÊM NGƯỜI DÙNG MỚI
    @HttpCode(201)
    async themViTriMoi(id: number, ten_vi_tri: string, tinh_thanh: string, quoc_gia: string, hinh_anh: string): Promise<any> {
        // Query createOnePhong is required to return data, but found no record(s).có thể xảy ra khi id truyền vào là 0
        let jsonDate = (new Date()).toJSON();
        let checkLocation = await this.prisma.viTri.findFirst({
            where: {
                ten_vi_tri
            },
        })
        if (checkLocation !== null) {
            return {
                statusCode: 400,
                message: "Vui lòng dùng tên vị trí khác",
                content: null,
                dateTime: jsonDate
            }
        }
        else {
            await this.prisma.viTri.create({
                data: {
                    ten_vi_tri, tinh_thanh, quoc_gia, hinh_anh
                }
            })
            // https://stackoverflow.com/questions/70834547/prisma-client-query-for-latest-values-of-each-user
            let newLocation = await this.prisma.viTri.findFirst({
                where: {
                    ten_vi_tri
                },
                orderBy: {
                    id: "desc"
                }
            })
            return {
                statusCode: 201,
                message: "Thêm vị trí thành công",
                content: {
                    id: newLocation.id,
                    ten_vi_tri,
                    tinh_thanh,
                    quoc_gia,
                    hinh_anh
                },
                dateTime: jsonDate
            }
        }
    }

    //CHECK QUYỀN THÊM MỚI VỊ TRÍ
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

    //LẤY DANH SÁCH VỊ TRÍ THEO PHÂN TRANG
    async getPhongByPage(pageIndex: number, pageSize: number, keyWord: string): Promise<any> {
        let jsonDate = (new Date()).toJSON();
        try {
            if (keyWord === undefined) {

                let data = await this.prisma.viTri.findMany({
                    skip: pageIndex - 1,
                    take: pageSize,
                    orderBy: { id: 'asc' }
                })
                let totalRow = await this.prisma.viTri.count({
                    skip: pageIndex - 1,
                    take: pageSize,
                })
                // console.log("total", data.length)
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
                let totalRow = await this.prisma.viTri.count({
                    skip: pageIndex - 1,
                    take: pageSize,

                    where: {
                        OR: [
                            {
                                ten_vi_tri: {
                                    contains: keyWord
                                },
                            },
                            {
                                quoc_gia: {
                                    contains: keyWord
                                }
                            },
                        ]
                    },
                })
                let data = await this.prisma.viTri.findMany({
                    skip: pageIndex - 1,
                    take: pageSize,
                    where: {
                        OR: [
                            {
                                ten_vi_tri: {
                                    contains: keyWord
                                },
                            },
                            {
                                quoc_gia: {
                                    contains: keyWord
                                }
                            },
                        ]
                    },
                    orderBy: { id: 'asc' }
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

    //LẤY VỊ TRÍ THEO ID
    async getLocationById(id: number): Promise<any> {
        let checkId = await this.prisma.viTri.findFirst({
            where: {
                id
            }
        })
        let jsonDate = (new Date()).toJSON();
        if (checkId === null) {
            return {
                statusCode: 404,
                message: "Mã vị trí không tồn tại",
                content: null,
                dateTime: jsonDate
            }
        }
        else {
            let data = await this.prisma.viTri.findFirst({
                where: {
                    id
                }
            })
            return {
                statusCode: 200,
                message: "Lấy thông tin thành công",
                content: data,
                dateTime: jsonDate
            }
        }

    }

    //CHỈNH SỬA THÔNG TIN VỊ TRÍ
    @HttpCode(200)
    async editLocationInfo(idParam: number, id: number, ten_vi_tri: string, tinh_thanh: string, quoc_gia: string, hinh_anh: string): Promise<any> {
        let jsonDate = (new Date()).toJSON();

        let checkId = await this.prisma.viTri.findFirst({
            where: {
                id: idParam
            }
        })
        if (checkId === null) {
            return {
                statusCode: 404,
                message: "Mã vị trí không tồn tại",
                content: null,
                dateTime: jsonDate
            }
        } else {
            await this.prisma.viTri.update({
                data: {
                    ten_vi_tri, tinh_thanh, quoc_gia, hinh_anh
                },
                where: {
                    id: Number(idParam)
                }
            })
            let updateLocation = await this.prisma.viTri.findFirst({
                where: { id: idParam }
            })

            return {
                statusCode: 201,
                message: "Chỉnh sửa thành công",
                content: updateLocation,
                dateTime: jsonDate
            }
        }
    }

    //XÓA THÔNG TIN VỊ TRÍ
    async deleteLocation(idDelete: number): Promise<any> {
        let checkIdLocation = await this.prisma.viTri.findFirst({
            where: {
                id: idDelete
            }
        })
        let jsonDate = (new Date()).toJSON();
        try {
            if (checkIdLocation !== null) {
                await this.prisma.viTri.delete({
                    where: {
                        id: idDelete
                    }
                })
                return {
                    data: {
                        statusCode: 201,
                        message: "Xóa thông tin phòng thành công",
                        content: null,
                        dateTime: jsonDate
                    }
                }
            } else {
                return {
                    statusCode: 404,
                    message: "Vị trí đã xóa hoặc chưa từng tồn tại",
                    content: null,
                    dateTime: jsonDate
                }
            }
        }
        catch {
            let checkLocationIdPhongTable = await this.prisma.phong.findMany({
                where: { ma_vi_tri: idDelete }
            })
            if (checkLocationIdPhongTable !== null) {
                return {
                    statusCode: 400,
                    message: "Mã vị trí này không xóa được vì có phòng đang dùng",
                    data: null,
                    dateTime: jsonDate
                }
            }
            else{
                return false
            }
        }



    }

    //Upload HINH VỊ TRÍ
    async uploadLocationPhoto(maViTri: number, filename: string): Promise<any> {
        await this.prisma.viTri.update({
            data: { hinh_anh: filename },
            where: {
                id: maViTri
            }
        })
        let jsonDate = (new Date()).toJSON();
        return {
            statusCode: 201,
            message: "Cập nhật ảnh thành công",
            content: filename,
            dateTime: jsonDate
        }
    }
}
