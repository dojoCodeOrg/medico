import React, { useEffect, useState } from "react";
import { auth,db,stopNetworkAcces } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, getDocs, where, doc } from "firebase/firestore";
import Header from "../header/Header";
import Footer from "../footer/Footer";

import "./home.css";
import map from "../../assets/images/map.svg";
import para from "../../assets/images/para.svg";
import medocs from "../../assets/images/medocs.svg";

import LoadingSpinner from "../loadSpinner/LoadingSpinner";

function PharmacieHome() {
    const [isLoading, setIsLoading] = useState(false);
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();
    const [photo, setPhoto] = useState();
    const [name, setName] = useState("");
    const [userid, setUid] = useState("");
    const [type, setType] = useState("");


    // fetch username by uid
    const fetchUserInfo = async () => {                
            try {
                setUid(user.uid)
                setName(user.displayName);
                setPhoto(user.photoURL);
                const qs = query(collection(db, "pharmacies"), where("uid", "==", user?.uid));
                const docs = await getDocs(qs);
                const datas = docs.docs[0].data();
                setType(datas.type);
            } catch (error) {
                console.log(error)
            }       
    }; 
 

    function switchToProximite() {
        window.location.href = `/proximite`;
    }
    function switchToMedicaments() {
        window.location.href = `/medicaments`;        
    }
    function switchToPharmacieProfile() {
        window.location.href = `/pharmacie?${name}#${user?.uid}`;        
    }

    useEffect(() => {
        if (loading) return;        
        if (!user) navigate("/sign");

        fetchUserInfo();   
    }, [user, loading]);

     
        return (
            <>
                <div className="home-client">
                    <br></br><br></br><br></br><br></br><br></br><br></br><br></br>
                    <p className="client-hp">Bienvenue sur Pharma Home Pharnacie {name}</p>
                    <button onClick={switchToPharmacieProfile} className="gard-button">Aller vers le Profil</button>
                    <br></br><br></br><br></br><br></br><br></br><br></br>
                </div>
            </>
        )   
    
}

export default PharmacieHome;