import { HttpCode, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class NguoiDungService {
    constructor(
        private jwt: JwtService,
        private config: ConfigService
    ) { }

    private prisma = new PrismaClient();

    //get DANH SÁCH NGƯỜI DÙNG
    @HttpCode(200)
    async getListNguoiDung(): Promise<any> {
        let data = await this.prisma.nguoiDung.findMany();
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
    async themNguoiDungMoi(id: number, name: string, email: string, pass_word: string, phone: string, birth_day: string, gender: string, role: string): Promise<any> {
        // Query createOnePhong is required to return data, but found no record(s).có thể xảy ra khi id truyền vào là 0
        await this.prisma.nguoiDung.create({
            data: {
                name, email, pass_word, phone, birth_day, gender, role
            }
        })
        // https://stackoverflow.com/questions/70834547/prisma-client-query-for-latest-values-of-each-user
        let newUser = await this.prisma.nguoiDung.findFirst({
            where: {
                email
            },

        })
        let jsonDate = (new Date()).toJSON();
        return {
            statusCode: 201,
            message: "Thêm người dùng thành công",
            content: {
                id: newUser.id,
                name,
                email,
                pass_word,
                phone,
                birth_day,
                gender,
                role
            },
            dateTime: jsonDate
        }
    }

    //XÓA THÔNG TIN NGUOI DUNG
    async deleteUser(idDelete: number): Promise<any> {
        let checkIdUser = await this.prisma.nguoiDung.findFirst({
            where: {
                id: idDelete
            }
        })
        let jsonDate = (new Date()).toJSON();
        try {
            if (checkIdUser.id !== null) {
                await this.prisma.nguoiDung.delete({
                    where: {
                        id: idDelete
                    }
                })
                return {
                    statusCode: 201,
                    content: "Xóa thông tin nguời dùng thành công",
                    dateTime: jsonDate
                }
            } else {
                return {
                    data: {
                        statusCode: 403,
                        content: "Người dùng không tồn tại",
                        dateTime: jsonDate
                    }
                }
            }
        } catch (err) {
            console.log(err)
            let checkCommentUser = await this.prisma.binhLuan.findFirst({
                where: { ma_nguoi_binh_luan: idDelete }
            })
            let checkRoomBookUser = await this.prisma.datPhong.findFirst({
                where: { ma_nguoi_dat: idDelete }
            })
            if (checkCommentUser.id !== null) {
                return {
                    statusCode: 400,
                    content: "Xóa thất bại vì người dùng đã tạo bình luận",
                    dateTime: jsonDate
                }
            }
            if (checkRoomBookUser !== null) {
                return {
                    statusCode: 400,
                    content: "Xóa thất bại vì người dùng đã đặt phòng",
                    dateTime: jsonDate
                }
            }
            else {
                return {
                    statusCode: 400,
                    content: "Xóa thất bại",
                    dateTime: jsonDate
                }
            }
        }


    }

    //LẤY NGƯỜI DÙNG THEO PHÂN TRANG
    async getUserByPage(pageIndex: number, pageSize: number, keyWord: string): Promise<any> {

        let jsonDate = (new Date()).toJSON();
        try {
            if (keyWord === undefined) {

                let data = await this.prisma.nguoiDung.findMany({
                    skip: pageIndex - 1,
                    take: pageSize,
                    orderBy: { id: "asc" }
                })
                let totalRow = await this.prisma.nguoiDung.count({
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
                        statusCode: 404,
                        message: "Yêu cầu không hợp lệ",
                        content: "Số trang và số lượng phần tử phải lớn hơn 0",
                        dateTime: jsonDate
                    }
                }
            }
            else {
                let totalRow = await this.prisma.nguoiDung.count({
                    skip: pageIndex - 1,
                    take: pageSize,

                    where: {
                        OR: [
                            {
                                name: {
                                    contains: keyWord
                                },
                            },
                            {
                                gender: {
                                    contains: keyWord
                                }
                            },

                        ]
                    },
                })
                let data = await this.prisma.nguoiDung.findMany({
                    skip: pageIndex - 1,
                    take: pageSize,
                    where: {
                        OR: [
                            {
                                name: {
                                    contains: keyWord
                                },
                            },

                            {
                                gender: {
                                    contains: keyWord
                                }
                            },

                        ]
                    },
                    orderBy: { id: "asc" }
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

    //LẤY NGƯỜI DÙNG THEO ID
    async getUserById(id: number): Promise<any> {
        let checkId = await this.prisma.nguoiDung.findFirst({
            where: {
                id
            }
        })
        let jsonDate = (new Date()).toJSON();
        if (checkId === null) {
            return {
                statusCode: 404,
                message: "Mã người dùng không tồn tại",
                content: null,
                dateTime: jsonDate
            }
        }
        else {
            let data = await this.prisma.nguoiDung.findFirst({
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

    //CHỈNH SỬA THÔNG TIN NGƯỜI DÙNG THEO ID NGƯỜI DÙNG
    @HttpCode(200)
    async chinhSuaInfoUser(idParam: number, name: string, email: string,phone:string, birth_day: string, gender: string, role: string): Promise<any> {
        let jsonDate = (new Date()).toJSON();

        let checkId = await this.prisma.nguoiDung.findFirst({
            where: {
                id: idParam
            }
        })
        if (checkId === null) {
            return {
                statusCode: 404,
                message: "Mã người dùng không tồn tại trong danh sách",
                content:null,
                dateTime: jsonDate
            }
        } else {
            await this.prisma.nguoiDung.update({
                data: {
                    name, email, phone, birth_day, gender, role
                },
                where: {
                    id: Number(idParam)
                }
            })
            let updateUser = await this.prisma.nguoiDung.findFirst({
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

     //LẤY NGƯỜI DÙNG THEO TÊN NGƯỜI DÙNG
     async getUserByUserName(name:string): Promise<any> {
        let checkName = await this.prisma.nguoiDung.findMany({
            where: {
                name:{
                    contains:name
                }
            }
        })
        let jsonDate = (new Date()).toJSON();
        if (checkName.length ===0) {
            return {
                statusCode: 404,
                message: "Không có kết quả phù hợp. Thử từ khóa khác nhe!",
                content: null,
                dateTime: jsonDate
            }
        }
        else {
            let data = await this.prisma.nguoiDung.findMany({
                where: {
                    name:{contains:name}
                }
            })
            return {
                statusCode: 200,
                message: "Lấy thông tin người dùng thành công",
                content: data,
                dateTime: jsonDate
            }
        }

    }

     //UPLOAD AVATAR NGƯỜI DÙNG
     async uploadHinhAvatar(userId:number,filename:string):Promise<any>{
        await this.prisma.nguoiDung.update({
            data:{avatar:filename},
            where:{
                id:userId
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
