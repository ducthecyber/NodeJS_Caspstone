import { ApiProperty } from "@nestjs/swagger";

export class TokenSignIn{
    @ApiProperty({type:String, required:false})
    token:string
}