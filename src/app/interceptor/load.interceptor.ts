import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadService } from '../services/load.service';

@Injectable()
export class LoadInterceptor implements HttpInterceptor {
  private count = 0;
  constructor(private loadService: LoadService) {}

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.count === 0) {
      this.loadService.setHttpProgressStatus(true);
    }
    this.count++;

    return next.handle(request).pipe(
      finalize(() => {
        this.count--;
        if (this.count === 0) {
          this.loadService.setHttpProgressStatus(false);
        }
      })
    );
  }
}
