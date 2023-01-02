import { Controller,HttpException,Body, Post , NotFoundException, HttpStatus} from '@nestjs/common';
// import { Body, Post } from '@nestjs/common/decorators';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt/dist';
import { PrismaClient } from '@prisma/client';
import { AuthService } from './auth.service';
import { NguoiDungDto } from './dto/signin.dto';
import { NguoiDungMoiDto } from './dto/signup.dto';

@Controller('/auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private jwt: JwtService,
        // private config:ConfigService
    ){}

    private prisma = new PrismaClient();
    //SIGNUP
    @Post("/signup")
    async signup (@Body() body:NguoiDungMoiDto):Promise<any>{
        const {name,email,pass_word,phone,birth_day,gender,role}=body;
        return this.authService.signup(name,email,pass_word,phone,birth_day,gender,role)
    }

    //SIGNIN
    @Post("/signin")
    async signin (@Body() body: NguoiDungDto):Promise<any>{
        const {email, pass_word}= body;
        let checkLogin = await this.authService.signin(email,pass_word);

        if(checkLogin.check){
            return {
                message:"Signin thành công",
                tokenCybersoft: checkLogin.data
            }
        }
        else{
            throw new HttpException(checkLogin.data, HttpStatus.NOT_FOUND);
        }
    }
  
}
