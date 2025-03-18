import { useEffect, useState } from "react";
import supabase from "../../../config/supabaseClient";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Tooltip, Cell } from "recharts";
import "./index.css";

const AdminDashboard = () => {
    const [adminUser, setAdminUser] = useState(null);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [questionCategories, setQuestionCategories] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdminUser = async () => {
            const ur = localStorage.getItem("role");
            const { data, error } = await supabase.auth.getSession();
            if (error) {
                console.error("Error fetching admin user:", error.message);
                navigate("/login");
            } else {
                const user = data?.session?.user || null;
                if (ur !== "admin") {
                    console.warn("Access denied: User is not an admin.");
                    navigate("/");
                } else {
                    setAdminUser(user);
                }
            }
        };

        const fetchStats = async () => {
            const { count: usersCount } = await supabase.from("users").select("id", { count: "exact" });
            setTotalUsers(usersCount || 0);

            const { count: questionsCount } = await supabase.from("questions").select("id", { count: "exact" });
            setTotalQuestions(questionsCount || 0);

            const { data: revenueData } = await supabase.from("transactions").select("amount");
            const total = revenueData ? revenueData.reduce((acc, t) => acc + t.amount, 0) : 0;
            setTotalRevenue(total);

            const { data: categoryData } = await supabase.from("question_subcategory").select("category_name");
            setQuestionCategories(categoryData || []);
        };

        fetchAdminUser();
        fetchStats();
    }, [navigate]);

    const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            {adminUser && <p>Welcome, Admin {adminUser.email}</p>}

            <div className="stats-container">
                <div className="stats-box">
                    <h2>Total Users</h2>
                    <p>{totalUsers}</p>
                </div>

                <div className="stats-box">
                    <h2>Question Categories</h2>
                    <ul>
                        {questionCategories.map((cat, index) => (
                            <li key={index}>{cat.category_name}</li>
                        ))}
                    </ul>
                </div>

                <div className="stats-box">
                    <h2>Total Questions</h2>
                    <p>{totalQuestions}</p>
                </div>

                <div className="stats-box">
                    <h2>Total Revenue</h2>
                    <p>RM {totalRevenue.toFixed(2)}</p>
                </div>
            </div>

            <div className="chart-container">
                <h2>Question Categories Distribution</h2>
                <PieChart width={300} height={300}>
                    <Pie
                        data={questionCategories.map((cat, index) => ({
                            name: cat.category_name,
                            value: 1,
                        }))}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label
                    >
                        {questionCategories.map((_, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </div>
        </div>
    );
};

export default AdminDashboard;
