import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { Blog } from '../../blogs/blog.entity';
import { User } from '../../users/user.entity';
import { CreateCommentDto } from '../dtos/create_commnt.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Comment } from '../comments.entity';
import { UpdateCommentDto } from '../dtos/update_comment.dto';

describe('CommentsService', () => {
  // Service instance
  let service: CommentsService;

  // mocked repo
  let repo = {
    create: jest.fn((body) => body),

    save: jest.fn(async (comment) => {
      return Promise.resolve({ id: 1, ...comment });
    }),

    findOne: jest.fn(async ({ where: { id: id } }) => {
      const comment = new Comment();
      comment.id = id;
      return Promise.resolve(comment);
    }),

    update: jest.fn((id, body) => {
      return Promise.resolve({
        id,
        ...body,
      });
    }),

    remove: jest.fn(async (id) => {
      return Promise.resolve(id);
    }),

    find: jest.fn(async (any) => {
      return Promise.resolve();
    }),
  };

  beforeEach(async () => {
    // set the module
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        { provide: getRepositoryToken(Comment), useValue: repo },
      ],
    }).compile();

    // get the service
    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createComment', () => {
    it('should return the created comment.', async () => {
      const dto = new CreateCommentDto();
      dto.content = 'good blog';

      const blog = new Blog();
      blog.id = 1;
      blog.content = 'blog';
      blog.publishDate = new Date();
      blog.tags = 'code';
      blog.title = 'coding blog';

      const user = new User();
      user.id = 1;
      user.email = 'h.@gmail.com';
      user.username = 'hoja';
      user.fullName = 'hossein';

      expect(await service.create(dto, blog, user)).toEqual({
        id: 1,
        ...dto,
        blog,
        user,
      });
    });
  });

  describe('updateComment', () => {
    it('should edit the comment.', async () => {
      const id = 1;

      const body = new UpdateCommentDto();
      body.content = 'better blog';

      expect(await service.update(id, body)).toEqual({ id: 1 });
    });

    it('should return null for null id or empty Body.', async () => {
      expect(await service.update(null, {} as UpdateCommentDto)).toBeNull;
    });

    it('should throw an error if there is no comment with that id.', () => {
      repo.findOne.mockImplementation(async ({ where: { id: id } }) => {
        return Promise.resolve(null);
      });

      expect(service.update(1, {} as UpdateCommentDto)).toThrow;
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment.', async () => {
      repo.findOne.mockImplementation(async ({ where: { id: id } }) => {
        return Promise.resolve({ id: id } as Comment);
      });
      let id = 1;
      expect(await service.delete(id)).toEqual({ id: id });
    });

    it('should throw err if there is no Comment with the given id.', async () => {
      let id;
      expect(await service.delete(id)).toThrow;
    });
  });

  describe('getCommentById', () => {
    it('should return the Comment.', async () => {
      let id = 1;
      expect(await service.getById(id)).toEqual({ id: id });
    });
  });
});
