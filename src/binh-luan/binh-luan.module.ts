import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { BinhLuanController } from './binh-luan.controller';
import { BinhLuanService } from './binh-luan.service';

@Module({
  imports:[JwtModule.register({})],
  controllers: [BinhLuanController],
  providers: [BinhLuanService,JwtStrategy]
})
export class BinhLuanModule {}
