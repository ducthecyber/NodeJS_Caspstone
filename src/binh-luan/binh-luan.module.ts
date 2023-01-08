import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { TokenModule } from 'src/token/token.module';
import { TokenService } from 'src/token/token.service';
import { BinhLuanController } from './binh-luan.controller';
import { BinhLuanService } from './binh-luan.service';

@Module({
  imports:[JwtModule.register({secret:process.env.SECRET_KEY}),TokenModule,AuthModule,ConfigModule],
  controllers: [BinhLuanController],
  providers: [BinhLuanService,JwtStrategy,TokenService,AuthService,ConfigService]
})
export class BinhLuanModule {}
