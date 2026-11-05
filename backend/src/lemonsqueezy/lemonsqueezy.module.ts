import { Module } from '@nestjs/common';
import { LemonsqueezyService } from './lemonsqueezy.service';
import { LemonsqueezyController } from './lemonsqueezy.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [LemonsqueezyService],
  controllers: [LemonsqueezyController],
  exports: [LemonsqueezyService],
})
export class LemonsqueezyModule {}
