import { ApiProperty } from "@nestjs/swagger"

export class BinhLuanViewModel{
    @ApiProperty({type:Number})
    id:number

    @ApiProperty({type:Number})
    ma_phong:number

    @ApiProperty({type:Number})
    ma_nguoi_binh_luan:number

    @ApiProperty({type:String})
    ngay_binh_luan:string

    @ApiProperty({type:String})
    noi_dung:string

    @ApiProperty({type:Number})
    sao_binh_luan:number
}
