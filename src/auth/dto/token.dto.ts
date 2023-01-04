import { ApiProperty } from "@nestjs/swagger";

export class Token{
    @ApiProperty({type:String})
    tokenCyberSoft:string
}