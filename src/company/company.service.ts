import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserType } from '../auth/decorator/user.decorator';
import { Jobs, Position, User } from '@prisma/client';

interface GetAllCompanies{
    name?: string
}

interface CreateCompany{
    name:string
    email: string
}

interface UpdateCompany{
    name?: string
    email?: string 
    founder_id?: string  
    addWorker?: string
    jobTitle?: Jobs
    deleteWorker?: string
    position?: Position 
}

@Injectable()
export class CompanyService {
    constructor(private readonly prisma:PrismaService){}
 
    async getAllCompanies({name}: GetAllCompanies){
      
            const companies = await this.prisma.company.findMany({
                ...(name && {where:{
                    name: {
                      contains: name,
                      mode: "insensitive"
                    }
                  }}),
                take:15
            })
            return companies
    }

    async getCompany(companyID: string){
        return await this.prisma.company.findUnique({
            where: {
                id: companyID
            }, include:{
                workers:{
                    select:{
                        name: true,
                        id: true,
                    }
                }
            }
        })
    }
    
    async createCompany(user : UserType, body: CreateCompany){
        const isCompanyExists = await this.prisma.company.findUnique({
            where:{
                email: body.email
            }
        })

        if(isCompanyExists) throw new UnauthorizedException("The company is already exists in our db")

        const company = await this.prisma.company.create({
            data:{
                ...body,
                founder_id: user.id
            }
        }) 
        
        const founder = await this.prisma.user.update({
            where: {
                email: user.email
            },
            data:{
                company_id: company.id,
                working: true,
                jobTitle: "CEO"
            }
        })

        return {msg: "Concractz, You have successfully created your own company!", company}
    }

    async updateCompany(user: UserType,
      {
          name,
          email,
          founder_id,
          jobTitle,
          addWorker,
          deleteWorker,
          position
      }:UpdateCompany,
      companyID: string){
          
          const companyToUpdate = await this.prisma.company.findUnique({
              where:{
                  id: companyID
              }, select: {
                  founder_id:true
              }
          })
          
          const findFounder = await this.prisma.user.findUnique({
            where:{
              email: user.email
            }
          })
          
      founder_id = companyToUpdate.founder_id === findFounder.id ? founder_id : undefined

      const findUser = addWorker || deleteWorker ? await this.prisma.user.update({
          where:{
            id: addWorker || deleteWorker            
          }, data : {
            company_id: addWorker ? companyID : deleteWorker ? null : undefined,
            jobTitle: addWorker ? jobTitle : deleteWorker ? "UNEMPLOYED" : undefined,
            working: addWorker ? true : deleteWorker ? false : undefined,
            position: addWorker ? position : deleteWorker ? "NOT_WORKING" : undefined 
          }
      }) : undefined
      
      const data = {
          ...(email && {email}),
          ...(name && {name}),
          ...(founder_id && {founder_id}),
      }
      const company = await this.prisma.company.update({            
          where:{
              id:companyID
          }, data:{
              ...(email && {email}),
              ...(name && {name}),
              ...(founder_id && {founder_id}),
          }
      }) 

      return {msg: "Task successfully done..."}
  }

    async deleteCompany(companyID: string){
        const company = await this.prisma.company.findUnique({
            where:{
                id: companyID
            },
            select:{
                workers:{
                    select:{
                        id:true
                    }
                },
                founder_id: true
            }
        })
        const workers = company.workers.map(worker => {
            return Object.values(worker)
        }).flat() as string[]
        const founderId = company.founder_id
        workers.map(async (worker) => {
            await this.prisma.user.update({
                where:{
                    id: worker
                }, data:{
                    working : false,
                    position: worker === founderId ? "FOUNDER" : "NOT_WORKING",
                    jobTitle: worker === founderId ? "FORMER_CEO" : "UNEMPLOYED" 
                } 
            })
        })

        await this.prisma.company.delete({
            where:{
                id: companyID
            }
        })

    
        
        return {msg: "Company has successfully removed from our db"}
    }
}
