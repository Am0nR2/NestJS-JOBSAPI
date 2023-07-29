import { IsOptional, IsString } from "class-validator";

export class GetAllCompaniesDto{
    @IsString()
    @IsOptional()
    name?: string
}