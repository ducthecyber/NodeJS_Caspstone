import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    async themNguoiDungMoi(id: number, name: string, email: string, pass_word: string, phone: string, birth_day: string, gender: string, role: string): Promise<any> {
        // Query createOnePhong is required to return data, but found no record(s).có thể xảy ra khi id truyền vào là 0
        let checkUser = await this.prisma.nguoiDung.findFirst({
            where: {
                email
            },

        })
        let jsonDate = (new Date()).toJSON();
        // https://stackoverflow.com/questions/70834547/prisma-client-query-for-latest-values-of-each-user
        console.log(checkUser)
        if (checkUser === null) {
            await this.prisma.nguoiDung.create({
                data: {
                    name, email, pass_word, phone, birth_day, gender, role
                }
            })
            let newUser = await this.prisma.nguoiDung.findFirst({
                where: {
                    email
                },

            })
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
        } else {
            throw new HttpException({ statusCode: 400, message: "Email đã tồn tại", content: null, dateTime: jsonDate }, HttpStatus.BAD_REQUEST)
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
            if (checkIdUser === null) {
                throw new HttpException({
                    statusCode: 404,
                    message: 'Người dùng không tồn tại',
                    content: null,
                    dateTime: jsonDate
                }, HttpStatus.NOT_FOUND)
                // throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
                // return {
                //     statusCode: 404,
                //     message: "Không tìm thấy tài nguyên",
                //     content: null,
                //     dateTime: jsonDate
                // }
            }
            let checkCommentUser = await this.prisma.binhLuan.findFirst({
                where: { ma_nguoi_binh_luan: idDelete }
            })
            let checkRoomBookUser = await this.prisma.datPhong.findFirst({
                where: { ma_nguoi_dat: idDelete }
            })
            if (checkCommentUser.id !== null) {
                throw new HttpException({
                    statusCode: 403,
                    message: 'Xóa thất bại vì người dùng đã tạo bình luận',
                    content: null,
                    dateTime: jsonDate
                }, HttpStatus.FORBIDDEN)
            }
            if (checkRoomBookUser !== null) {
                throw new HttpException({
                    statusCode: 403,
                    message: 'Xóa thất bại vì người dùng đã đặt phòng',
                    content: null,
                    dateTime: jsonDate
                }, HttpStatus.FORBIDDEN)
            }
            else {
                throw new HttpException({
                    statusCode: 400,
                    message: 'Xóa thất bại vì yêu cầu không hợp lệ',
                    content: null,
                    dateTime: jsonDate
                }, HttpStatus.BAD_REQUEST)
            }
        }


    }

    //LẤY NGƯỜI DÙNG THEO PHÂN TRANG
    async getUserByPage(pageIndex: number, pageSize: number, keyWord: string): Promise<any> {
        let jsonDate = (new Date()).toJSON();

        try {
            if (pageIndex !== 0 && pageSize !== 0) {
                if (keyWord === undefined) {
                    let totalRow = await this.prisma.nguoiDung.count({
                    })
                    // https://stackoverflow.com/questions/8701660/pagination-using-skip-and-take-methods
                    let data = await this.prisma.nguoiDung.findMany({
                        skip: (pageIndex - 1) * pageSize,
                        take: pageSize,
                        orderBy: { id: 'asc' }
                    })
                    return {
                        statusCode: 200,
                        message: "Lấy thông tin thành công",
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
                    let totalRow = await this.prisma.nguoiDung.count({
                        where: {
                            OR: [
                                {
                                    name: {
                                        contains: keyWord
                                    },
                                },
                                {
                                    role: {
                                        contains: keyWord
                                    }
                                },

                            ]
                        },
                    })
                    let data = await this.prisma.nguoiDung.findMany({
                        //nếu để skip và take sẽ search keyword không ra
                        // skip: (pageIndex - 1) * pageSize,
                        // take: pageSize,
                        orderBy: { id: 'asc' },
                        where: {
                            OR: [
                                {
                                    name: {
                                        contains: keyWord
                                    },
                                },
                                {
                                    role: {
                                        contains: keyWord
                                    }
                                },

                            ]
                        },
                    })
                    console.log(data.length)
                    if (data.length > 0) {
                        return {
                            statusCode: 200,
                            message: "Lấy thông tin thành công",
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
                            message: "Không tìm thấy kết quả tương ứng từ khóa",
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
                }
            }
            else {
                throw new HttpException({
                    statusCode: 400,
                    message: "Yêu cầu không hợp lệ",
                    content: "Số trang và số phần tử phải lớn 0",
                    dateTime: jsonDate
                }, HttpStatus.BAD_REQUEST)
            }
        }

        catch {
            throw new HttpException({
                statusCode: 400,
                message: "Yêu cầu không hợp lệ",
                content: "Số trang và số phần tử phải lớn 0",
                dateTime: jsonDate
            }, HttpStatus.BAD_REQUEST)
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
            throw new HttpException({
                statusCode: 404,
                message: "Mã người dùng không tồn tại",
                content: null,
                dateTime: jsonDate
            }, HttpStatus.NOT_FOUND)
        }
        else {
            let data = await this.prisma.nguoiDung.findFirst({
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

    //CHỈNH SỬA THÔNG TIN NGƯỜI DÙNG THEO ID NGƯỜI DÙNG
    async chinhSuaInfoUser(idParam: number, name: string, email: string, phone: string, birth_day: string, gender: string, role: string): Promise<any> {
        let jsonDate = (new Date()).toJSON();

        let checkId = await this.prisma.nguoiDung.findFirst({
            where: {
                id: idParam
            }
        })
        let checkEmail = await this.prisma.nguoiDung.findFirst({
            where: {
                email: email
            }
        })
        console.log("checkid", checkId)
        console.log("checkemail", checkEmail)
        if (checkId === null) {
            throw new HttpException({
                statusCode: 404,
                message: "Mã người dùng không tồn tại trong danh sách",
                content: null,
                dateTime: jsonDate
            }, HttpStatus.NOT_FOUND)
        }
        //KIỂM TRA KHÔNG CHO PHÉP TRÙNG EMAIL VỚI NGƯỜI DÙNG KHÁC KHI CẬP NHẬT
        if (checkEmail && checkEmail.id !== idParam) {
            throw new HttpException({
                statusCode: 400,
                message: "Email đã tồn tại trong danh sách",
                content: null,
                dateTime: jsonDate
            }, HttpStatus.BAD_REQUEST)
        }
        else {

            await this.prisma.nguoiDung.update({
                data: {
                    name, email, phone, birth_day, gender, role
                },
                where: {
                    id: Number(idParam)
                }
            })
            let updateUser = await this.prisma.nguoiDung.findFirst({
                where: { id: idParam }
            })

            return {
                statusCode: 201,
                message: "Chỉnh sửa thành công",
                content: updateUser,
                dateTime: jsonDate
            }
        }
    }

    //LẤY NGƯỜI DÙNG THEO TÊN NGƯỜI DÙNG
    async getUserByUserName(name: string): Promise<any> {
        let checkName = await this.prisma.nguoiDung.findMany({
            where: {
                name: {
                    contains: name
                }
            }
        })
        let jsonDate = (new Date()).toJSON();
        if (checkName.length === 0) {
            throw new HttpException({
                statusCode: 404,
                message: 'Không có kết quả phù hợp. Thử từ khóa khác nhe!',
                content: null,
                dateTime: jsonDate
            }, HttpStatus.NOT_FOUND)
        }
        else {
            let data = await this.prisma.nguoiDung.findMany({
                where: {
                    name: { contains: name }
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
    async uploadHinhAvatar(userId: number, filename: string): Promise<any> {
        await this.prisma.nguoiDung.update({
            data: { avatar: filename },
            where: {
                id: userId
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
