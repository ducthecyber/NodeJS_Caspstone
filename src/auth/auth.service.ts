import { Injectable,HttpCode } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt/dist';

import { PrismaClient } from '@prisma/client';
@Injectable()
export class AuthService {
    constructor(
        private jwt: JwtService,
        private config:ConfigService
    ){}

    private prisma = new PrismaClient();

    //signup
    @HttpCode(201)
    async signup(  name: string, email: string, pass_word: string, phone: string,birth_day: string,gender: string,  role: string):Promise<any>{
        await this.prisma.nguoiDung.create({data:{
            name,email,pass_word,phone,birth_day,gender,role
        }})
        return {
            "message":"Sign up success",
            name,
            email,
            pass_word,
            phone,
            birth_day,
            gender,
            role
        }
    }

    //SIGNIN
    @HttpCode(201) 
    async signin(email: string, pass_word: string): Promise<any> {
        let checkEmail = await this.prisma.nguoiDung.findFirst({
            where: {
                email
            }
        })
        if (checkEmail) {
            //email dung
            if (checkEmail.pass_word == pass_word) {
                let tokenCyberSoft = this.jwt.sign(checkEmail, {
                    expiresIn: "7d",
                    secret: this.config.get("SECRET_KEY")
                });
                //pass dung
                return {
                    check: true,
                    data: tokenCyberSoft,
                    user:checkEmail
                };
            } else {
                //pass sai
                return {
                    check: false,
                    data: "Password chưa đúng. Xin vui lòng thử lại"
                }
            }
        } else {
            //email sai
            return {
                data:"Email sai rồi nhé bạn"
            };
        }
    }
}
