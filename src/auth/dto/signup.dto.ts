import { ApiProperty } from "@nestjs/swagger/dist/decorators"

export class ThongTinNguoiDung{
    @ApiProperty({type:Number})
    id: number

    @ApiProperty({type:String})
    name: string

    @ApiProperty({type:String})
    email:string

    @ApiProperty({type:String})
    pass_word:string

    @ApiProperty({type:String})
    phone:string

    @ApiProperty({type:String})
    birth_day:string

    @ApiProperty({type:String})
    gender:string

    @ApiProperty({type:String})
    role:string
}

export class SignUpDto{
    @ApiProperty({ description:"name",type:String})
    name: string

}