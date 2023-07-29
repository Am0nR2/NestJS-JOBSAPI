import { Jobs, Position } from "@prisma/client"
import { IsArray, IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class RegisterUserDto{
    @IsString()
    @IsNotEmpty()
    name: string 
    
    @IsEmail()
    @IsNotEmpty()
    email: string 
    
    @IsString()
    @IsNotEmpty()
    password: string

    @IsOptional()
    @IsBoolean()
    working?: boolean
    
    @IsOptional()
    @IsEnum(Position)
    position?: Position
    
    @IsOptional()
    @IsEnum(Jobs)
    jobTitle?: Jobs
    
    @IsOptional()
    @IsArray()
    skills?: string[]
    
    @IsOptional()
    @IsString()
    company_id?: string 

    @IsString()
    @IsOptional()
    product_key: string 
}
