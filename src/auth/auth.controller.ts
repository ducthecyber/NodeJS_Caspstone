import { Controller, HttpException, Body, Post, NotFoundException, HttpStatus } from '@nestjs/common';
import { Headers, Param, UseGuards } from '@nestjs/common/decorators';
// import { Body, Post } from '@nestjs/common/decorators';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt/dist';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiHeader, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { NguoiDungDto } from './dto/signin.dto';
import { ThongTinNguoiDung } from './dto/signup.dto';
import { Token } from './dto/token.dto';

@ApiTags("Auth")
@Controller('/api/auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private jwt: JwtService,
        // private config:ConfigService
    ) { }

    //SIGNUP
    @Post("/signup")
    @ApiHeader({
        name: 'tokenCybersoft',
        description: 'Nhập token cybersoft',
        required: true,
    })
    @ApiParam({ name: "model", required: false, description: "" })
    @UseGuards(AuthGuard("jwt"))
    async signup(@Body() body: ThongTinNguoiDung,): Promise<any> {
        const { name, email, pass_word, phone, birth_day, gender, role } = body;
        // console.log(tokenCyberSoft)
        return this.authService.signup(name, email, pass_word, phone, birth_day, gender, role)

    }


    //SIGNIN
    @Post("/signin")
    async signin(@Body() body: NguoiDungDto): Promise<any> {
        const { email, pass_word } = body;
        let checkLogin = await this.authService.signin(email, pass_word);

        if (checkLogin.check) {
            return {
                statusCode: 200,
                message: "Signin thành công",
                content: {
                    user: checkLogin.user,
                    token: checkLogin.data
                }
            }
        }
        else {
            throw new HttpException(checkLogin.data, HttpStatus.NOT_FOUND);
        }
    }

}
