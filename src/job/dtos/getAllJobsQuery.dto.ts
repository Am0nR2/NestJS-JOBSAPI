import { Jobs } from "@prisma/client";
import { IsEnum, IsOptional } from "class-validator";

export class QueryDto{
    @IsEnum(Jobs)
    @IsOptional()
    jobTitle: Jobs
}