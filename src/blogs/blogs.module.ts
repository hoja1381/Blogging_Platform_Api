import { Module } from "@nestjs/common";
import { BlogsController } from "./controller/blogs.controller";
import { BlogsService } from "./service/blogs.service";

@Module({
  controllers: [BlogsController],
  providers: [BlogsService],
})
export class BlogsModule {}
