import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Token } from 'src/dto/token.dto';
import { TokenSignIn } from 'src/dto/tokenSignIn.dto';

@Injectable()
export class TokenService {
    constructor(
        private jwt: JwtService,
        private config:ConfigService,
    ) { }

    async checkToken(token: Token): Promise<any> {

        let data: any = this.jwt.decode(token.tokencybersoft);
        let dNow: Date = new Date();
        if (data !== null) {
            let dToken: Date = new Date(Number(data.HetHanTime));

            if (dNow > dToken)
                return false
            else {
                return true
            }
        }
        else {
            let jsonDate = (new Date()).toJSON();
            return {
                statusCode: 403,
                message: "Người dùng không có quyền truy cập",
                content: "tokenCybersoft không hợp lệ hoặc hết thời hạn",
                dateTime: jsonDate,
            }

        }
    }

    async checkAccessToken(accessToken:TokenSignIn ):Promise<any>{
       
        try{
            await this.jwt.verify(accessToken.token,this.config.get("SECRET_KEY"))
            return true

        }catch(err){
            let jsonDate = (new Date()).toJSON();
            console.log("err",err)
            return{
                data:{
                    statusCode:403,
                    content:"token user hết hạn hoặc không đúng",
                    dateTime:jsonDate

                }
            }
        }
    }

}

