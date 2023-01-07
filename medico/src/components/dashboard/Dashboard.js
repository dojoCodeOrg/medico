import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth,logout } from "../../firebase";

function Dashboard() {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;
    }, [user, loading]);

    return (
        <>
            <p>Ton profil</p>
            <p>{user.displayName}</p>
        </>
    )
}

export default Dashboard;