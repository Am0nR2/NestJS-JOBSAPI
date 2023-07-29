import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { JobModule } from './job/job.module';
import { PrismaModule } from './prisma/prisma.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { UserInterceptor } from './auth/interceptor/user.interceptor';
import { AuthGuard } from './guard/auth.guard';
import { CompanyModule } from './company/company.module';

@Module({
  imports: [AuthModule, JobModule, PrismaModule, CompanyModule],
  providers: [{
    provide: APP_INTERCEPTOR,
    useClass: UserInterceptor
  },{
    provide: APP_GUARD,
    useClass: AuthGuard
  }],
})
export class AppModule {}
