import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { BinhLuanService } from './binh-luan.service';
import { Body, Controller, Get, Headers, Param, Post, UseGuards, UseInterceptors, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BinhLuan } from './dto/binhluan.dto';
import { Token } from 'src/dto/token.dto';
import { TokenService } from 'src/token/token.service';
import { isBuffer } from 'util';
import { AuthService } from 'src/auth/auth.service';
import { TokenSignIn } from 'src/dto/tokenSignIn.dto';
import { JwtService } from '@nestjs/jwt';

@ApiTags("BinhLuan")
@Controller('/api')
export class BinhLuanController {
    constructor(
        private jwt:JwtService,
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
    @Post("/binh-luan")
    // @UseGuards(AuthGuard("jwt"))
    async binhLuanMoi(@Body() body: BinhLuan,@Headers() tokenHeader:TokenSignIn, @Headers() headers: Token): Promise<any> {


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
}

