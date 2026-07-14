import { Navigate, Outlet } from "react-router-dom";

const JudgeProtectedRoute = () => {
    const token = localStorage.getItem("judgeToken");
    if (!token) {
        return <Navigate to="/judge/login" replace />;
    }
    return <Outlet />;
};

export default JudgeProtectedRoute;
