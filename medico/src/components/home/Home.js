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
    const [type, setType] = useState("");


    const fetchMedicaments = async () => {
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
            medoc_area.innerHTML = "";

            let ids = 0;            
            medicament.forEach((item) => {                    
                console.log(ids)
                // if (ids < 1) {
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
                        medco_photo.src = item[ids].photo;

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
            try {
                setUid(user.uid)
                setName(user.displayName);
                setPhoto(user.photoURL);
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
    function switchToPharmacieProfile() {
        window.location.href = `/pharmacie?${name}#${user?.uid}`;        
    }

    useEffect(() => {
        if (loading) return;        
        if (!user) navigate("/sign");

        setTimeout(() => { 
            fetchUserInfo();
            fetchMedicaments();
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
                        <div id="medoc_area"></div>                       
                    </div>
                </div>
                           

            </div>
            
            <Footer />
            </>
        )        
    } else if (type === 'pharmacie') {
        return (
            <>
            <Header />
                <div className="home-client">
                    <p className="client-hp">Bienvenue sur Medico Pharnacie {name}</p>
                    <button onClick={switchToPharmacieProfile} className="gard-button">Aller vers le Profil</button>
                </div>
            <Footer />
            </>
        )   
    }
}

export default Home;