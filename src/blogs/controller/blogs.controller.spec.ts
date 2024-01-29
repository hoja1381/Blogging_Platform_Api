import { Test, TestingModule } from '@nestjs/testing';
import { BlogsController } from './blogs.controller';
import { UsersService } from '../../users/service/users.service';
import { BlogsService } from '../service/blogs.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Create_blogDto } from '../dtos/create_blog.dto';
import { User } from 'src/users/user.entity';
import { Update_blogDto } from '../dtos/update_blog.dto';

describe('BlogsController', () => {
  // controller instance
  let controller: BlogsController;

  // mocked services
  let blogService = {
    create: jest.fn((body: Create_blogDto, user: User) => {
      return Promise.resolve({ ...body, user });
    }),

    update: jest.fn((id: number, body: Update_blogDto) => {
      return Promise.resolve({ id, ...body });
    }),

    delete: jest.fn((id: number) => Promise.resolve({ id: 1 })),

    getAll: jest.fn(() => Promise.resolve([{}, {}])),

    getAllByUser: jest.fn((user: User) =>
      Promise.resolve([
        { id: 1, ...user },
        { id: 2, ...user },
      ]),
    ),
  };

  let userService = {
    findById: jest.fn((id: number) => Promise.resolve({ id: id })),
  };

  let cacheManager = {
    set: jest.fn(),
    get: jest.fn((key: string) => Promise.resolve({})),
  };

  beforeEach(async () => {
    // set the module
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogsController],
      providers: [
        { provide: UsersService, useValue: userService },
        { provide: BlogsService, useValue: blogService },
        { provide: CACHE_MANAGER, useValue: cacheManager },
      ],
    }).compile();

    // get the controller
    controller = module.get<BlogsController>(BlogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create Blog', () => {
    it('should return a created defined blog', async () => {
      expect(
        await controller.createBlog(
          {
            title: 'test',
            content: 'testing',
            tags: 'jest',
          } as Create_blogDto,
          { id: 1 } as User,
        ),
      ).toBeDefined();
    });
  });

  describe('update Blog', () => {
    it('should return a defined updated Blog.', async () => {
      expect(
        await controller.updateBlog(
          {
            title: 'test',
            content: 'testing',
            tags: 'jest',
          } as Update_blogDto,
          1,
          { id: 1 } as User,
        ),
      ).toBeDefined();
    });

    it('should throw forbidden exception if the blog id is not natch the user.', async () => {
      try {
        await controller.updateBlog(
          {
            title: 'test',
            content: 'testing',
            tags: 'jest',
          } as Update_blogDto,
          1,
          { id: 1 } as User,
        );
        expect(true).toBe(false);
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });

  describe('delete Blog', () => {
    it('should return a defined deleted Blog.', async () => {
      expect(controller.deleteBlog(1, { id: 1 } as User)).toBeDefined();
    });

    it('should throw forbidden exception if the blog id is not natch the user.', async () => {
      try {
        await controller.deleteBlog(4, { id: 1 } as User);
        expect(true).toBe(false);
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });

  describe('get  Blogs', () => {
    it('should return all Blogs.', async () => {
      expect(await controller.getAllBlogs(10, 0)).toBeDefined();
    });

    it('should return one User Blogs.', async () => {
      expect(
        await controller.getAllBlogsOfUser({ id: 1 } as User),
      ).toBeDefined();
    });

    it('should return one user Blogs with the given id.', async () => {
      expect(await controller.getUsersBlogsByAdmin(1)).toBeDefined();
    });

    it('should return a blog with given id.', async () => {
      expect(await controller.getBlogById(1)).toBeDefined();
    });
  });
});
