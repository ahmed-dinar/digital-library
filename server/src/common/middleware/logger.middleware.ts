import {Injectable, Logger, NestMiddleware} from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: any, response: any, next: any): void {
    const {ip, method, originalUrl, body} = request;
    const userAgent = request.get('user-agent') || '';

    response.on('finish', () => {
      const {statusCode} = response;
      const contentLength = response.get('content-length');

      let requestData = null;

      if (body && body instanceof Object) {
        try {
          requestData = JSON.stringify(body);
        } catch (ignore: any) {
        }
      }

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip} ${requestData ? ' Body: ' + requestData : ''}`,
      );
    });

    next();
  }
}
