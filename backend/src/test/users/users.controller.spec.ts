import { Test, TestingModule } from '@nestjs/testing';

import { UsersController } from '@modules/users/users.controller';
import { UsersService } from '@modules/users/users.service';

import { mockCreateUserDto, mockUser } from '../mocks/user.mock';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn().mockResolvedValue(mockUser),
            findAllUsers: jest.fn().mockResolvedValue([mockUser]),
            findUserById: jest.fn().mockResolvedValue(mockUser),
            deleteUser: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserSpy = jest.spyOn(usersService, 'createUser');

      const result = await usersController.createUser(mockCreateUserDto);

      expect(createUserSpy).toHaveBeenCalledWith(mockCreateUserDto);
      console.log('result', result);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAllUsers', () => {
    it('should return all users', async () => {
      const findAllUsersSpy = jest.spyOn(usersService, 'findAllUsers');

      const result = await usersController.findAllUsers();

      expect(findAllUsersSpy).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findUserById', () => {
    it('should return a user by id', async () => {
      const userId = 'some-id';
      const findUserByIdSpy = jest.spyOn(usersService, 'findUserById');

      const result = await usersController.findUserById(userId);

      expect(findUserByIdSpy).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUser);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const userId = 'some-id';
      const deleteUserSpy = jest.spyOn(usersService, 'deleteUser');

      await usersController.deleteUser(userId);

      expect(deleteUserSpy).toHaveBeenCalledWith(userId);
    });
  });
});
