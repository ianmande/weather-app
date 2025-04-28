import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UsePipes,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { Public } from '@common/decorators/public.decorator';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserRegistrationPipe } from './pipes/user-registration.pipe';
import { UsersService } from './users.service';

/**
 * Controller for managing user operations
 */
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Create a new user
   */
  @Post()
  @Public()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiCreatedResponse({
    description: 'The user has been successfully created',
    type: User,
  })
  @UsePipes(UserRegistrationPipe)
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.createUser(createUserDto);

    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Get all users
   */
  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({
    description: 'List of all users',
    type: [User],
  })
  async findAllUsers(): Promise<User[]> {
    return this.usersService.findAllUsers();
  }

  /**
   * Get a user by ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID (UUID)', type: 'string' })
  @ApiOkResponse({
    description: 'User details',
    type: User,
  })
  async findUserById(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return this.usersService.findUserById(id);
  }

  /**
   * Update a user
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', description: 'User ID (UUID)', type: 'string' })
  @ApiOkResponse({
    description: 'The user has been successfully updated',
    type: User,
  })

  /**
   * Delete a user
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'User ID (UUID)', type: 'string' })
  @ApiOkResponse({ description: 'The user has been successfully deleted' })
  async deleteUser(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.usersService.deleteUser(id);
  }
}
