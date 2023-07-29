import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export interface UserType {
    email: string,
    id: string,
    iat: number,
    exp: number
}

export const User = createParamDecorator((data, context:ExecutionContext)=> {
    const req = context.switchToHttp().getRequest()
    return req.user
})