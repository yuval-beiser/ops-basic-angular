export enum Api {

  //autentication api
  autentication = 'authenticate',
  userDetails = 'user/details',


  //students api
  students = 'students',
  studentHighSat = 'students/highSat',
  modifyStudent = 'students/{id}',
  updateStudent = 'students/{id}',
  updateStudentImage = 'students/{id}/image',
  studentSendSmsAll = 'students/sms/all',
  studentSendSms = 'students/sms/byIds',
  studentSendEmail = 'students/email/byIds',

  //students-grades api
  insertStudentGrade = 'students/{studentId}/grades?studentId={id}',
  modifyStudentGrade = 'students/{studentId}/grades/{id}'
}
