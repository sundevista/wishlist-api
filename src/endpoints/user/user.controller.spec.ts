import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

const userData: User[] = [
  {
    id: '1',
    username: 'alexgrenor',
    level: 1,
    xp: 0,
    avatar: null,
    full_name: 'Alex Grenor',
    email: 'alex@gmail.com',
    password: '123456789',
  },
];

describe('User Controller', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService(null, null);
    userController = new UserController(userService);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      jest
        .spyOn(userService, 'findAll')
        .mockImplementation(() => new Promise((resolve) => resolve(userData)));

      expect(await userController.fetchUsers()).toBe(userData);
    });

    it('should return an empty array', async () => {
      jest
        .spyOn(userService, 'findAll')
        .mockImplementation(() => new Promise((resolve) => resolve([])));

      expect(await userController.fetchUsers()).toStrictEqual([]);
    });
  });
});
