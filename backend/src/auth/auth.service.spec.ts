/* eslint-disable @typescript-eslint/unbound-method */
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    usersService = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<UsersService>;
    jwtService = {
      sign: jest.fn().mockReturnValue('token'),
    } as unknown as jest.Mocked<JwtService>;
    service = new AuthService(usersService, jwtService);
  });

  it('updates the authenticated user profile when the email is available', async () => {
    const existingUser = {
      id: '1',
      email: 'old@example.com',
      name: 'Old Name',
    };
    const updateMock = usersService.update as jest.Mock;
    const findByIdMock = usersService.findById as jest.Mock;
    const findByEmailMock = usersService.findByEmail as jest.Mock;

    findByIdMock.mockResolvedValue(existingUser);
    findByEmailMock.mockResolvedValue(null);
    updateMock.mockResolvedValue({
      id: '1',
      email: 'new@example.com',
      name: 'New Name',
    });

    const result = await service.updateProfile('1', {
      email: 'new@example.com',
      name: 'New Name',
    });

    expect(updateMock).toHaveBeenCalledWith('1', {
      email: 'new@example.com',
      name: 'New Name',
    });
    expect(result).toEqual({
      id: '1',
      email: 'new@example.com',
      name: 'New Name',
    });
  });

  it('deletes the authenticated user profile', async () => {
    const findByIdMock = usersService.findById as jest.Mock;
    const removeMock = usersService.remove as jest.Mock;

    findByIdMock.mockResolvedValue({
      id: '1',
      email: 'user@example.com',
      name: 'User',
    });
    removeMock.mockResolvedValue(undefined);

    await expect(service.deleteProfile('1')).resolves.toBeUndefined();
    expect(removeMock).toHaveBeenCalledWith('1');
  });
});
