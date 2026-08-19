import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

/**
 * Guard que protege todos los endpoints con una API key.
 * La key debe enviarse en el header: x-api-key: <valor>
 * Configurar la variable de entorno API_KEY en el servidor.
 */
@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ headers: Record<string, string | string[] | undefined> }>();
    const apiKey = request.headers['x-api-key'];
    const expectedKey = process.env.API_KEY;

    if (!expectedKey) {
      // Si no hay API_KEY configurada (ej: desarrollo sin .env),
      // permitir el acceso para no bloquear el entorno local.
      return true;
    }

    if (!apiKey || apiKey !== expectedKey) {
      throw new UnauthorizedException('Invalid or missing API key');
    }

    return true;
  }
}
