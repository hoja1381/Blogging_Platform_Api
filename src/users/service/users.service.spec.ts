import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Register_UserDto } from '../dtos/register_user.dto';

describe('UsersService', () => {
  // service instance
  let service: UsersService;

  //mocked repo
  let repo = {
    create: jest.fn((user) => Promise.resolve(user)),
    save: jest.fn((user) => Promise.resolve(user)),
    update: jest.fn((user) => Promise.resolve(user)),
    findOne: jest.fn((id) => Promise.resolve({ id: id } as User)),
    remove: jest.fn((user) => Promise.resolve(user)),
  };

  beforeEach(async () => {
    // set the module
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: repo },
      ],
    }).compile();

    //get the service
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should save the user to DB and return it.', async () => {
      expect(
        await service.create({ email: 'hoja@g.com' } as Register_UserDto),
      ).toBeDefined();
    });
  });

  describe('update', () => {
    it('should update the user from DB and return it.', async () => {
      expect(
        await service.update(1, { email: 'hoja@g.com' } as Register_UserDto),
      ).toBeDefined();
    });

    it('should return null if the id is null.', async () => {
      expect(
        await service.update(null, { email: 'hoja@g.com' } as Register_UserDto),
      ).toBeNull();
    });

    it('should return null if the dto is empty.', async () => {
      expect(await service.update(1, {} as Register_UserDto)).toBeNull();
    });

    it('should throw exception if the user is  not found', async () => {
      repo.findOne.mockImplementation((id) => null);
      try {
        await service.update(1, { email: 'hoja@g.com' } as Register_UserDto);
        expect(true).toBe(false);
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });

  describe('delete', () => {
    it('should delete the user from DB and return it.', async () => {
      try {
        await service.delete(15);
        expect(true).toBe(false);
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    it('should return null if the id is null.', async () => {
      expect(await service.delete(null)).toBeNull();
    });
  });

  describe('find methods', () => {
    it('should return null if the id is null', async () => {
      expect(await service.findById(null)).toBeNull();
    });
    it('should return null if the email is null', async () => {
      expect(await service.findByEmail(null)).toBeNull();
    });
    it('should return null if the username is null', async () => {
      expect(await service.findByUsername(null)).toBeNull();
    });
  });
});
