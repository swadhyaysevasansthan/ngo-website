import { Navigate, Outlet } from "react-router-dom";

const JudgePublicRoute = () => {
    const token = localStorage.getItem("judgeToken");
    if (token) {
        return <Navigate to="/judge/dashboard" replace />;
    }
    return <Outlet />;
};

export default JudgePublicRoute;
