import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Jobs, Position } from '@prisma/client';
import * as jwt from "jsonwebtoken"
import * as bcrypt from "bcryptjs"

interface RegisterUser {
    name: string 
    email: string 
    password: string 
    working?: boolean
    position?: Position
    jobTitle?: Jobs
    skills?: string[]
    company_id?: string 
    product_key?: string 
}

interface LoginUser{
    email: string 
    password: string 
}

@Injectable()
export class AuthService {
    constructor(private readonly prisma:PrismaService){}

    async register(body: RegisterUser){
        
        const isUserExist = await this.prisma.user.findUnique({
            where:{
                email: body.email
            }
        })

        if(isUserExist) throw new UnauthorizedException("The User is Already Exists in Our db")

        if(body.position ===  Position.FOUNDER || body.position === Position.HR_MANAGER || body.position === Position.ADMIN) {
            console.log("hello")
            if (!body.product_key) throw new UnauthorizedException("You are not authorized to log in as a Founder or HR_MANAGER")
            const formula = `${body.name}-${body.email}-${process.env.PRODUCT_KEY_SECRET}`
           
            const isUserAuthorized = await bcrypt.compare(formula, body.product_key)

            if(!isUserAuthorized) throw new UnauthorizedException("Product key is invalid, please contact to ADMIN") 

        }

        const hash = await bcrypt.hash(body.password, 10)
        delete body.product_key
        const user = await this.prisma.user.create({
            data:{
                ...body,
                password: hash
            }
        })
        const token = await this.getToken(user.email,user.id)

        return {user: {name: user.name}, access_token: token}
    }
    
    async login({email, password}: LoginUser){
        const user = await this.prisma.user.findUnique({
            where:{
                email
            }
        })
        if(!user) throw new NotFoundException("User Not Found")
        
        const isPasswordMatches = await bcrypt.compare(password, user.password)

        if(!isPasswordMatches) throw new UnauthorizedException("Password is incorrect...")

        const token = await this.getToken(user.email, user.id)
        return {user: {name: user.name}, access_token: token}

    }

    async getKey(name, email){
        const formula = `${name}-${email}-${process.env.PRODUCT_KEY_SECRET}`

        return await bcrypt.hash(formula, 10)
    }
    
    getToken(email:string , id: string ){
        return jwt.sign({
            email, id
        }, process.env.JWT_SECRET,{
            expiresIn: "30d"
        })    
    }

    async getOneUser(userId: string){
        return await this.prisma.user.findUnique({
            where:{
                id: userId
            },include:{
                company:{
                    select:{
                        name: true
                    }
                }
            }
        })
    }

}
