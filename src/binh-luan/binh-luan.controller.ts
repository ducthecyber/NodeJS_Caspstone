import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { BinhLuanService } from './binh-luan.service';
import { Body, Controller, Get, Headers, Param, Post, UseGuards, UseInterceptors, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BinhLuanViewModel } from './dto/binhluan.dto';
import { Token } from 'src/dto/token.dto';
import { TokenService } from 'src/token/token.service';
import { isBuffer } from 'util';
import { AuthService } from 'src/auth/auth.service';
import { TokenSignIn } from 'src/dto/tokenSignIn.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Delete, HttpCode, Put } from '@nestjs/common/decorators';
import { check } from 'prettier';
import { HttpAdapterHost } from '@nestjs/core';

@ApiTags("BinhLuan")
@Controller('/api')
export class BinhLuanController {
    constructor(
        private jwt: JwtService,
        private config: ConfigService,
        private binhLuanService: BinhLuanService,
        private tokenService: TokenService,
        private authService: AuthService,
    ) { }

    //GET LẤY DANH SÁCH BINHLUAN
    @Get("/binh-luan")
    // @UseGuards(AuthGuard("jwt"))
    async binhLuan(@Headers() headers: Token): Promise<any> {
        let data = await this.tokenService.checkToken(headers);
        if (data === true) {
            return this.binhLuanService.binhLuanList()
        }

        else {
            return this.tokenService.checkToken(headers)
        }
    }

    //POST THÊM MỚI BÌNH LUẬN
    @HttpCode(201)
    @Post("/binh-luan")
    @ApiHeader({ name: "Token", description: "Nhập access token", required: false })
    // @UseGuards(AuthGuard("jwt"))
    async binhLuanMoi(@Body() body: BinhLuanViewModel, @Headers() headers: Token, @Headers() tokenHeader: any): Promise<any> {

        // https://dev.to/emmanuelthecoder/how-to-solve-secretorprivatekey-must-have-a-value-in-nodejs-4mpg
        //cách fix lỗi JsonWebTokenError: secret or public key must be provided

        let checkData = await this.tokenService.checkAccessToken(tokenHeader)

        if (checkData.check === true) {
            let data = await this.tokenService.checkToken(headers);
            if (data === true) {
                const { id, ma_phong, ma_nguoi_binh_luan, ngay_binh_luan, noi_dung, sao_binh_luan } = body;
                const date = new Date(ngay_binh_luan);

                return this.binhLuanService.binhLuanMoi(
                    id, ma_phong, ma_nguoi_binh_luan, date, noi_dung, sao_binh_luan)
            }
            else {
                return this.tokenService.checkToken(headers)
            }
        }
        else {
            return checkData.data
        }



    }

    //CHỈNH SỬA BÌNH LUẬN
    @ApiHeader({ name: "Token", description: "Nhập access token", required: false })
    @Put("/binh-luan/:id")
    async chinhSuaBinhLuan(@Headers() headers: Token, @Headers() tokenHeader: any, @Param("id") idParam: number, @Body() body: BinhLuanViewModel): Promise<any> {

        let checkData = await this.tokenService.checkAccessToken(tokenHeader)

        if (checkData.check === true) {
            let data = await this.tokenService.checkToken(headers);
            if (data === true) {
                const { ma_phong, ma_nguoi_binh_luan, ngay_binh_luan, noi_dung, sao_binh_luan } = body;
                const date = new Date(ngay_binh_luan);

                return this.binhLuanService.chinhSuaBinhLuan(
                    Number(idParam), ma_phong, ma_nguoi_binh_luan, date, noi_dung, sao_binh_luan)

            }
            else {
                return this.tokenService.checkToken(headers)
            }
        }
        else {
            return checkData.data
        }

    }

    //XÓA BÌNH LUẬN
    @ApiHeader({ name: "Token", description: "Nhập access token", required: false })
    @Delete("/binh-luan/:id")
    async xoaBinhLuan(@Headers() headers: Token, @Headers() tokenHeader: any, @Param("id") idParam: number): Promise<any> {
        //checkAccessToken khi người dùng đăng nhập
        let checkData = await this.tokenService.checkAccessToken(tokenHeader)
        //nếu tokenAccess có nhập và đúng
        if (checkData.check === true && checkData.logInfo === true) {
            let data = await this.tokenService.checkToken(headers);
            if (data === true) {
                let userRole = checkData.info.id
                let checkAuth = await this.binhLuanService.checkAuthAccount(Number(userRole))

                if (checkAuth === true) {
                    return this.binhLuanService.deleteComment(
                        Number(idParam))
                }
                else {
                    return checkAuth.data
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

    //LẤY BÌNH LUẬN THEO MÃ PHÒNG
    @Get("/binh-luan/lay-binh-luan-theo-phong/:MaPhong")
    async getBinhLuanById(@Headers() headers: Token, @Param("MaPhong") maPhong: number): Promise<any> {

        let data = await this.tokenService.checkToken(headers);
        if (data === true) {
            return this.binhLuanService.getCommentById(
                Number(maPhong))
        }
        else {
            return this.tokenService.checkToken(headers)
        }
    }
}

