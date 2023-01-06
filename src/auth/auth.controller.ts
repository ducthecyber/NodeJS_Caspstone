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
    // @ApiHeader({
    //     name: 'tokenCybersoft',
    //     description: 'Nhập token cybersoft',
    //     required: true,
    // })
    // @ApiResponse({
    //     status: 200,
    //     description: 'The comment was successfully updated',
    //     type: ThongTinNguoiDung
    // })
    @ApiBody({ type: ThongTinNguoiDung, required: false })
    // @UseGuards(AuthGuard("jwt"))
    public async signup(
        @Body() body: ThongTinNguoiDung,
        @Headers() headers: Token
    )
        : Promise<any> {
        let data: any = await this.jwt.decode(headers.tokencybersoft);
        let dNow: Date = new Date();
        let dToken: Date = new Date(Number(data.HetHanTime));
       
        if (dNow > dToken) 
            throw new ForbiddenException("Không có quyền truy cập");
       
            return "truy cap dc";
        //chak sửa kiểu dữ liệu của tokenCybersoft 
        const { name, email, pass_word, phone, birth_day, gender, role } = body;
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
