import { Jobs } from "@prisma/client"
import { IsEnum, IsOptional, IsString } from "class-validator"

export class UpdateJobDto{
    @IsEnum(Jobs)
    @IsOptional()
    jobTitle    :Jobs                            
    
    @IsString()
    @IsOptional()
    description :string       
}