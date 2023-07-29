import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dtos/registerUser.dto';
import { GetKeyDto } from './dtos';
import { LoginUserDto } from './dtos/loginUser.dto';
import { User, UserType } from './decorator/user.decorator';
import { Roles } from '../decorator/user.decorator';
import { Position } from '@prisma/client';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post("register")
    async register(
        @Body() body: RegisterUserDto 
    ){
        return await this.authService.register(body)
    }

    @Post("login")
    async login(
        @Body() body: LoginUserDto
    ){
        return this.authService.login(body)
    }
    
    @Roles(Position.ADMIN, Position.FOUNDER, Position.HR_MANAGER)
    @Post("getkey")
    async getKey(
        @Body() {name, email}: GetKeyDto
    ){
        return this.authService.getKey(name, email)
    }

    @Get("find/:userId")
    getUserById(
        @Param("userId") userID: string
    ){
        return this.authService.getOneUser(userID)
    }

}
