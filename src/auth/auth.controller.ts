import { Controller, HttpException, Post, NotFoundException, HttpStatus, ValidationPipe, ForbiddenException } from '@nestjs/common';
import { Headers, Param, Query, UseGuards, Body, Req } from '@nestjs/common/decorators';
import { ParameterObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
// import { Body, Post } from '@nestjs/common/decorators';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt/dist';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiExtraModels, ApiHeader, ApiOperation, ApiParam, ApiPropertyOptional, ApiResponse, ApiResponseProperty, ApiTags } from '@nestjs/swagger';
import { type } from 'os';
import { AuthService } from './auth.service';
import { DangNhapView } from './dto/signin.dto';
import { ThongTinNguoiDung } from './dto/signup.dto';
import { Token } from '../dto/token.dto';
import { TokenService } from 'src/token/token.service';

@ApiTags("Auth")
@Controller('/api/auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private jwt: JwtService,
        private tokenService: TokenService,
    ) { }

    //SIGNUP
    @Post("/signup")
    // @ApiHeader({
    //     name: 'tokenCybersoft',
    //     description: 'Nhập token cybersoft',
    //     required: true,
    // })

    @ApiBody({ type: ThongTinNguoiDung, required: true })
    // @UseGuards(AuthGuard("jwt"))
    public async signup(
        @Body() body: ThongTinNguoiDung,
        @Headers() headers: Token
    )
        : Promise<any> {
        let data = await this.tokenService.checkToken(headers)
        // let data: any = await this.jwt.decode(headers.tokencybersoft);
        // let dNow: Date = new Date();
        // let dToken: Date = new Date(Number(data.HetHanTime));

        // if (dNow > dToken)
        //     throw new ForbiddenException("Không có quyền truy cập");
        if (data == true) {
            const { name, email, pass_word, phone, birth_day, gender, role } = body;
            return this.authService.signup(name, email, pass_word, phone, birth_day, gender, role)
        }

        else {
            return this.tokenService.checkToken(headers)
        }
    }


    //SIGNIN
    @ApiBody({ type: DangNhapView, required: true })
    @Post("/signin")
    async signin(@Body() body: DangNhapView, @Headers() headers: Token): Promise<any> {
        const { email, pass_word } = body;
        let data = await this.tokenService.checkToken(headers)
        if (data === true) {
            let checkLogin = await this.authService.signin(email, pass_word);

            if (checkLogin.check) {
                return {
                    statusCode: 200,
                    message: "Signin thành công",
                    content: {
                        user: checkLogin.user,
                        token: checkLogin.token
                    },
                    dateTime: checkLogin.jsonDate
                }
            }
            else {
                throw new HttpException(checkLogin.data, HttpStatus.NOT_FOUND);
            }
        }
        else {
            return this.tokenService.checkToken(headers)
        }
    }

}
