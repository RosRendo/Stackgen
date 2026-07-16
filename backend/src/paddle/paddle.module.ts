import { Module } from '@nestjs/common';
import { PaddleService } from './paddle.service';
import { PaddleController } from './paddle.controller';

@Module({
  providers: [PaddleService],
  controllers: [PaddleController],
  exports: [PaddleService],
})
export class PaddleModule {}
