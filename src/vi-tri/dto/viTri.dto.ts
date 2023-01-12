import { ApiProperty } from "@nestjs/swagger";

export class ViTriViewModel{
    @ApiProperty({type:Number})
    id:number

    @ApiProperty({type:String})
    ten_vi_tri:string

    @ApiProperty({type:String})
    tinh_thanh:string

    @ApiProperty({type:String})
    quoc_gia:string

    @ApiProperty({type:String})
    hinh_anh:string
    
}