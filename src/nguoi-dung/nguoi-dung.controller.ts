import { Controller, Get, Headers, Param, Post, Body, HttpCode, Req, Query, Put, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiHeader, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Token } from 'src/dto/token.dto';
import { TokenService } from 'src/token/token.service';
import { NguoiDungService } from './nguoi-dung.service';
import { CapNhatNguoiDung, ThongTinNguoiDung } from './dto/nguoiDung.dto';
import { AccessToken } from 'src/dto/tokenAccess.dto';
import { Request } from 'express';
import { UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FileUploadAvatar, UploadHinhAvatar } from './dto/uploadHinh.dto';

@ApiTags("NguoiDung")
@Controller('/api')
export class NguoiDungController {

    constructor(
        private nguoiDungService: NguoiDungService,
        private tokenService: TokenService
    ) { }

    //GET DANH SÁCH NGƯỜI DÙNG
    @Get("/users")
    async getListNguoiDung(@Headers() headers: Token): Promise<any> {
        let data = await this.tokenService.checkToken(headers);
        if (data === true) {
            return this.nguoiDungService.getListNguoiDung()
        }

        else {
            return this.tokenService.checkToken(headers)
        }
    }

    //TẠO NGƯỜI DÙNG MỚI
    @HttpCode(201)
    @Post("/users")
    async themNguoiDungMoi(@Body() body: ThongTinNguoiDung, @Headers() headers: Token): Promise<any> {

        let data = await this.tokenService.checkToken(headers);
        if (data === true) {
            const { id, name, email, pass_word, phone, birth_day, gender, role } = body;
            return this.nguoiDungService.themNguoiDungMoi(id, name, email, pass_word, phone, birth_day, gender, role
            )

        }
        else {
            return this.tokenService.checkToken(headers)
        }

    }

    //XÓA THÔNG TIN NGƯỜI DÙNG
    @Delete("/users")
    @ApiQuery({ name: "id", type: Number, description: "Nhập id người dùng" })
    async deleteUser(@Headers() headers: Token, @Query("id") idParam: number): Promise<any> {

        let data = await this.tokenService.checkToken(headers);
        if (data === true) {
            return this.nguoiDungService.deleteUser(Number(idParam))
        }
        else {
            return this.tokenService.checkToken(headers)
        }

    }

    //LẤY NGƯỜI DÙNG THEO PHÂN TRANG
    @ApiQuery({ name: 'pageIndex', required: false, type: Number })
    @ApiQuery({ name: 'pageSize', required: false, type: Number })
    @ApiQuery({ name: 'keyWord', required: false, type: String, description: "Search by name or role" })

    @HttpCode(200)
    @Get("/users/phan-trang-tim-kiem")
    async getUserByPage(@Headers() headers: Token, @Query("pageIndex") pageIndex: number, @Query("pageSize") pageSize: number, @Query("keyWord") keyWord: string): Promise<any> {
        let data = await this.tokenService.checkToken(headers);
        if (data === true) {
            return this.nguoiDungService.getUserByPage(Number(pageIndex), Number(pageSize), keyWord)
        } else {
            return data
        }
    }

    //LẤY NGƯỜI DÙNG THEO ID
    @HttpCode(200)
    @Get("/users/:id")
    async getUserById(@Headers() headers: Token, @Param("id") id: number): Promise<any> {
        let data = await this.tokenService.checkToken(headers);
        if (data === true) {
            return this.nguoiDungService.getUserById(Number(id))
        } else {
            return data
        }
    }

    //CHỈNH SỬA THÔNG TIN NGƯỜI DÙNG
    @HttpCode(200)
    @Put("/users/:id")
    async chinhSuaInfoPhong(@Headers() headers: Token, @Param("id") idParam: number, @Body() body: CapNhatNguoiDung): Promise<any> {

        let data = await this.tokenService.checkToken(headers);

        if (data === true) {
            const { id, name, email, phone, birth_day, gender, role } = body;
            return this.nguoiDungService.chinhSuaInfoUser(
                Number(idParam), name, email, phone, birth_day, gender, role)
        }
        else {
            return this.tokenService.checkToken(headers)
        }



    }

    //SEARCH NGƯỜI DÙNG THEO TÊN NGƯỜI DÙNG
    @Get("/users/search/:TenNguoiDung")
    async getUserByUserName(@Headers() headers: Token, @Param("TenNguoiDung") TenNguoiDung: string): Promise<any> {
        let data = await this.tokenService.checkToken(headers);
        if (data === true) {
            return this.nguoiDungService.getUserByUserName(TenNguoiDung)
        } else {
            return data
        }
    }

    //SETTING DUONG DAN PHOTO
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor("userPhoto", {
        storage: diskStorage({
            destination: "src/public/img",
            filename(req, file, callback) {
                let date = new Date();
                callback(null, `${date.getTime()}-${file.originalname}`);
            },
        })
    }))
    @ApiBody({
        description: 'userPhoto',
        type: FileUploadAvatar,
    })
    //UPLOAD HIH PHONG
    @ApiHeader({ name: "Token", description: "Nhập access token", required: false })
    @Post("/users/upload-avatar")
    async uploadHinhAvatar(@Headers() headers: Token, @Headers() tokenHeader: any, @UploadedFile() file: UploadHinhAvatar): Promise<any> {
        //checkAccessToken khi người dùng đăng nhập
        let jsonDate = (new Date()).toJSON();
        let checkData = await this.tokenService.checkAccessToken(tokenHeader)
        //nếu tokenAccess có nhập và đúng
        if (checkData.check === true && checkData.logInfo === true) {
            let data = await this.tokenService.checkToken(headers);
            if (data === true) {
                let userId = checkData.info.id
                if (+file.size > 500000) {
                    throw new HttpException({
                        statusCode: 400,
                        message: "Chỉ có thể upload file nhỏ hơn 500KB",
                        content: null,
                        dateTime: jsonDate
                    }, HttpStatus.BAD_REQUEST)
                }
                if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/jpg" && file.mimetype !== "image/png") {
                    throw new HttpException({
                        statusCode: 400,
                        message: "Chỉ có thể upload file dưới định dạng jpg/jpg/png",
                        content: null,
                        dateTime: jsonDate
                    }, HttpStatus.BAD_REQUEST)
                }
                if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png") {
                    return this.nguoiDungService.uploadHinhAvatar(
                        Number(userId), file.filename)
                }
            }
            else {
                return this.tokenService.checkToken(headers)
            }
        }
        else {
            return checkData.data
        }


    }
}
