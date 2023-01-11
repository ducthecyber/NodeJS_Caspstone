import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { BinhLuanModule } from './binh-luan/binh-luan.module';
import { TokenModule } from './token/token.module';
import { DatPhongModule } from './dat-phong/dat-phong.module';
import { PhongThueModule } from './phong-thue/phong-thue.module';
import { NguoiDungModule } from './nguoi-dung/nguoi-dung.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}),
    AuthModule,JwtModule.register({}), BinhLuanModule, TokenModule, DatPhongModule, PhongThueModule, NguoiDungModule],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
