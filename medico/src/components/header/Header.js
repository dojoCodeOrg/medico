import React, { useEffect, useState } from "react";
import { auth,db,stopNetworkAcces } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, getDocs, where, doc } from "firebase/firestore";


function Header() {
    const [isLoading, setIsLoading] = useState(false);
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();
    const [photo, setPhoto] = useState();
    const [name, setName] = useState("");
    const [userid, setUid] = useState("");
    const [type, setType] = useState('')

    
     // fetch username by uid
     const fetchUserInfo = async () => {
        try {
            setUid(user.uid)
            setName(user.displayName);
            setPhoto(user.photoURL);

            const q = query(collection(db, "users"), where("uid", "==", user?.uid));
            const doc = await getDocs(q);
            const data = doc.docs[0].data();          
            setType(data.type);
            
        } catch (err) {
            const qs = query(collection(db, "pharmacies"), where("uid", "==", user?.uid));
            const docs = await getDocs(qs);
            const datas = docs.docs[0].data();
            // console.error(err);
            setType(datas.type);
        }
    }; 


    function switchToDashboardAsUser() {
        window.location.href = `/user?${name}`
    }
    function switchToDashboardAsPharmacie() {
        window.location.href = `/pharmacie?${name}`
    }

    useEffect(() => {
        if (loading) return;        
        fetchUserInfo();
    }, [user, loading]);


    if (type === 'user') {
        return (
            <>
            <button onClick={switchToDashboardAsUser}>profil</button>                
            </>
        )        
    } else if (type === 'pharmacie') {
        return (
            <>    
            <button onClick={switchToDashboardAsPharmacie}>profil</button>    
            </>
        )   
    }
}

export default Header;