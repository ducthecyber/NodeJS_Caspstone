import { Controller, Get, Headers, Param, Post, Body, HttpCode, Req, Query, Put, Delete } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiHeader, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Token } from 'src/dto/token.dto';
import { TokenService } from 'src/token/token.service';
import { DatPhongService } from './dat-phong.service';
import { DatPhongViewModel } from './dto/datPhong.dto';
import { AccessToken } from 'src/dto/tokenAccess.dto';
import { Request } from 'express';
import { UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FileUploadHinhPhong, UploadHinhPhong } from './dto/uploadHinh.dto';

@ApiTags("DatPhong")
@Controller('/api')
export class DatPhongController {
    constructor(
        private datPhongService: DatPhongService,
        private tokenService: TokenService
    ) { }

    //GET DANH SÁCH PHÒNG
    @Get("/dat-phong")
    async getListDatPhong(@Headers() headers: Token): Promise<any> {
        let data = await this.tokenService.checkToken(headers);
        if (data === true) {
            return this.datPhongService.getListDatPhong()
        }

        else {
            return this.tokenService.checkToken(headers)
        }
    }

    //TẠO ĐẶT PHÒNG MỚI
    @HttpCode(201)
    @Post("/dat-phong")
    async themPhongMoi(@Body() body: DatPhongViewModel, @Headers() headers: Token): Promise<any> {

        let data = await this.tokenService.checkToken(headers);
        if (data === true) {
            const { id, ma_phong, ngay_den, ngay_di, so_luong_khach, ma_nguoi_dat } = body;
            const dateArrive = new Date(ngay_den);
            const dateLeave = new Date(ngay_di);

            return this.datPhongService.themDatPhongMoi(
                id, ma_phong, dateArrive, dateLeave, so_luong_khach, ma_nguoi_dat)
        }
        else {
            return this.tokenService.checkToken(headers)
        }
    }

    //LẤY PHÒNG THUÊ THEO ID

    @Get("/dat-phong/:id")
    async getDatPhongById(@Headers() headers: Token, @Param("id") id: number): Promise<any> {
        let data = await this.tokenService.checkToken(headers);
        if (data === true) {
            return this.datPhongService.getDatPhongById(Number(id))
        } else {
            return data
        }
    }

    //CHỈNH SỬA THÔNG TIN ĐẶT PHÒNG
    @Put("/dat-phong/:id")
    async chinhSuaInfoPhong(@Headers() headers: Token, @Param("id") idParam: number, @Body() body: DatPhongViewModel): Promise<any> {

        let data = await this.tokenService.checkToken(headers);

        if (data === true) {
            const { id, ma_phong, ngay_den, ngay_di, so_luong_khach, ma_nguoi_dat } = body;
            const dateArrive = new Date(ngay_den);
            const dateLeave = new Date(ngay_di);

            return this.datPhongService.chinhSuaInfoDatPhong(
                Number(idParam), id, ma_phong, dateArrive, dateLeave, so_luong_khach, ma_nguoi_dat
            )
        }
        else {
            return this.tokenService.checkToken(headers)
        }


    }

    // //XÓA THÔNG TIN ĐẶT PHÒNG 
    @Delete("/dat-phong/:id")
    async xoaDatPhong(@Headers() headers: Token, @Param("id") idParam: number): Promise<any> {

        let data = await this.tokenService.checkToken(headers);
        if (data === true) {
            return this.datPhongService.xoaDatPhong(Number(idParam))
        }
        else {
            return this.tokenService.checkToken(headers);
        }
    }

    //LẤY THÔNG TIN ĐẶT PHÒNG THEO MÃ NGƯỜI DÙNG
    @Get("/phong-thue/lay-theo-nguoi-dung/:MaNguoiDung")
    async getDatPhongByIdUser(@Headers() headers: Token, @Param("MaNguoiDung") maNguoiDung: number): Promise<any> {
        let data = await this.tokenService.checkToken(headers);
        if (data === true) {
            return this.datPhongService.getDatPhongByIdUser(Number(maNguoiDung))
        } else {
            return data
        }
    }
}




