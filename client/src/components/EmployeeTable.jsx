function Employees() {
    return (
        <div>
            <h2>Employees</h2>

            <table style={{ width: "100%", marginTop: "20px" }}>
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
                    <tr>
                        <td>Rahul Sharma</td>
                        <td>rahul@test.com</td>
                        <td>Engineering</td>
                        <td>Software Engineer</td>
                        <td>7</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default Employees;