import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from '../service/comments.service';
import { BlogsService } from '../../blogs/service/blogs.service';
import { CreateCommentDto } from '../dtos/create_commnt.dto';
import { Blog } from 'src/blogs/blog.entity';
import { User } from 'src/users/user.entity';
import { UpdateCommentDto } from '../dtos/update_comment.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('CommentsController', () => {
  let controller: CommentsController;

  let commentService = {
    create: jest.fn(async (body: CreateCommentDto, blog: Blog, user: User) => {
      return {
        ...body,
        blog: blog,
        user: user,
        date: '2024-01-25T11:56:47.590Z',
      };
    }),
    getAllCommentsOfUser: jest.fn(async (user: User) => {
      return [
        {
          id: 1,
          content: 'test1',
          user: user,
        },
        {
          id: 2,
          content: 'test2',
          user: user,
        },
      ];
    }),
    update: jest.fn(async (id: number, body: UpdateCommentDto) => {
      if (!id || !Object.keys(body).length) return null;

      return {
        id: id,
        ...body,
      };
    }),
    delete: jest.fn((id: number) => {
      return {
        id: id,
        user: { id: 1 },
      };
    }),
  };

  let blogService = {
    getById: jest.fn(async (id: number) => {
      if (!id) return null;
      return {
        id: id,
        title: 'testing',
        content: 'testing',
      };
    }),
  };

  let cacheManager = {
    set: jest.fn(),
    get: jest.fn((key: string) => Promise.resolve({})),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        { provide: CommentsService, useValue: commentService },
        { provide: BlogsService, useValue: blogService },
        { provide: CACHE_MANAGER, useValue: cacheManager },
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('add Comment', () => {
    it('should add a comment and return it.', async () => {
      expect(
        await controller.addComment(
          { content: 'testing', blog_id: 1 } as CreateCommentDto,
          { id: 1, username: 'hoja' } as User,
        ),
      ).toEqual({
        content: 'testing',
        blog_id: 1,
        date: '2024-01-25T11:56:47.590Z',
        blog: {
          id: 1,
          title: 'testing',
          content: 'testing',
        },
        user: { id: 1, username: 'hoja' },
      });
    });

    it('should throw err if there is no Blog found', async () => {
      try {
        await controller.addComment(
          { content: 'testing', blog_id: null } as CreateCommentDto,
          { id: 1, username: 'hoja' } as User,
        );
        expect(true).toBe(false);
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });

  describe('edit Comment', () => {
    it('should update a comment', async () => {
      expect(
        await controller.editComment(
          {
            content: 'testing',
          } as UpdateCommentDto,
          { id: 1, username: 'hoja' } as User,
          1,
        ),
      ).toBeDefined();
    });

    it('should thro exception if id is null', async () => {
      try {
        await controller.editComment(
          {
            content: 'testing',
          } as UpdateCommentDto,
          { id: 1, username: 'hoja' } as User,
          null,
        );
        expect(true).toBe(false);
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    it('should thro exception if body is null', async () => {
      try {
        await controller.editComment(
          null,
          { id: 1, username: 'hoja' } as User,
          1,
        );
        expect(true).toBe(false);
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });

  describe('delete Comment', () => {
    it('should return the deleted comment', async () => {
      expect(
        await controller.deleteComment(1, { id: 1 } as User),
      ).toBeDefined();
    });

    it('should throw err if there is no user', async () => {
      try {
        await controller.deleteComment(1, null);
        expect(true).toBe(false);
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });

  describe('getAllBlogComments', () => {
    it('should throw err if id', async () => {
      try {
        await controller.getAllBlogComments(null);
        expect(true).toBe(false);
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });
});
