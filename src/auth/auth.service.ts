import { Injectable, HttpCode, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt/dist';

import { PrismaClient } from '@prisma/client';
@Injectable()
export class AuthService {
    constructor(
        private jwt: JwtService,
        private config: ConfigService
    ) { }

    private prisma = new PrismaClient();

    //signup
    @HttpCode(200)
    async signup(name: string, email: string, pass_word: string, phone: string, birth_day: string, gender: string, role: string): Promise<any> {
        let jsonDate = (new Date()).toJSON();
        let newUser = await this.prisma.nguoiDung.findFirst({
            where: {
                email: email
            }
        })

        if (newUser) {
            let jsonDate = (new Date()).toJSON();
            throw new HttpException({
                statusCode: 400,
                message: "Yêu cầu không hợp lệ",
                content: "Email đã tồn tại",
                dateTime: jsonDate,
            },HttpStatus.BAD_REQUEST)
        } else {

            await this.prisma.nguoiDung.create({
                data: {
                    name, email, pass_word, phone, birth_day, gender, role
                }
            })

            let createdUser = await this.prisma.nguoiDung.findFirst({
                where: {
                    email: email
                }
            })

            return {
                "message": "Sign up success",
                "statusCode": 201,
                "content": {
                    id: createdUser.id,
                    name,
                    email,
                    pass_word,
                    phone,
                    birth_day,
                    gender,
                    role
                },
                "dateTime":jsonDate
            }
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
                let token = this.jwt.sign(checkEmail, {
                    expiresIn: "7d",
                    secret: this.config.get("SECRET_KEY")
                });
                // console.log("token",token)
                let jsonDate = (new Date()).toJSON();
                //pass dung
                return {
                    check: true,
                    token: token,
                    user: checkEmail,
                    jsonDate,
                   
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
                data: "Email sai rồi nhé bạn"
            };
        }
    }
}
