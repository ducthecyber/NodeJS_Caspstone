import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';

@Module({
  imports:[JwtModule.register({secret:process.env.SECRET_KEY}),ConfigModule],
  controllers: [TokenController],
  providers: [TokenService,ConfigService]
})
export class TokenModule {}
