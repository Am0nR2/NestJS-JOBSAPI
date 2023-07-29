import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { JobService } from './job.service';
import { Position } from '@prisma/client';
import { Roles } from '../decorator/user.decorator';
import { CreateJobDto } from './dtos';
import { User, UserType } from '../auth/decorator/user.decorator';
import { UpdateJobDto } from './dtos/updateJob.dto';
import { QueryDto } from './dtos/getAllJobsQuery.dto';

@Controller('job')
export class JobController {
    constructor(private readonly jobService: JobService){}

    @Get()
    async getAllJobs(
        @Query() query: QueryDto
    ){
        return this.jobService.getAllJobs(query)
    }

    @Get(":jobID")
    async getSingleJob(
        @Param("jobID") jobID: number
    ){
        return await this.jobService.getSingleJob(jobID)
    }

    @Roles(Position.ADMIN, Position.FOUNDER, Position.HR_MANAGER)
    @Post()
    async createJob(
        @Body() body: CreateJobDto,
        @User() user: UserType
    ){
        return this.jobService.createJob(body, user)
    }

    @Roles(Position.ADMIN, Position.FOUNDER, Position.HR_MANAGER)
    @Put(":jobID")
    async updateJob(
        @Body() body: UpdateJobDto,
        @User() user: UserType,
        @Param("jobID") jobID : number 
    ){
        return this.jobService.updateJob(body, user, jobID)
    }

    @Roles(Position.ADMIN, Position.FOUNDER, Position.HR_MANAGER)
    @Delete(":jobID")
    async deleteJob(
        @Param("jobID") jobID : number,
        @User() user: UserType
    ){
        return this.jobService.deleteJob(user, jobID)
    }
}
