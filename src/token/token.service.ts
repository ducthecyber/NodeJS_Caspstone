import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Token } from 'src/dto/token.dto';

@Injectable()
export class TokenService {
    constructor(
        private jwt: JwtService
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

}

