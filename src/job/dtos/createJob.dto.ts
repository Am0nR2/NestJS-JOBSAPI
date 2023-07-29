import { Jobs } from "@prisma/client"
import { IsEnum, IsNotEmpty, IsString } from "class-validator"

export class CreateJobDto{
    @IsEnum(Jobs)
    @IsNotEmpty()
    jobTitle    :Jobs                            
    
    @IsString()
    @IsNotEmpty()
    description :string                           
}