import { ApiProperty } from "@nestjs/swagger";

export class AccessToken{
    @ApiProperty({type:String, description:"Nhập accessToken", required:false})
    token:string
}