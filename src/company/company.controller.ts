import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Position } from '@prisma/client';
import { Roles } from '../decorator/user.decorator';
import { User, UserType } from '../auth/decorator/user.decorator';
import { CreateCompanyDto, GetAllCompaniesDto, UpdateCompanyDto } from './dtos';
import { CompanyService } from './company.service';

@Controller('company')
export class CompanyController {

    constructor(private readonly companyService: CompanyService){}

    @Get()
    async getAllCompanies(
        @Query() name: GetAllCompaniesDto
    ){
        return await this.companyService.getAllCompanies(name)
    }
    
    @Get(":companyID")
    async getCompany(
        @Param("companyID") companyID: string 
    ){
        return await this.companyService.getCompany(companyID)
    }
    
    @Roles(Position.ADMIN, Position.FOUNDER)
    @Post()
    createCompany(
        @Body() body: CreateCompanyDto,
        @User() user: UserType
        ){
            return this.companyService.createCompany(user,body)
        }
        
    @Roles(Position.ADMIN, Position.FOUNDER, Position.HR_MANAGER)
    @Put(":companyID")
    updateCompany(
        @User() user: UserType,
        @Body() body: UpdateCompanyDto,
        @Param("companyID") companyID : string  
    ){
        // console.log(body.addWorker)
        return this.companyService.updateCompany(user, body, companyID)
    }

    @Roles(Position.ADMIN, Position.FOUNDER)
    @Delete(":companyID")
    deleteCompany(
        @Param("companyID") companyID: string 
    ){
        return this.companyService.deleteCompany(companyID)
    }





}
