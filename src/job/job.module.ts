import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';

@Module({
  providers: [JobService],
  controllers: [JobController]
})
export class JobModule {}
