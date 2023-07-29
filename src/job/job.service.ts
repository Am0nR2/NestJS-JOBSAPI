import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Jobs } from '@prisma/client';
import { UserType } from '../auth/decorator/user.decorator';

interface CreateJob{
    jobTitle    :Jobs   
    description :string    
}

interface UpdateJob{
    jobTitle    ?:Jobs   
    description ?:string    
}

interface Query{
    jobTitle    ?: Jobs
}

@Injectable()
export class JobService {
    constructor(private readonly prisma: PrismaService){}
    
    async getAllJobs({jobTitle}: Query){
        const jobs = await this.prisma.job.findMany({
            ...(jobTitle && {where: {
                jobTitle
            }}),
          });
          return jobs;
    }

    async getSingleJob(jobID: number){
        const job = await this.prisma.job.findUnique({
            where:{
                id: jobID
            },include:{
                company:{
                    select:{
                        name:true,
                        founder:{
                            select:{
                                name:true,
                                position:true,
                                jobTitle:true
                            }
                        }
                    }
                }
            }
        })
        return job

    }

    async createJob({description, jobTitle} : CreateJob, user: UserType){
        const company = await this.prisma.user.findUnique({
            where:{
                id: user.id
            }, select:{
                company_id:true
            }
        })
        
        const job = await this.prisma.job.create({
            data:{
                description,
                jobTitle,
                company_id: company.company_id         
            }
        })

        return {msg: "Posting has been created successfuly", job}
    }

    async updateJob({description, jobTitle}: UpdateJob, user:UserType, jobID: number){
            const job = await this.prisma.job.update({
                where:{
                    id: jobID
                }, data:{
                    ...(description && {description}),
                    ...(jobTitle && {jobTitle})  
                }
            })

            return {msg: "Job has successfully updated", job}
    }

    async deleteJob(user: UserType, jobID: number){
        await this.prisma.job.delete({
            where:{
                id: jobID
            }
        })

        return {msg: "Job has been successfully deleted from the db"}
    }   
}
