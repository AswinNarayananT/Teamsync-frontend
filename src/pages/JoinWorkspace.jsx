import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";

const JoinWorkspace = () => {
    const { token } = useParams(); 
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user); 
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        if (user) {
            joinWorkspace(token);
        } else {
            localStorage.setItem("invite_token", token);
            navigate("/login");
        }
    }, [token, user, navigate]);

    const joinWorkspace = async (token) => {
        try {
            const response = await api.post(
                "api/v1/workspace/accept-invite/",
                { token }
            );
            toast.success("Successfully joined the workspace!");
            localStorage.removeItem("invite_token"); 
            navigate("/dashboard"); 
        } catch (error) {
            toast.error(error.response?.data?.error || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            {loading ? <ClipLoader size={50} color="#4A90E2" /> : null}
        </div>
    );
};

export default JoinWorkspace;
