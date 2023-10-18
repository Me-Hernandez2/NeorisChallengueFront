import {Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {ToastService} from '../../shared/toast/services/toast.service';

@Injectable()
export class HttpInterceptorInterceptor implements HttpInterceptor {
  constructor(private toastService: ToastService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Agrega el encabezado 'authorId' a todas las solicitudes
    const modifiedRequest = request.clone({
      setHeaders: {
        'authorId': environment.idAuthor,
      },
    });

    // Manejo de errores y éxito
    return next.handle(modifiedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        // Si ocurre un error en la solicitud, muestra una notificación de error.
        this.toastService.showToast('Error: ' + error.message);
        return throwError(error);
      }),
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse && event.status === 200) {
          // La solicitud tuvo éxito con un estado 200
          this.toastService.showToast('Solicitud exitosa');
        }
        return event;
      })
    );
  }
}
