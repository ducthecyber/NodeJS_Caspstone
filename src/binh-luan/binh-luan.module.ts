import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { TokenModule } from 'src/token/token.module';
import { TokenService } from 'src/token/token.service';
import { BinhLuanController } from './binh-luan.controller';
import { BinhLuanService } from './binh-luan.service';

@Module({
  imports:[JwtModule.register({}),TokenModule,AuthModule],
  controllers: [BinhLuanController],
  providers: [BinhLuanService,JwtStrategy,TokenService,AuthService]
})
export class BinhLuanModule {}
