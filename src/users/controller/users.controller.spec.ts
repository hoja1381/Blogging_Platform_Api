import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../service/users.service';
import { AuthService } from '../auth/auth.service';
import { Register_UserDto } from '../dtos/register_user.dto';

describe('UsersController', () => {
  let controller: UsersController;

  let userService = {};
  let authService = {
    register: jest.fn((body) => Promise.resolve({ id: 1, ...body })),
    login: jest.fn((email, password) =>
      Promise.resolve({ id: 1, email: email, password: password }),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: userService },
        { provide: AuthService, useValue: authService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should return the registered user with the token.', async () => {
      let session = { accessToken: null };
      expect(
        await controller.register(
          { username: 'hoja' } as Register_UserDto,
          session,
        ),
      ).toBeDefined();
      expect(session.accessToken).toBeDefined;
    });
  });

  describe('login', () => {
    it('should return the logged in user with the token.', async () => {
      let session = { accessToken: null };
      expect(
        await controller.login(
          { email: 'hoja', password: '1234' } as Register_UserDto,
          session,
        ),
      ).toBeDefined();
      expect(session.accessToken).toBeDefined;
    });
  });

  describe('log Out', () => {
    it('should clear the token.', async () => {
      let session = { accessToken: 'some value' };
      controller.logout(session);
      expect(session.accessToken).toBeNull();
    });
  });

  describe('get Me', () => {
    it('should get the current user.', async () => {
      expect(await controller.getMe({ id: 1 })).toEqual({ id: 1 });
    });
    it('should throw err if there is not a current user.', async () => {
      try {
        await controller.getMe(null);
        expect(true).toBe(false);
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });
});
