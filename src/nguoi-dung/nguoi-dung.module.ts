import { Module } from '@nestjs/common';
import { NguoiDungController } from './nguoi-dung.controller';
import { NguoiDungService } from './nguoi-dung.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { TokenModule } from 'src/token/token.module';
import { TokenService } from 'src/token/token.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports:[JwtModule.register({secret:process.env.SECRET_KEY}),TokenModule,AuthModule,ConfigModule],
  controllers: [NguoiDungController],
  providers: [NguoiDungService,JwtStrategy,TokenService,AuthService,ConfigService]
})
export class NguoiDungModule {}
