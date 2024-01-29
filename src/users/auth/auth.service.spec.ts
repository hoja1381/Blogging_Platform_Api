import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../service/users.service';
import { User } from '../user.entity';
import { Register_UserDto } from '../dtos/register_user.dto';

describe('AuthService', () => {
  let service: AuthService;

  let userService = {
    findByEmail: jest.fn(),
    findByUsername: jest.fn(),
    create: jest.fn((info) => Promise.resolve(info)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: userService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should throw an err of there is a duplicated user by email.', async () => {
      userService.findByEmail.mockReturnValue((email: string) =>
        Promise.resolve({ email: email } as User),
      );
      try {
        await service.register({ email: '@g.com' } as Register_UserDto);
        expect(true).toBe(false);
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    it('should throw an err of there is a duplicated user by username.', async () => {
      userService.findByUsername.mockReturnValue((username: string) =>
        Promise.resolve({ username: username } as User),
      );
      try {
        await service.register({ username: 'hoja' } as Register_UserDto);
        expect(true).toBe(false);
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });

  describe('login', () => {
    it('should throw an err of there is no user email.', async () => {
      try {
        await service.login('@g.com', '1234');
        expect(true).toBe(false);
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });
});
