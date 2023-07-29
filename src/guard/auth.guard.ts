import { Reflector } from "@nestjs/core";
import { PrismaService } from "../prisma/prisma.service";
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import * as jwt from "jsonwebtoken"
import { UserType } from "../auth/decorator/user.decorator";

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(
        private readonly prisma: PrismaService,
        private readonly reflector: Reflector
        ){}
        
        async canActivate(
            context: ExecutionContext
        ){
            const roles = this.reflector.getAllAndOverride("roles" ,[
                context.getHandler(),
                context.getClass()
            ])
            
            if(!roles?.length) return true
            
            const req = context.switchToHttp().getRequest()
            const token = req?.headers?.authorization?.split("Bearer ")[1]
            try {
                if(!token) throw new UnauthorizedException("You are not authorized")
                const payload = await jwt.verify(token, process.env.JWT_SECRET) as UserType
                if(!payload) throw new UnauthorizedException("You are not authorized")
                const user = await this.prisma.user.findUnique({
                    where:{
                        email: payload.email
                    }
                })
                if(req.method === "PUT" || req.method === "DELETE") {
                    if(req?.params?.companyID){
                        const company = await this.prisma.company.findUnique({
                            where:{
                                id: req?.params?.companyID
                                
                        },select:{
                            workers:{
                                select: {
                                    id: true
                                }
                            }
                        }
                    })
                    const idsArr = company.workers.map(worker => {
                       return Object.values(worker)
                    }).flat()
                    if(!idsArr.includes(user.id)) throw new UnauthorizedException("You are not authorized")
                } else if(req?.params?.jobID){
                    const job = await this.prisma.job.findUnique({
                        where:{
                            id: Number(req.params.jobID)
                        }, 
                    })
                    const company = await this.prisma.company.findUnique({
                        where:{
                            id: job.company_id
                        },select:{
                            workers:{
                                select: {
                                    id:true
                                }
                            }
                        }
                    })
                    const workersArr = company.workers.map(worker => Object.values(worker)).flat()
                    if(!workersArr.includes(user.id)) throw new UnauthorizedException("You are not authorized")
                }
                }   
                if(!roles.includes(user.position)) throw new UnauthorizedException("You are not authorized")
                return true
                
            } catch (error) {
                throw new UnauthorizedException("You are not authorized")
            }
        }
    }


