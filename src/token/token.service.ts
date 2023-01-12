import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Token } from 'src/dto/token.dto';
import { AccessToken } from 'src/dto/tokenAccess.dto';

@Injectable()
export class TokenService {
    constructor(
        private jwt: JwtService,
        private config: ConfigService,
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
            console.log("data", data)
            let jsonDate = (new Date()).toJSON();
            throw new HttpException({
                statusCode: 403,
                message: "Người dùng không có quyền truy cập",
                content: "tokenCybersoft không hợp lệ hoặc hết thời hạn",
                dateTime: jsonDate,
            }, HttpStatus.FORBIDDEN)
            return {
                statusCode: 403,
                message: "Người dùng không có quyền truy cập",
                content: "tokenCybersoft không hợp lệ hoặc hết thời hạn",
                dateTime: jsonDate,
            }

        }
    }

    async checkAccessToken(accessToken: AccessToken): Promise<any> {
        // console.log("accessTOKEN",accessToken)
        try {
            //case1:không nhập nhưng vẫn trả true
            if (accessToken.token === undefined) {
                let jsonDate = (new Date()).toJSON();

                return {
                    check: true,
                    logInfo: false,
                    data: {
                        statusCode: 403,
                        content: "token user hết hạn hoặc không đúng",
                        dateTime: jsonDate
                    }
                }
            }
            //case2: có nhập và cần check
            else {
                await this.jwt.verify(accessToken.token, this.config.get("SECRET_KEY"))
                return {
                    check: true,
                    logInfo: true,
                    info: this.jwt.verify(accessToken.token, this.config.get("SECRET_KEY"))
                }
            }

        } catch (err) {
            let jsonDate = (new Date()).toJSON();
            // console.log("err", err)
            console.log("checktokenaccess", accessToken.token)
            throw new HttpException({
                statusCode: 403,
                message: "Người dùng không có quyền truy cập",
                content: "token user hết hạn hoặc không đúng",
                dateTime: jsonDate,
            }, HttpStatus.FORBIDDEN)
            return {
                statusCode: 403,
                content: "token user hết hạn hoặc không đúng",
                dateTime: jsonDate
            }
        }
    }



}

