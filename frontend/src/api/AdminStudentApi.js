import API from "./Axios";

/* SEARCH STUDENTS */

export const searchStudents = (name) =>
  API.get(`/admin/search-students?name=${name}`);

/* DELETE STUDENT */

export const deleteStudent = (id) =>
  API.delete(`/admin/delete-student/${id}`);