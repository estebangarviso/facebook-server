import { Module } from '@core/decorators';
import { PostsController } from './controllers/posts.controller';
import { PostsService } from './services/posts.service';

@Module({
	controllers: [PostsController],
	providers: [PostsService]
})
export class PostsModule {}
