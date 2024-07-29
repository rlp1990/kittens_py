import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class FormDataInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    if (request.url.includes('/upload_image/') && request.method === 'POST') {
      const apiReq = request.clone({
        setHeaders: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
      });
      return next.handle(apiReq);
    } else if (request.method === 'POST') {
      const apiReq = request.clone({
        headers: request.headers.set('Content-Type', 'application/json'),
        setHeaders: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      return next.handle(apiReq);
    }
    return next.handle(request);
  }
}
