import { CallHandler, ExecutionContext, NestInterceptor, UnauthorizedException } from "@nestjs/common";
import * as jwt from "jsonwebtoken"

export class UserInterceptor implements NestInterceptor{
    async intercept(
        context: ExecutionContext,
        handler: CallHandler
    ){
        const request = context.switchToHttp().getRequest()
        const token = request?.headers?.authorization?.split("Bearer ")[1]
        
        if(!token) return handler.handle()

        try {
            const payload = await jwt.verify(token, process.env.JWT_SECRET)
            request.user = payload
            return handler.handle()
        } catch (error) {
            throw new UnauthorizedException("You are not authorized to do the action")
        }        
    }
}