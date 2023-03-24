
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { MonoTypeOperatorFunction, Observable, of, throwError } from 'rxjs';
import { catchError, delay, mergeMap, retryWhen, switchMap, retry } from 'rxjs/operators';
import * as _ from 'lodash';
import { ToasterService } from './toaster.service';
import { environment } from '../../../environments/environment';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class FetcherService {


  readonly payloadMethods: string[] = ['post', 'put'];
  readonly baseUrl = environment.url;
  private requests: object = {};

  constructor(private http: HttpClient,
    private toastr: ToasterService,
    @Inject(DOCUMENT) private document: Document) {
  }

  getToken() {
    return sessionStorage.getItem('token');
  }

  getHeader() {
    const httpOptions = {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
      }
    };

    return httpOptions
  }

  get<R>(url: string, p: any = {}, ids?: any, options: any = {}, needHeader?: boolean): Observable<R> {
    if (ids) {
      Object.keys(ids).forEach(key => {
        url = url.replace(`{${key}}`, ids[key]);
      });
    }
    let params = new HttpParams();
    for (const key of Object.keys(p)) {
      if (p[key] != null) {
        params = params.append(key, p[key]);
      }
    }
    return this.request('get', url, { params, ...options }, null, needHeader, p.timeoutMs);
  }

  post<R>(url: string, data: any, ids?: any, options: any = {}, needHeader?: boolean): Observable<R> {
    if (ids) {
      Object.keys(ids).forEach(key => {
        url = url.replace(`{${key}}`, ids[key]);
      });
    }
    return this.request('post', url, options, data, needHeader, options?.timeoutMs);
  }

  put<R>(url: string, data: any, ids?: any, options: any = {}, needHeader?: boolean): Observable<R> {
    if (ids) {
      Object.keys(ids).forEach(key => {
        url = url.replace(`{${key}}`, ids[key]);
      });
    }
    return this.request('put', url, options, data, needHeader, options?.timeoutMs );
  }

  delete<R>(url: string, ids?: any, options: any = {}, data?: any, needHeader?: boolean): Observable<R> {
    if (ids) {
      Object.keys(ids).forEach(key => {
        url = url.replace(`{${key}}`, ids[key]);
      });
    }
    return this.request('delete', url, options, data, needHeader, options?.timeoutMs);
  }

  createFormData(form) {
    const formData: FormData = new FormData();
    Object.keys(form)
      .forEach((item: string) => {
        if (form[item] !== null && typeof form[item] !== 'undefined') {
          formData.append(item, form[item]);
        }
      });
    return formData;
  }

  private request<R>(method: string, url: string, options: any, data?: any, needHeader: boolean = true, timeoutMs = 1000 * 60 * 5): Observable<R> {
    const key: string = [method, url, options?.params ? options?.params.toString() : 'empty'].join('::');
    let request: Observable<any>;
    if (needHeader) {
      options.headers = this.getHeader().headers;
    }
    if (this.payloadMethods.includes(method)) {
      request = this.http[method](`${this.baseUrl}/${url}`, data, options);
    } else {
      request = this.http[method](`${this.baseUrl}/${url}`, options);
    }
  
    return this.requests[key] = request
      .pipe(
        retryWhen((errors: Observable<any>) => errors.pipe(
          mergeMap(error => {
            if (error.status === 401 && this.document.location.href.indexOf('login') === -1) {
              window.sessionStorage.clear();
              //this.document.location.href = '/';
            } else {
              return throwError(error);
            }
          }
          ))
        ),
        switchMap((response: R) => {
          return of(response);
        }),
        catchError((response: HttpErrorResponse | any) => {
          if (options.noError) {
            return of(response);
          }
          if (options.noToastr) {
            return throwError(response);
          }
          
          if (response.error && typeof response.error === 'object') {
            const errors = Object.values(response.error);
            errors.forEach(err => {
              if (typeof err === 'string') {
               // this.toastr.danger(err, '');
              } else {
                let message = err[0];
                if (message) {
                  try {
                    message = JSON.parse(message.replace(/'/g, '"'));
                  } catch (error) {
                    console.error(error);
                  }
                }
                if (_.isArray(message)) {
                  message = _.join(message, '\n');
                }
              }
            });
          } 
          return throwError(response);
        })
      );
  }

}
