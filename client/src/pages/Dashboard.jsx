import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Dashboard() {
    return (
        <div style={{ display: "flex" }}>
            <Sidebar />

            <div style={{ flex: 1 }}>
                <Navbar />

                <div style={{ padding: 20 }}>
                    <h2>Dashboard</h2>

                    <div style={{ display: "flex", gap: 20 }}>
                        <div style={{
                            background: "white",
                            padding: 20,
                            borderRadius: 10,
                            boxShadow: "0 0 10px rgba(0,0,0,0.1)"
                        }}>
                            <h3>Total Employees</h3>
                            <h2>10</h2>
                        </div>

                        <div style={{
                            background: "white",
                            padding: 20,
                            borderRadius: 10,
                            boxShadow: "0 0 10px rgba(0,0,0,0.1)"
                        }}>
                            <h3>Avg Sentiment</h3>
                            <h2>7.2</h2>
                        </div>

                        <div style={{
                            background: "white",
                            padding: 20,
                            borderRadius: 10,
                            boxShadow: "0 0 10px rgba(0,0,0,0.1)"
                        }}>
                            <h3>Meetings</h3>
                            <h2>5</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}