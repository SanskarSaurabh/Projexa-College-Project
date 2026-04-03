import { useState } from "react";
import Navbar from "../components/Navbar";
import { searchStudents, deleteStudent } from "../api/AdminStudentApi";
import "./DeleteStudent.css";
import toast from "react-hot-toast";

const DeleteStudent = () => {

  const [name, setName] = useState("");
  const [students, setStudents] = useState([]);

  // ================= SEARCH =================
  const handleSearch = async () => {

    if (!name) {
      toast.error("Please enter student name");
      return;
    }

    try {

      const res = await searchStudents(name);

      console.log("API Response:", res.data); // 🔍 debug

      // ✅ FIXED: correct data extraction
      setStudents(res.data.students);

      if (res.data.students.length === 0) {
        toast("No student found");
      }

    } catch (error) {
      console.log(error);
      toast.error("Search failed");
    }

  };

  // ================= DELETE =================
  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    try {

      await deleteStudent(id);

      // ✅ update UI after delete
      setStudents(prev =>
        prev.filter(student => student._id !== id)
      );

      toast.success("Student deleted successfully");

    } catch (error) {
      console.log(error);
      toast.error("Delete failed");
    }

  };

  return (

    <div className="delete-student-page">

      <Navbar />

      <div className="delete-student-header">
        <h1>Remove Student</h1>
      </div>

      {/* ================= SEARCH FORM ================= */}

      <form
        className="student-search-box"
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >

        <input
          type="text"
          placeholder="Search student by name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button type="submit">
          Search
        </button>

      </form>

      {/* ================= TABLE ================= */}

      {students?.length > 0 && (

        <div className="delete-student-table-card">

          <table className="delete-student-table">

            <thead>
              <tr>
                <th>Student Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {students.map(student => (

                <tr key={student._id}>

                  <td>{student.name}</td>
                  <td>{student.email}</td>

                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(student._id)}
                    >
                      ✕
                    </button>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>

  );

};

export default DeleteStudent;