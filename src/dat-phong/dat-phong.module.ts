import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { TokenModule } from 'src/token/token.module';
import { TokenService } from 'src/token/token.service';
import { DatPhongController } from './dat-phong.controller';
import { DatPhongService } from './dat-phong.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports:[JwtModule.register({secret:process.env.SECRET_KEY}),TokenModule,AuthModule,ConfigModule],
  controllers: [DatPhongController],
  providers: [DatPhongService,JwtStrategy,TokenService,AuthService,ConfigService]
})
export class DatPhongModule {}
