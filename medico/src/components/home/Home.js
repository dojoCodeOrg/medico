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

function Home() {
    const [isLoading, setIsLoading] = useState(false);
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();
    const [photo, setPhoto] = useState();
    const [name, setName] = useState("");
    const [userid, setUid] = useState("");
    const [type, setType] = useState("");


    const fetchMedicaments = async () => {
        setIsLoading(true);
        let medicament = [];
        try {
            const q = query(collection(db, "pharmacies"));
            const doc = await getDocs(q);
            const data = doc.docs;
            data.forEach((item) => {
                if (!item.data().medicaments) {
                    item.data().medicaments = {};
                }
                const tempMedicament = item.data().medicaments;
                medicament.push(tempMedicament);
            });
            medicament = medicament[0];
            console.log(medicament);

            let medoc_area = document.querySelector('#medoc_area');
            console.log(medoc_area)
            medoc_area.innerHTML = "";

            medicament.forEach((item) => {                    
                let ids = Object.keys(item);
                        let medoc_item = document.createElement('div');
                        medoc_item.classList.add('top-medoc-item');

                        let medoc_name = document.createElement('div');
                        medoc_name.classList.add('medoc-name');
                        medoc_name.innerHTML = item[ids].name;

                        let medco_desc = document.createElement('div');
                        medco_desc.classList.add('medoc-description');
                        medco_desc.innerHTML = item[ids].description;

                        let medco_photo = document.createElement('img');
                        medco_photo.classList.add('item-image');
                        medco_photo.src = item[ids].fileUrl;

                        let medco_price = document.createElement('div');
                        medco_price.classList.add('medoc-price');
                        medco_price.innerHTML = `${item[ids].price} fcfa`;

                        let medoc_href = document.createElement('a');
                        let linkText = document.createTextNode("Voir");
                        medoc_href.appendChild(linkText);
                        medoc_href.href = `/medicament?${Object.keys(item)[0]}#${item[ids].pharmacieWhoAsId}`;

                        medoc_item.appendChild(medco_photo);
                        medoc_item.appendChild(medoc_name);
                        // medoc_item.appendChild(medco_desc);
                        medoc_item.appendChild(medco_price);
                        medoc_item.appendChild(medoc_href);

                        medoc_area.appendChild(medoc_item);
                // }
                ids = ids+1;
            });
        } catch (error) {
            console.log(error);
        }  
        setIsLoading(false);
    }

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
            console.log(err);
            // window.location.href = "/p";
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
        setTimeout(() => { 
            fetchMedicaments();
        }, 100);
    }, [user, loading]);

        return (
            <>
            {isLoading ? <LoadingSpinner /> : fetchMedicaments}
            <Header />

            <div className="home-client">
                <p className="client-hp">Bienvenue sur Pharma Home client {name}</p>
                <div className="home-client-hero-section">
                    <div className="hero-content">
                        <h1 className="hero-h1">Pharma Home</h1>
                        <p className="hero-p">In publishing and graphic design, Lorem ipsum is a placeholder
                     text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content.</p>
                    </div>
                    <img className="hero-image" src={medocs} />
                </div>
                {/* <div className="home-client-pharmacie-prox">
                    <div className="prox-content">
                        <h1 className="prox-h1">Pharmacie de Garde</h1>
                        <p className="prox-p">In publishing and graphic design, Lorem ipsum is a placeholder
                     text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content.</p>
                     <button onClick={switchToProximite} className="prox-button">voir les pharmacies de gardes</button>
                    </div>
                    <img className="prox-image" src={map} />
                </div>   */}
                <div className="top-medoc">
                    <div className="top-medoc-header">
                        <p className="pop-p">Medicament populaire</p>
                        <button onClick={switchToMedicaments} className="pop-all">voir tout</button>
                    </div>
                    <div className="top-medoc-content">
                        <div id="medoc_area"></div>                       
                    </div>
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
                           

            </div>
            
            {/* <Footer /> */}
            </>
        )            
}

export default Home;