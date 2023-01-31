import {Body, Controller, Delete, Get, Param, Post} from '@nestjs/common';
import {UserService} from "./user.service";
import {User} from "./dto/user/user";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    public findAll(): User[] {
        return this.userService.getUsers();
    }

    @Post()
    public create(@Body() user: User): User {
        return this.userService.addUser(user.username, user.full_name);
    }

    @Delete(':id')
    public delete(@Param('id') id: number): void {
        this.userService.removeUser(id);
    }
}
