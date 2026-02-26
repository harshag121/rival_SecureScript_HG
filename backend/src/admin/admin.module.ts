import { Global, Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { LogsBuffer } from './logs.buffer';

@Global()
@Module({
  controllers: [AdminController],
  providers: [LogsBuffer],
  exports: [LogsBuffer],
})
export class AdminModule {}
