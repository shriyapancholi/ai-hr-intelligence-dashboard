import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../services/api";

export default function Employees() {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        API.get("/employees").then((res) => {
            setEmployees(res.data);
        });
    }, []);

    return (
        <div style={{ display: "flex" }}>
            <Sidebar />

            <div style={{ flex: 1 }}>
                <Navbar />

                <div style={{ padding: 20 }}>
                    <h2>Employees</h2>

                    <table style={{
                        width: "100%",
                        background: "white",
                        borderRadius: 10,
                        padding: 10
                    }}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Department</th>
                                <th>Role</th>
                                <th>Sentiment</th>
                            </tr>
                        </thead>

                        <tbody>
                            {employees.map((emp) => (
                                <tr key={emp._id}>
                                    <td>{emp.name}</td>
                                    <td>{emp.email}</td>
                                    <td>{emp.department}</td>
                                    <td>{emp.role}</td>
                                    <td>{emp.sentimentScore}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}