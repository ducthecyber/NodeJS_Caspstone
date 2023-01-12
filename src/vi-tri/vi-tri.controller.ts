import { Controller, Get, Headers, Param, Post, Body, HttpCode, Req, Query, Put, Delete } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiHeader, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Token } from 'src/dto/token.dto';
import { TokenService } from 'src/token/token.service';
import { ViTriService } from './vi-tri.service';
import { ViTriViewModel } from './dto/viTri.dto';
import { AccessToken } from 'src/dto/tokenAccess.dto';
import { Request } from 'express';
import { UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FileUploadHinhViTri, UploadHinhViTri } from './dto/uploadHinh.dto';

@ApiTags("ViTri")
@Controller('api')
export class ViTriController {
    constructor(
        private viTriService: ViTriService,
        private tokenService: TokenService
    ) { }

    //GET DANH SÁCH VỊ TRÍ
    @Get("/vi-tri")
    async getListViTri(@Headers() headers: Token): Promise<any> {
        let data = await this.tokenService.checkToken(headers);
        if (data === true) {
            return this.viTriService.getListViTri()
        }

        else {
            return this.tokenService.checkToken(headers)
        }
    }

    //TẠO VỊ TRÍ MỚI
    @Post("/vi-tri")
    async themViTriMoi(@Body() body: ViTriViewModel, @Headers() headers: Token, @Headers() token: AccessToken): Promise<any> {

        let checkData = await this.tokenService.checkAccessToken(token)

        if (checkData.check === true && checkData.logInfo === true) {
            let data = await this.tokenService.checkToken(headers);
            if (data === true) {
                const { id, ten_vi_tri, tinh_thanh, quoc_gia, hinh_anh } = body;

                let checkAuth = await this.viTriService.checkAuthAccount(Number(checkData.info.id))
                // console.log("checkAuththemPhong", checkAuth)
                if (checkAuth === true) {
                    return this.viTriService.themViTriMoi(
                        Number(id), ten_vi_tri, tinh_thanh, quoc_gia, hinh_anh)
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

    //LẤY VỊ TRÍ THEO PHÂN TRANG
    @ApiQuery({ name: 'pageIndex', required: false, type: Number })
    @ApiQuery({ name: 'pageSize', required: false, type: Number })
    @ApiQuery({ name: 'keyWord', required: false, type: String, description: "Tìm kiếm theo vị trí hoặc quốc gia" })

    @Get("/vi-tri/phan-trang-tim-kiem")
    async getLocationByPage(@Headers() headers: Token, @Query("pageIndex") pageIndex: number, @Query("pageSize") pageSize: number, @Query("keyWord") keyWord: string): Promise<any> {
        let data = await this.tokenService.checkToken(headers);
        if (data === true) {
            return this.viTriService.getPhongByPage(Number(pageIndex), Number(pageSize), keyWord)
        } else {
            return data
        }
    }

    //LẤY VỊ TRÍ THEO ID
    @Get("/vi-tri/:id")
    async getLocationById(@Headers() headers: Token, @Param("id") id: number): Promise<any> {
        let data = await this.tokenService.checkToken(headers);
        if (data === true) {
            return this.viTriService.getLocationById(Number(id))
        } else {
            return data
        }
    }

    //CHỈNH SỬA THÔNG TIN VỊ TRÍ
    @ApiHeader({ name: "Token", description: "Nhập access token", required: false })
    @Put("/vi-tri/:id")
    async editLocationInfo(@Headers() headers: Token, @Headers() tokenHeader: any, @Param("id") idParam: number, @Body() body: ViTriViewModel): Promise<any> {

        let checkData = await this.tokenService.checkAccessToken(tokenHeader)

        if (checkData.check === true && checkData.logInfo === true) {
            let data = await this.tokenService.checkToken(headers);

            if (data === true) {
                const { id, ten_vi_tri, tinh_thanh, quoc_gia, hinh_anh } = body;

                let checkAuth = await this.viTriService.checkAuthAccount(Number(checkData.info.id))

                if (checkAuth === true) {
                    return this.viTriService.editLocationInfo(
                        Number(idParam), id, ten_vi_tri, tinh_thanh, quoc_gia, hinh_anh)
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

    //XÓA THÔNG TIN VỊ TRÍ PHÒNG
    @ApiHeader({ name: "Token", description: "Nhập access token", required: false })
    @Delete("/vi-tri/:id")
    async deleteLocation(@Headers() headers: Token, @Headers() tokenHeader: any, @Param("id") idParam: number): Promise<any> {
        //checkAccessToken khi người dùng đăng nhập
        let checkData = await this.tokenService.checkAccessToken(tokenHeader)
        //nếu tokenAccess có nhập và đúng
        if (checkData.check === true && checkData.logInfo === true) {
            let data = await this.tokenService.checkToken(headers);
            if (data === true) {
                let userRole = checkData.info.id
                let checkAuth = await this.viTriService.checkAuthAccount(Number(userRole))

                if (checkAuth === true) {
                    return this.viTriService.deleteLocation(
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
    @UseInterceptors(FileInterceptor("locationPhoto", {
        storage: diskStorage({
            destination: "src/public/img",
            filename(req, file, callback) {
                let date = new Date();
                callback(null, `${date.getTime()}-${file.originalname}`);
            },
        })
    }))
    @ApiBody({
        description: 'locationPhoto',
        type: FileUploadHinhViTri,
    })
    //UPLOAD HIH PHONG
    @ApiHeader({ name: "Token", description: "Nhập access token", required: false })
    @ApiQuery({ name: 'maViTri', required: false, type: Number })
    @Post("/vi-tri/upload-hinh-vitri")
    async uploadLocationPhoto(@Headers() headers: Token, @Headers() tokenHeader: any,@Query("maViTri") maViTri:number,@UploadedFile() file:UploadHinhViTri): Promise<any> {
        //checkAccessToken khi người dùng đăng nhập
        let checkData = await this.tokenService.checkAccessToken(tokenHeader)
        //nếu tokenAccess có nhập và đúng
        if (checkData.check === true && checkData.logInfo === true) {
            let data = await this.tokenService.checkToken(headers);
            if (data === true) {
                let userRole = checkData.info.id
                let checkAuth = await this.viTriService.checkAuthAccount(Number(userRole))

                if (checkAuth === true) {
                    return this.viTriService.uploadLocationPhoto(
                        Number(maViTri),file.filename)
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
