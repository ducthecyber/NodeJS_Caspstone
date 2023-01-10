import { ApiProperty } from "@nestjs/swagger";

export class PhongViewModel {
    @ApiProperty({ type: Number })
    id: number

    @ApiProperty({ type: String })
    ten_phong: string

    @ApiProperty({ type: Number })
    khach: number

    @ApiProperty({ type: Number })
    phong_ngu: number

    @ApiProperty({ type: Number })
    giuong: number

    @ApiProperty({ type: Number })
    phong_tam: number

    @ApiProperty({ type: String })
    mo_ta: string

    @ApiProperty({ type: Number })
    gia_tien: number

    @ApiProperty({ type: Boolean })
    may_giat: boolean

    @ApiProperty({ type: Boolean })
    ban_la: boolean

    @ApiProperty({ type: Boolean })
    tivi: boolean

    @ApiProperty({ type: Boolean })
    dieu_hoa: boolean

    @ApiProperty({ type: Boolean })
    wifi: boolean

    @ApiProperty({ type: Boolean })
    bep: boolean

    @ApiProperty({ type: Boolean })
    do_xe: boolean

    @ApiProperty({ type: Boolean })
    ho_boi: boolean

    @ApiProperty({ type: Boolean })
    ban_ui: boolean

    @ApiProperty({ type: String })
    hinh_anh: string

    @ApiProperty({ type: Number })
    ma_vi_tri: number
    
}