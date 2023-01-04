import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { BinhLuanService } from './binh-luan.service';
import { Body, Controller, Get, Headers, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BinhLuan } from './dto/binhluan.dto';

@ApiTags("BinhLuan")
@Controller('/api')
export class BinhLuanController {
    constructor(
        private binhLuanService: BinhLuanService
    ){}

    //GET LẤY DANH SÁCH BINHLUAN
    @Get("/binh-luan")
    @ApiHeader({
        name: 'tokenCybersoft',
        description: 'Nhập token cybersoft',
        required: true,
    })
    @UseGuards(AuthGuard("jwt"))
    async binhLuan():Promise<any>{
        return this.binhLuanService.binhLuanList()
    }

    //POST THÊM MỚI BÌNH LUẬN
    @Post("/binh-luan")
    @ApiHeader({
        name: 'tokenCybersoft',
        description: 'Nhập token cybersoft',
        required: true,
    })
    @UseGuards(AuthGuard("jwt"))
    async binhLuanMoi(@Body() body:BinhLuan):Promise<any>{
        const {id,ma_phong,ma_nguoi_binh_luan,ngay_binh_luan,noi_dung,sao_binh_luan}= body;

        const date = new Date (ngay_binh_luan);
      
        return this.binhLuanService.binhLuanMoi(
            id,ma_phong,ma_nguoi_binh_luan,date,noi_dung,sao_binh_luan)
    }
}

