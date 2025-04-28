import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { User } from '@modules/users/entities/user.entity';

const generateUniqueId = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

export const getUniqueCreateUserDto = (): CreateUserDto => {
  const uniqueId = generateUniqueId();
  return {
    email: `test-${uniqueId}@example.com`,
    password: 'Test1234',
  };
};

export const mockCreateUserDto: CreateUserDto = getUniqueCreateUserDto();

export const mockUser: Partial<User> = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  email: mockCreateUserDto.email,
  createdAt: new Date(),
  updatedAt: new Date(),
};
