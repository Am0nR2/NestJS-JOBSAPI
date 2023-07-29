import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class CreateCompanyDto{
    @IsNotEmpty()
    @IsString()
    name:string
    @IsEmail()
    @IsNotEmpty()
    email:string
}