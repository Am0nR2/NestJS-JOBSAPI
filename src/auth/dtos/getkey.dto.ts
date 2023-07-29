import { IsNotEmpty, IsString } from "class-validator"

export class GetKeyDto{
    @IsString()
    @IsNotEmpty()
    name: string
    
    @IsString()
    @IsNotEmpty()
    email: string
}