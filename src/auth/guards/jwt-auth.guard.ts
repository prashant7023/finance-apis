import {
	ExecutionContext,
	Injectable,
	Logger,
	UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RequestUser } from '../../common/types/jwt-payload.type';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	private readonly logger = new Logger(JwtAuthGuard.name);

	handleRequest<TUser = RequestUser>(
		err: unknown,
		user: TUser,
		info: unknown,
		context: ExecutionContext,
	): TUser {
		if (err) {
			this.logger.warn(`JWT auth error: ${this.stringifyInfo(err)}`);
			throw err;
		}

		if (!user) {
			const message = this.extractInfoMessage(info) ?? 'Missing or invalid Bearer token';
			this.logger.warn(`Unauthorized request: ${message}`);
			throw new UnauthorizedException(message);
		}

		return user;
	}

	private extractInfoMessage(info: unknown): string | null {
		if (
			typeof info === 'object' &&
			info !== null &&
			'message' in info &&
			typeof (info as { message: unknown }).message === 'string'
		) {
			return (info as { message: string }).message;
		}

		return null;
	}

	private stringifyInfo(value: unknown): string {
		if (value instanceof Error) {
			return value.message;
		}

		return typeof value === 'string' ? value : JSON.stringify(value);
	}
}
