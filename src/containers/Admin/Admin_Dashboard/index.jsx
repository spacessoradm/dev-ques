import { useEffect, useState } from "react";
import supabase from "../../../config/supabaseClient";
import { useNavigate } from "react-router-dom";
import "./index.css";

const AdminDashboard = () => {
    const [userRole, setUserRole] = useState(null);
    const [adminUser, setAdminUser] = useState(null);
    const navigate = useNavigate();

    // Fetch admin user and dropdown data
    useEffect(() => {

        const fetchAdminUser = async () => {
            const ur = localStorage.getItem('role');
            const { data, error } = await supabase.auth.getSession();
            if (error) {
                console.error("Error fetching admin user:", error.message);
                navigate("/login");
            } else {
                const user = data?.session?.user || null;// Replace with dynamic role fetching
                if (ur !== "admin") {
                    console.log("im here, i not admin");
                    console.warn("Access denied: User is not an admin.");
                    navigate("/");
                } else {
                    console.log("im here, i am admin and set user");
                    setAdminUser(user);
                }
            }
        };

        fetchAdminUser();
    }, [navigate]);

    return (
        <div className="admin-dashboard">
            <div className="admin-content">
                <h1>Admin Dashboard</h1>
                {adminUser && <p>Welcome, Admin {adminUser.email}</p>}
                <button
                    className="sign-out-btn"
                    onClick={async () => {
                        await supabase.auth.signOut();
                        localStorage.clear();
                        setTimeout(() => {
                            window.location.reload();
                        }, 100);
                        navigate("/login");
                    }}
                >
                    Sign Out
                </button>
            </div>

            {/* Statistics Boxes */}
            <div className="stats-container">
                <div className="stats-box">
                </div>
                <div className="stats-box">
                </div>
                <div className="stats-box">
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
