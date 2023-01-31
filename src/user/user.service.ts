import { Injectable } from '@nestjs/common';
import {User} from "./dto/user/user";
import {UserException} from "./exception/user.exception";

@Injectable()
export class UserService {
    private users: User[] = [
        {
            id: 1,
            username: 'decatetsu',
            full_name: 'Сергій Андрійович',
            profile_picture: '',
            city: 'Миколаїв',
            address: '',
            level: 1,
            xp: 100,
            wishes: [1, 2],
        },
        {
            id: 2,
            username: 'sofa_lord',
            full_name: 'Назар Назарович',
            profile_picture: '',
            city: 'Миколаїв',
            address: '',
            level: 2,
            xp: 200,
            wishes: [3, 4],
        },
    ];

    public getUsers(): User[] {
        return this.users;
    }

    public addUser(username: string, full_name: string): User {
        if (this.users.filter(user => user.username === username).length !== 0) {
            throw new UserException('Username is already taken!');
        }

        if (full_name.length < 5) {
            throw new UserException('Full name is too short!');
        }

        const newUser = {
                id: this.generateId(),
                username: username,
                full_name: full_name,
                profile_picture: '',
                city: '',
                address: '',
                level: 1,
                xp: 0,
                wishes: [],
        };

        this.users.push(newUser);

        return newUser;
    }

    public removeUser(id: number): void {
        const resultingArray = this.users.filter(user => user.id !== id);

        if (resultingArray.length === this.users.length) {
            throw new UserException('User not found!');
        }

        this.users = resultingArray;
    }

    public generateId(): number {
        return this.users.length ? this.users.length + 1 : 0;
    }
}
