import { Jobs, Position } from "@prisma/client"
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateIf } from "class-validator"

export class UpdateCompanyDto{
        @IsOptional()
        @IsString()
        name?: string
        
        @IsOptional()
        @IsEmail()
        email?: string 
        
        @IsOptional()
        @IsString()
        founder_id?: string  
        
        @IsOptional()
        @IsString()
        addWorker?: string
        
        @ValidateIf((obj) => obj && obj.addWorker) // Validate if addWorker is provided
        @IsEnum(Jobs)
        @IsNotEmpty()
        jobTitle: Jobs;
        
        @ValidateIf((obj) => obj && obj.addWorker) // Validate if addWorker is provided
        @IsEnum(Position)
        @IsNotEmpty()
        position: Position;

        @IsOptional()
        @IsString()
        deleteWorker?: string 

}