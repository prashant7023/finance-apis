import {
	ExecutionContext,
	ForbiddenException,
	Injectable,
	Logger,
	UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RequestUser } from '../../common/types/jwt-payload.type';

type RequestHeaders = {
	referer?: string;
	'x-user-id'?: string | string[];
};

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

		const request = context.switchToHttp().getRequest<{ headers: RequestHeaders }>();
		const referer = request.headers.referer ?? '';

		// Enforce token-user binding only for calls made from Swagger UI.
		if (referer.includes('/docs')) {
			const rawUserId = request.headers['x-user-id'];
			const headerUserId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;
			const tokenUserId = this.extractUserId(user);

			if (!headerUserId || !tokenUserId || headerUserId !== tokenUserId) {
				this.logger.warn(
					`Swagger user binding failed. header x-user-id=${headerUserId ?? 'none'} token sub=${tokenUserId ?? 'none'}`,
				);
				throw new ForbiddenException(
					'For Swagger UI requests, x-user-id must be provided and match token user id.',
				);
			}
		}

		return user;
	}

	private extractUserId(user: unknown): string | null {
		if (
			typeof user === 'object' &&
			user !== null &&
			'id' in user &&
			typeof (user as { id: unknown }).id === 'string'
		) {
			return (user as { id: string }).id;
		}

		return null;
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
