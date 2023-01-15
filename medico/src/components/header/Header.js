import React, { useEffect, useState } from "react";
import { auth,db,stopNetworkAcces } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, getDocs, where, doc } from "firebase/firestore";

import "./header.css";

function Header() {
    const [isLoading, setIsLoading] = useState(false);
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();
    const [photo, setPhoto] = useState();
    const [name, setName] = useState("");
    const [userid, setUid] = useState("");
    const [type, setType] = useState('user');

    
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
            try {
                const qs = query(collection(db, "pharmacies"), where("uid", "==", user?.uid));
                const docs = await getDocs(qs);
                const datas = docs.docs[0].data();
                // console.error(err);
                setType(datas.type);
            } catch (error) {
                console.log(error)
            }
            console.log(err);
        }
    }; 


    function switchToDashboardAsUser() {
        window.location.href = `/user?${name}`
    }
    function switchToDashboardAsPharmacie() {
        window.location.href = `/pharmacie?${name}`
    }
    function switchToHome() {
        window.location.href = `/`;
    }
    function switchToSign() {
        window.location.href = `/sign`;
    }

    useEffect(() => {
        if (loading) return;        
        fetchUserInfo();
    }, [user, loading]);

    if (!user) {
        <>
            <header>
                <section id="logo">
                    <h3 onClick={switchToHome} id="medico">Medico</h3>
                </section>
                <section id="header-btn">
                    <button onClick={switchToSign} type="button" class="btn-primary-header" id="login-btn">Se connecter</button>
                </section>
            </header>
            <hr className="hr-header"></hr>
        </>
    } else {
        if (type === 'user') {
            return (
                <>
                    <header>                   
                        <section id="logo">
                            <h3 onClick={switchToHome} id="medico">Medico</h3>
                        </section>
                        <section id="img-btn">
                            <img id="user-img" onClick={switchToDashboardAsUser} src={photo} />
                        </section>
                    </header>                                     
                    <hr className="hr-header"></hr>
                </>
            )        
        } else if (type === 'pharmacie') {
            return (
                <>    
                    <header>                   
                            <section id="logo">
                                <h3 onClick={switchToHome} id="medico">Medico</h3>
                            </section>
                            <section id="img-btn">
                                <img id="user-img" onClick={switchToDashboardAsPharmacie} src={photo} />
                            </section>
                    </header>                                     
                    <hr className="hr-header"></hr>
                </>
            )   
        }
    }
}

export default Header;