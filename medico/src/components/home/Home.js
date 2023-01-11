import React, { useEffect, useState } from "react";
import { auth,db,stopNetworkAcces } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, getDocs, where, doc } from "firebase/firestore";


function Home() {
    const [isLoading, setIsLoading] = useState(false);
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();
    const [photo, setPhoto] = useState();
    const [name, setName] = useState("");
    const [userid, setUid] = useState("");


    // fetch username by uid
    const fetchUserInfo = async () => {
        try {
            setUid(user.uid)
            setName(user.displayName);
            setPhoto(user.photoURL);
        } catch (err) {
            console.error(err);
        }
    }; 


    function switchToDashboard() {
        window.location.href = `/user?${name}`
    }

    useEffect(() => {
        if (loading) return;        
        if (!user) navigate("/sign");
        fetchUserInfo();
    }, [user, loading]);

    return (
        <>

        <div>Bienvenue sur Medico {name}</div>
        <button onClick={switchToDashboard}>profil</button>

        </>
    )
}

export default Home;