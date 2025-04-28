import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User } from '@modules/users/entities/user.entity';
import { UsersService } from '@modules/users/users.service';

import { HashService } from '@common/services/hash.service';

import { mockUser, mockCreateUserDto } from '../mocks/user.mock';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: Repository<User>;
  let hashService: HashService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn().mockReturnValue(mockUser),
            save: jest.fn().mockResolvedValue(mockUser),
            find: jest.fn().mockResolvedValue([mockUser]),
            findOne: jest.fn().mockResolvedValue(mockUser),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: HashService,
          useValue: {
            hash: jest.fn().mockResolvedValue('hashedPassword'),
            compare: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    hashService = module.get<HashService>(HashService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserSpy = jest.spyOn(usersRepository, 'create');
      const saveUserSpy = jest.spyOn(usersRepository, 'save');
      const hashPasswordSpy = jest.spyOn(hashService, 'hash');

      const result = await usersService.createUser(mockCreateUserDto);

      expect(hashPasswordSpy).toHaveBeenCalledWith(mockCreateUserDto.password);
      expect(createUserSpy).toHaveBeenCalledWith({
        email: mockCreateUserDto.email,
        passwordHash: 'hashedPassword',
      });
      expect(saveUserSpy).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAllUsers', () => {
    it('should return all users', async () => {
      const findSpy = jest.spyOn(usersRepository, 'find');

      const result = await usersService.findAllUsers();

      expect(findSpy).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findUserById', () => {
    it('should return a user by id', async () => {
      const findOneSpy = jest.spyOn(usersRepository, 'findOne');

      const result = await usersService.findUserById('some-id');

      expect(findOneSpy).toHaveBeenCalledWith({ where: { id: 'some-id' } });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(
        usersService.findUserById('non-existent-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findUserByEmail', () => {
    it('should return a user by email', async () => {
      const findOneSpy = jest.spyOn(usersRepository, 'findOne');

      const result = await usersService.findUserByEmail('test@example.com');

      expect(findOneSpy).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('deleteUser', () => {
    it('should remove a user', async () => {
      const findUserByIdSpy = jest.spyOn(usersService, 'findUserById');
      const removeSpy = jest.spyOn(usersRepository, 'remove');

      findUserByIdSpy.mockResolvedValueOnce(mockUser as User);

      await usersService.deleteUser('some-id');

      expect(findUserByIdSpy).toHaveBeenCalledWith('some-id');
      expect(removeSpy).toHaveBeenCalledWith(mockUser);
    });
  });
});
