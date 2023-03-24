import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IStudent } from '../models/student';
import { FetcherService } from '../@core/services/fetcher.service';
import { Api } from '../@core/models/api.enum';

//After that we write all methods related to consume web in client.service.ts 
@Injectable({
    providedIn: 'root'
})
export class StudentService {

  terms?: string = "";
  constructor(private http: HttpClient,
    private featcher: FetcherService) { }

  setTerms(terms?: string) {
    this.terms = terms;
  }

  getTerms() {
    return this.terms;
  }

  getStudents(data: any): Observable<any> {
    return this.featcher.get(Api.students, data)
  }

  insertStudent(student: IStudent): Observable<any> {
    return this.featcher.post<any>(Api.students, { student })
  }

  getHighSatStudents(sat: number): Observable<any> {
    return this.featcher.get(Api.studentHighSat, { sat })
  }

  sendSmsToAll(text: string): Observable<any> {
    let url = `${Api.studentSendSmsAll}?text=${text}`
    return this.featcher.post<any>(url, {}, {}, { noToastr: true })
  }

  sendSms(text: string, ids: number[]): Observable<any> {
    let params = "";
    for (let i = 0; i < ids.length; i++) {
      params += `&ids=${ids[i]}`;
    }
    let url = `${Api.studentSendSms}?text=${text}${params}`
    return this.featcher.post<any>(url, {}, {}, { noToastr: true })
  }

  sendEmail(subject: string, text: string, ids: number[]): Observable<any> {
    let params = "";
    for (let i = 0; i < ids.length; i++) {
      params += `&ids=${ids[i]}`;
    }
    let url = `${Api.studentSendEmail}?subject=${subject}&text=${text}${params}`
    return this.featcher.post<any>(url, {}, {}, { noToastr: true })
  }

  deleteStudent(id: number): Observable<any> {
    return this.featcher.delete<any>(Api.modifyStudent, { id })
  }

  getStudent(id: number): Observable<any> {
    return this.featcher.get<any>(Api.modifyStudent, {}, { id })
  }

  updateStudent(_student: IStudent): Observable<any> {
    return this.featcher.put<any>(Api.updateStudent, {
      fullname: _student.fullname || "",
      birthDate: _student.birthDate || "",
      satScore: +_student.satScore,
      graduationScore: +_student.graduationScore,
      phone: _student.phone || "",
      email: _student.email || "" }, { id: _student.id })
  }

  updateStudentImage(id: number, image: File): Observable<any> {
    const data = { image };
    const formData = this.featcher.createFormData(data);
    return this.featcher.put<any>(Api.updateStudentImage, formData, { id })
  }


}
