import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth,logout } from "../../firebase";

function Dashboard() {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();
    const [photo, setPhoto] = useState();
    const [name, setName] = useState("");

    let username = null;
    let userid = null;
    try {
        userid = window.location.href.split('#')[1];
        username = window.location.href.split('?')[1].split('#')[0].split('%20').join(' ');
    } catch (err) {
        console.log(err);
    }

    // fetch username by uid
    const fetchUserInfo = async () => {
        try {
            setName(user.displayName);
            setPhoto(user.photoURL);
        } catch (err) {
            console.error(err);
        }
    }; 

    useEffect(() => {
        if (loading) return;
        if (!user) navigate("/sign");
        
        fetchUserInfo();

    }, [user, loading]);

    return (
        <>  
            <img referrerpolicy="no-referrer" src={photo} alt='Photo' />
            <p>{username}</p>
            <button onClick={logout}>se deconnecter</button>
        </>
    )
}

export default Dashboard;