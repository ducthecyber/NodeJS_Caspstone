import { Controller, Get, Headers, Param, Post, Body, HttpCode, Req, Query, Put, Delete } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiHeader, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Token } from 'src/dto/token.dto';
import { TokenService } from 'src/token/token.service';
import { PhongThueService } from './phong-thue.service';
import { PhongViewModel } from './dto/phong-thue.dto';
import { AccessToken } from 'src/dto/tokenAccess.dto';
import { Request } from 'express';
import { UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FileUploadHinhPhong, UploadHinhPhong } from './dto/uploadHinh.dto';

@ApiTags("PhongThue")
@Controller('/api')
export class PhongThueController {

    constructor(
        private datPhongService: PhongThueService,
        private tokenService: TokenService
    ) { }

    //GET DANH SÁCH PHÒNG
    @Get("/phong-thue")
    async getListPhong(@Headers() headers: Token): Promise<any> {
        let data = await this.tokenService.checkToken(headers);
        if (data === true) {
            return this.datPhongService.getListPhong()
        }

        else {
            return this.tokenService.checkToken(headers)
        }
    }

    //TẠO PHÒNG MỚI
    @Post("/phong-thue")
    async themPhongMoi(@Body() body: PhongViewModel, @Headers() headers: Token, @Headers() token: AccessToken): Promise<any> {

        let checkData = await this.tokenService.checkAccessToken(token)

        if (checkData.check === true && checkData.logInfo === true) {
            let data = await this.tokenService.checkToken(headers);
            if (data === true) {
                const { id, ten_phong, khach, phong_ngu, giuong, phong_tam, mo_ta, gia_tien, may_giat, ban_la, tivi, dieu_hoa, wifi, bep, do_xe, ho_boi, ban_ui, hinh_anh, ma_vi_tri } = body;

                let checkAuth = await this.datPhongService.checkAuthAccount(Number(checkData.info.id))
                console.log("checkAuththemPhong", checkAuth)
                if (checkAuth === true) {
                    return this.datPhongService.themPhongMoi(
                        id, ten_phong, khach, phong_ngu, giuong, phong_tam, mo_ta, gia_tien, may_giat, ban_la, tivi, dieu_hoa, wifi, bep, do_xe, ho_boi, ban_ui, hinh_anh, ma_vi_tri)
                } else {
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

    //LẤY PHÒNG THUÊ THEO MÃ VỊ TRÍ
    @ApiQuery({ name: 'maViTri', required: false, type: Number })
    @Get("/phong-thue/lay-phong-theo-vi-tri")
    async getPhongByViTri(@Headers() headers: Token, @Query("maViTri") maViTri: number): Promise<any> {
        let data = await this.tokenService.checkToken(headers);
        if (data === true) {
            return this.datPhongService.getPhongByViTri(Number(maViTri))
        } else {
            return data
        }
    }


    //LẤY PHÒNG THUÊ THEO PHÂN TRANG
    @ApiQuery({ name: 'pageIndex', required: false, type: Number })
    @ApiQuery({ name: 'pageSize', required: false, type: Number })
    @ApiQuery({ name: 'keyWord', required: false, type: String })

    @Get("/phong-thue/phan-trang-tim-kiem")
    async getPhongByPage(@Headers() headers: Token, @Query("pageIndex") pageIndex: number, @Query("pageSize") pageSize: number, @Query("keyWord") keyWord: string): Promise<any> {
        let data = await this.tokenService.checkToken(headers);
        if (data === true) {
            return this.datPhongService.getPhongByPage(Number(pageIndex), Number(pageSize), keyWord)
        } else {
            return data
        }
    }

    //LẤY PHÒNG THUÊ THEO ID

    @Get("/phong-thue/:id")
    async getPhongById(@Headers() headers: Token, @Param("id") id: number): Promise<any> {
        let data = await this.tokenService.checkToken(headers);
        if (data === true) {
            return this.datPhongService.getPhongById(Number(id))
        } else {
            return data
        }
    }

    //CHỈNH SỬA THÔNG TIN PHÒNG
    @ApiHeader({ name: "Token", description: "Nhập access token", required: false })
    @Put("/phong-thue/:id")
    async chinhSuaInfoPhong(@Headers() headers: Token, @Headers() tokenHeader: any, @Param("id") idParam: number, @Body() body: PhongViewModel): Promise<any> {

        let checkData = await this.tokenService.checkAccessToken(tokenHeader)

        if (checkData.check === true && checkData.logInfo===true) {
            let data = await this.tokenService.checkToken(headers);
            
            if (data === true) {
                const { id, ten_phong, khach, phong_ngu, giuong, phong_tam, mo_ta, gia_tien, may_giat, ban_la, tivi, dieu_hoa, wifi, bep, do_xe, ho_boi, ban_ui, hinh_anh, ma_vi_tri } = body;
                
                let checkAuth = await this.datPhongService.checkAuthAccount(Number(checkData.info.id))

                if (checkAuth === true) {
                    return this.datPhongService.chinhSuaInfoPhong(
                        Number(idParam),id, ten_phong, khach, phong_ngu, giuong, phong_tam, mo_ta, gia_tien, may_giat, ban_la, tivi, dieu_hoa, wifi, bep, do_xe, ho_boi, ban_ui, hinh_anh, ma_vi_tri)
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
    

    //XÓA THÔNG TIN PHÒNG THUÊ
    @ApiHeader({ name: "Token", description: "Nhập access token", required: false })
    @Delete("/phong-thue/:id")
    async xoaPhong(@Headers() headers: Token, @Headers() tokenHeader: any, @Param("id") idParam: number): Promise<any> {
        //checkAccessToken khi người dùng đăng nhập
        let checkData = await this.tokenService.checkAccessToken(tokenHeader)
        //nếu tokenAccess có nhập và đúng
        if (checkData.check === true && checkData.logInfo === true) {
            let data = await this.tokenService.checkToken(headers);
            if (data === true) {
                let userRole = checkData.info.id
                let checkAuth = await this.datPhongService.checkAuthAccount(Number(userRole))

                if (checkAuth === true) {
                    return this.datPhongService.xoaPhong(
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

    //SETTING DUONG DAN PHOTO
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor("roomPhoto", {
        storage: diskStorage({
            destination: "src/public/img",
            filename(req, file, callback) {
                let date = new Date();
                callback(null, `${date.getTime()}-${file.originalname}`);
            },
        })
    }))
    @ApiBody({
        description: 'roomPhoto',
        type: FileUploadHinhPhong,
    })
    //UPLOAD HIH PHONG
    @ApiHeader({ name: "Token", description: "Nhập access token", required: false })
    @ApiQuery({ name: 'maPhong', required: false, type: Number })
    @Post("/phong-thue/upload-hinh-phong")
    async uploadHinhPhong(@Headers() headers: Token, @Headers() tokenHeader: any,@Query("maPhong") maPhong:number,@UploadedFile() file:UploadHinhPhong): Promise<any> {
        //checkAccessToken khi người dùng đăng nhập
        let checkData = await this.tokenService.checkAccessToken(tokenHeader)
        //nếu tokenAccess có nhập và đúng
        if (checkData.check === true && checkData.logInfo === true) {
            let data = await this.tokenService.checkToken(headers);
            if (data === true) {
                let userRole = checkData.info.id
                let checkAuth = await this.datPhongService.checkAuthAccount(Number(userRole))

                if (checkAuth === true) {
                    return this.datPhongService.uploadHinhPhong(
                        Number(maPhong),file.filename)
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
}
