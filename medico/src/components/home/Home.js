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



function Home() {
    const [isLoading, setIsLoading] = useState(false);
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();
    const [photo, setPhoto] = useState();
    const [name, setName] = useState("");
    const [userid, setUid] = useState("");
    const [type, setType] = useState("user");


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
 

    function switchToProximite() {
        window.location.href = `/proximite`;
    }
    function switchToMedicaments() {
        window.location.href = `/medicaments`;        
    }

    useEffect(() => {
        if (loading) return;        
        if (!user) navigate("/sign");

        setTimeout(() => { 
            fetchUserInfo();
        }, 1000);
    }, [user, loading]);


    if (type === 'user') {
        return (
            <>
            <Header />

            <div className="home-client">
                <p className="client-hp">Bienvenue sur Medico client {name}</p>
                <div className="home-client-hero-section">
                    <div className="hero-content">
                        <h1 className="hero-h1">Medico</h1>
                        <p className="hero-p">In publishing and graphic design, Lorem ipsum is a placeholder
                     text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content.</p>
                    </div>
                    <img className="hero-image" src={medocs} />
                </div>
                <div className="home-client-pharmacie-gard">
                    <img className="gard-image" src={map} />
                    <div className="gard-content">
                        <h1 className="gard-h1">Pharmacie a Proximite</h1>
                        <p className="gard-p">In publishing and graphic design, Lorem ipsum is a placeholder
                     text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content.</p>
                     <button onClick={switchToProximite} className="gard-button">voir les pharmacies a proximites</button>
                    </div>
                </div>  
                <div className="home-client-pharmacie-prox">
                    <div className="prox-content">
                        <h1 className="prox-h1">Pharmacie de Garde</h1>
                        <p className="prox-p">In publishing and graphic design, Lorem ipsum is a placeholder
                     text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content.</p>
                     <button onClick={switchToProximite} className="prox-button">voir les pharmacies de gardes</button>
                    </div>
                    <img className="prox-image" src={map} />
                </div>  
                <div className="top-medoc">
                    <div className="top-medoc-header">
                        <p className="pop-p">Medicament populaire</p>
                        <button onClick={switchToMedicaments} className="pop-all">voir tout</button>
                    </div>
                    <div className="top-medoc-content">
                        <div className="top-medoc-item">
                            <img className="item-image" src={para} />
                            <p>Paracetamols</p>
                            <a>voir</a>
                        </div>
                        <div className="top-medoc-item">
                            <img className="item-image" src={para} />
                            <p>Paracetamols</p>
                            <a>voir</a>
                        </div>
                        <div className="top-medoc-item">
                            <img className="item-image" src={para} />
                            <p>Paracetamols</p>
                            <a>voir</a>
                        </div>
                        <div className="top-medoc-item">
                            <img className="item-image" src={para} />
                            <p>Paracetamols</p>
                            <a>voir</a>
                        </div>
                    </div>
                </div>
                           

            </div>
            
            <Footer />
            </>
        )        
    } else if (type === 'pharmacie') {
        return (
            <>
    
            <div>Bienvenue sur Medico Pharnacie {name}</div>
    
            </>
        )   
    }
}

export default Home;