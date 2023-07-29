import { SetMetadata } from "@nestjs/common"
import { Position } from "@prisma/client"

export const Roles = (...roles: Position[]) => {
    return SetMetadata("roles", roles)
}