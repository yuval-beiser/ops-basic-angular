import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SafeHtml } from '@angular/platform-browser';

export enum ToasterStatus {
    INFO = 'status-info',
    ERROR = 'status-danger',
    SUCCESS = 'status-success',
    WARNING = 'status-warning'
}

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

    constructor(private toastr: ToastrService) {
    }

    info(message: string | SafeHtml, title?: string, isHtmlBody?: boolean): void {
        this.showToaster(message, title, ToasterStatus.INFO, isHtmlBody);
    }

    danger(message: string | SafeHtml, title?: string, isHtmlBody?: boolean): void {
        this.showToaster(message, title, ToasterStatus.ERROR, isHtmlBody);
    }

    success(message: string | SafeHtml, title?: string, isHtmlBody?: boolean): void {
        this.showToaster(message, title, ToasterStatus.SUCCESS, isHtmlBody);
    }

    warning(message: string | SafeHtml, title?: string, isHtmlBody?: boolean): void {
        this.showToaster(message, title, ToasterStatus.WARNING, isHtmlBody);
    }

    private showToaster(message: string | SafeHtml, title: string, status: ToasterStatus, isHtmlBody?: boolean): void {
        const toaster = this.toastr.show('', '', {
            positionClass: 'toast-bottom-left',
            //tapToDismiss: true,
           // timeOut: 5000,
        });

        toaster.portal.instance.data = {
            title,
            message,
            status,
            isHtmlBody
        };
    }

}
