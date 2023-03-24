import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IStudent } from '../models/student';
import { FetcherService } from '../@core/services/fetcher.service';
import { Api } from '../@core/models/api.enum';
import { IGrade } from '../models/grade';

//After that we write all methods related to consume web in client.service.ts 
@Injectable({
    providedIn: 'root'
})
export class StudentGradeService {
  
  constructor(private http: HttpClient,
    private featcher: FetcherService) { }

  insertStudentGrade(studentId: number, data: IGrade): Observable<any> {
    return this.featcher.post<any>(Api.insertStudentGrade, { courseName: data.courseName, courseScore: data.courseScore}, { id:studentId})
  }

  deleteStudentGrade(studentId: number, id: number): Observable<any> {
    return this.featcher.delete<any>(Api.modifyStudentGrade, { studentId, id })
  }

  updateStudentGrade(studentId: number, id: number, data: IGrade): Observable<any> {
    return this.featcher.put<any>(Api.modifyStudentGrade, { courseName: data.courseName, courseScore: data.courseScore }, { studentId, id  })
  }


}
