import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [batch, setBatch] = useState("");
  const [date, setDate] = useState("");
  const [filterBatch, setFilterBatch] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("attendance"));
    if (saved) setStudents(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "attendance",
      JSON.stringify(students)
    );
  }, [students]);

  const addAttendance = () => {
    if (!name || !batch || !date) {
      alert("Fill all fields");
      return;
    }

    const newRecord = {
      id: Date.now(),
      name,
      batch,
      date,
      status: "Present",
    };

    setStudents([...students, newRecord]);

    setName("");
    setBatch("");
    setDate("");
  };

  const updateStatus = (id, status) => {
    setStudents(
      students.map((student) =>
        student.id === id
          ? { ...student, status }
          : student
      )
    );
  };

  const deleteRecord = (id) => {
    setStudents(
      students.filter(
        (student) => student.id !== id
      )
    );
  };

  const filteredData =
    filterBatch === ""
      ? students
      : students.filter(
          (student) =>
            student.batch === filterBatch
        );

  const presentCount = students.filter(
    (s) => s.status === "Present"
  ).length;

  const absentCount = students.filter(
    (s) => s.status === "Absent"
  ).length;

  const attendancePercentage =
    students.length > 0
      ? (
          (presentCount /
            students.length) *
          100
        ).toFixed(2)
      : 0;

  return (
    <div className="container">
      <h1><u>Trainer Attendance Dashboard</u></h1>

      <div className="form">
        <input
          type="text"
          placeholder="Student Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Batch"
          value={batch}
          onChange={(e) =>
            setBatch(e.target.value)
          }
        />

        <input
          type="date"
          value={date}
          onChange={(e) =>
            setDate(e.target.value)
          }
        />

        <button onClick={addAttendance}>
          Add Attendance
        </button>
      </div>

      <div className="dashboard">
        <div className="card">
          Total Records
          <h2>{students.length}</h2>
        </div>

        <div className="card">
          Present✅
          <h2>{presentCount}</h2>
        </div>

        <div className="card">
          Absent❌
          <h2>{absentCount}</h2>
        </div>

        <div className="card">
          Attendance %
          <h2>{attendancePercentage}%</h2>
        </div>
      </div>

      <div className="filter">
        <select
          onChange={(e) =>
            setFilterBatch(e.target.value)
          }
        >
          <option value="">
            All Batches
          </option>

          {[...new Set(
            students.map(
              (s) => s.batch
            )
          )].map((batch) => (
            <option
              key={batch}
              value={batch}
            >
              {batch}
            </option>
          ))}
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Batch</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredData.map(
            (student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.batch}</td>
                <td>{student.date}</td>

                <td>
                  <select
                    value={
                      student.status
                    }
                    onChange={(e) =>
                      updateStatus(
                        student.id,
                        e.target.value
                      )
                    }
                  >
                    <option>
                      Present
                    </option>
                    <option>
                      Absent
                    </option>
                  </select>
                </td>

                <td>
                  <button
                    className="delete"
                    onClick={() =>
                      deleteRecord(
                        student.id
                      )
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;