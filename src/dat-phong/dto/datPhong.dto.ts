import { ApiProperty } from "@nestjs/swagger";

export class DatPhongViewModel {
    @ApiProperty({ type: Number })
    id: number

    @ApiProperty({ type: Number })
    ma_phong: number

    @ApiProperty({ type: String })
    ngay_den: string

    @ApiProperty({ type: String })
    ngay_di: string

    @ApiProperty({ type: Number })
    so_luong_khach: number

    @ApiProperty({ type: Number })
    ma_nguoi_dat: number
    
}