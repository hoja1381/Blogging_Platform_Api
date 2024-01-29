import { Test, TestingModule } from '@nestjs/testing';
import { BlogsService } from './blogs.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Blog } from '../blog.entity';
import { Create_blogDto } from '../dtos/create_blog.dto';
import { User } from 'src/users/user.entity';

describe('BlogsService', () => {
  let service: BlogsService;

  let repo = {
    findOne: jest.fn(),
    create: jest.fn((body) => Promise.resolve({ ...body } as Blog)),
    save: jest.fn((body) => Promise.resolve({ ...body } as Blog)),
    remove: jest.fn((body) => Promise.resolve({ ...body } as Blog)),
    update: jest.fn((body) => Promise.resolve({ ...body } as Blog)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogsService,
        { provide: getRepositoryToken(Blog), useValue: repo },
      ],
    }).compile();

    service = module.get<BlogsService>(BlogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('create a Blog in a dataBase.', async () => {
      expect(
        await service.create({} as Create_blogDto, {} as User),
      ).toBeDefined();
    });

    it('throw an err if there is record with the same title', async () => {
      repo.findOne.mockImplementation((id) =>
        Promise.resolve({ id: id } as Blog),
      );
      try {
        await service.create({} as Create_blogDto, {} as User);
        expect(true).toBe(false);
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });

  describe('update', () => {
    it('update a Blog in a dataBase.', async () => {
      expect(await service.update(1, {} as Create_blogDto)).toBeDefined();
    });

    it('throw an err if there is record with the same title', async () => {
      repo.findOne.mockImplementation((id) =>
        Promise.resolve({ id: id } as Blog),
      );
      try {
        await service.update(1, {} as Create_blogDto);
        expect(true).toBe(false);
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });

  describe('delete', () => {
    it('delete a Blog in a dataBase.', async () => {
      expect(await service.delete(1)).toBeDefined();
    });

    it('throw an err if there is no record with the same title', async () => {
      repo.findOne.mockImplementation((id) =>
        Promise.resolve({ id: id } as Blog),
      );
      try {
        await service.delete(1);
        expect(true).toBe(false);
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });

  describe('getById', () => {
    it('returns Null if the id is null.', async () => {
      expect(await service.getById(null)).toBeNull();
    });
  });
});
