import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../service/users.service';
import { User } from '../user.entity';
import { Register_UserDto } from '../dtos/register_user.dto';

describe('AuthService', () => {
  // Service instance
  let service: AuthService;

  //mocked Service
  let userService = {
    findByEmail: jest.fn().mockResolvedValue(undefined),
    findByUsername: jest.fn().mockResolvedValue(undefined),
    create: jest.fn().mockImplementation((info) => Promise.resolve(info)),
  };

  beforeEach(async () => {
    // set the module
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: userService },
      ],
    }).compile();

    //get the service
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should throw an err of there is a duplicated user by email.', async () => {
      userService.findByEmail.mockImplementation((email: string) =>
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
      userService.findByUsername.mockImplementation((username: string) =>
        Promise.resolve({ username: username } as User),
      );
      try {
        await service.register({ username: 'hoja' } as Register_UserDto);
        expect(true).toBe(false);
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    it('should hash the password', async () => {
      userService.findByEmail.mockResolvedValue(undefined);
      userService.findByUsername.mockResolvedValue(undefined);
      const password = '1234';
      expect(await service.register({ password } as Register_UserDto)).not.toBe(
        password,
      );
    });

    it('should return a registered user', async () => {
      const user = new Register_UserDto();
      user.password = '1234';
      user.email = 'fake@g.com';

      expect(await service.register(user)).toBe(user);
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
