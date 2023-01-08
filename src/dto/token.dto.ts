import { ApiProperty } from "@nestjs/swagger";

export class Token{
    @ApiProperty({type:String,description:"Nhập TokenCybersoft"})
    tokencybersoft:string

}