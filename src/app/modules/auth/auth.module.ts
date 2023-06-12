import { Module } from '@core/decorators';
import { AuthController } from './controllers/auth.controller';
import { UserService } from './services/user.service';
import { JwtService } from './services/jwt.service';
import { RedisProvider } from './../../providers/redis';

@Module({
	imports: [RedisProvider],
	controllers: [AuthController],
	providers: [UserService, JwtService]
})
export class AuthModule {}
