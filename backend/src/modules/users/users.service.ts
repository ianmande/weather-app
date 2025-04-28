import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { HashService } from '@common/services/hash.service';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

/**
 * Service for managing user operations
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}

  /**
   * Create a new user
   */
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create({
      email: createUserDto.email,
      passwordHash: await this.hashService.hash(createUserDto.password),
    });

    return this.usersRepository.save(user);
  }

  /**
   * Find all users
   */
  async findAllUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }

  /**
   * Find a user by ID
   */
  async findUserById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  /**
   * Find a user by email
   */
  async findUserByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  /**
   * Update a user by ID
   * @param id - User ID
   * @param updateData - Partial user data to update
   * @returns Updated user
   */
  async updateUser(id: string, updateData: Partial<User>): Promise<User> {
    const user = await this.findUserById(id);

    // Update user with new data
    Object.assign(user, updateData);

    return this.usersRepository.save(user);
  }

  /**
   * Delete a user
   */
  async deleteUser(id: string): Promise<void> {
    const user = await this.findUserById(id);
    await this.usersRepository.remove(user);
  }
}
