import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth,logout,db } from "../../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { doc, updateDoc} from "firebase/firestore";
import { async } from "@firebase/util";

import "./dashboard.css";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import LoadingSpinner from "../loadSpinner/LoadingSpinner";

function Pharnacie() {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();
    const [photo, setPhoto] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const [lastSeen, setLastSeen]= useState('');
    const [creationTime, setCreationTime] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [localisation, setLocalisation] = useState('');
    const [email, setEmail] = useState('');    
    const [medicament, setMedicament] = useState([]);



    let pharmaciename = null;
    let pharmacieid = null;
    try {
        pharmacieid = window.location.href.split('#')[1];
        pharmaciename = window.location.href.split('?')[1].split('#')[0].split('%20').join(' ');
    } catch (err) {
        console.log(err);
    }

    const fetchPharmacieMedicament = async () => {
        setIsLoading(true);
        let medicament = [];
        try {
            const q = query(collection(db, "pharmacies"), where("uid", "==", pharmacieid));
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

            const medoc_area = document.querySelector('#medicament-area');
            medoc_area.innerHTML = "";

            medicament.forEach((item) => {        
                const ids = Object.keys(item);
                    let medoc_item = document.createElement('div');
                    medoc_item.classList.add('medoc-item');

                    let medoc_name = document.createElement('div');
                    medoc_name.classList.add('medoc-name');
                    medoc_name.innerHTML = item[ids].name;

                    let medco_desc = document.createElement('div');
                    medco_desc.classList.add('medoc-description');
                    medco_desc.innerHTML = `Description : ${item[ids].description}`;

                    let medco_photo = document.createElement('a');
                    medco_photo.classList.add('medoc-photot');
                    medco_photo.src = item[ids].photo;

                    let medco_price = document.createElement('div');
                    medco_price.classList.add('medoc-price');
                    medco_price.innerHTML = `Prix : ${item[ids].price} fcfa`;

                    let medoc_href = document.createElement('a');
                    let linkText = document.createTextNode("Voir");
                    medoc_href.appendChild(linkText);
                    medoc_href.href = `/medicament?${Object.keys(item)[0]}#${pharmacieid}`;

                    medoc_item.appendChild(medoc_name);
                    medoc_item.appendChild(medco_desc);
                    medoc_item.appendChild(medco_price);
                    medoc_item.appendChild(medoc_href);
                    medoc_item.appendChild(medco_photo);

                    medoc_area.appendChild(medoc_item);
                    ids = ids+1;
            });
        } catch (error) {
            console.log(error);
        };
        setIsLoading(false);
    };   
    

    const fetchPharmacieInfo = async () => {
        try {            
            const q = query(collection(db, "pharmacies"), where("uid", "==", user?.uid));
            const doc = await getDocs(q);
            const data = doc.docs[0].data();

            setName(data.name);
            setMedicament(data.medicament);
            setCreationTime(data.creationTime.split(',')[1].split('GMT'));
            setLastSeen(data.lastSeenTime.split(',')[1].split('GMT'));
            let userPhotoFetch = 0;
            userPhotoFetch = data.pharmaciePhoto;            
            setPhoto(userPhotoFetch);       
            setType(data.type);
            setDescription(data.description);
            setEmail(data.email);
            setLocalisation(data.localisation);
        } catch (err) {
            console.error(err);
        }
    }; 


    const updatePharmacieProfile = async () => {
        const cname = document.querySelector('#name').textContent;
        const clocalisation = document.querySelector('#localisation').textContent;
        const cdescription = document.querySelector('#description').textContent;
        if (cname === name && cdescription === description && clocalisation === localisation) {
            alert('aucun modification aporte');
            return false;
        } else {
            setName(cname);
            setDescription(cdescription);
            try {
                const userDocBypharmaciename = doc(db, "pharmacies", pharmaciename);
                await updateDoc(userDocBypharmaciename, {
                    name: cname,               
                    description: cdescription,
                    localisation: clocalisation,
                });
            } catch (err) {
                console.error(err);               
            }
            alert('modification ajouter');
        }
        fetchPharmacieInfo();
    }

    function switchToCreateMedicament() {
        window.location.href = `/new/medicament?${pharmaciename}`
    }

    useEffect(() => {
        if (loading) return;
        if (!user) navigate("/sign");
        
        fetchPharmacieInfo();
        fetchPharmacieMedicament();

    }, [user, loading]);
        
    return (
        <>                                           

            <Header />              
            {isLoading ? <LoadingSpinner /> : fetchPharmacieMedicament}
            
            <div id="user-dash">
                    <div class="user-dash-content">
                        <div class="user-detail">
                            <div class="image-dash">
                                <img referrerpolicy="no-referrer" src={photo} alt="Photo"/>
                            </div>
                            <div class="infos-dash">
                                <p id="name" contentEditable="true" >{name}</p>
                                <p>inscrit le : {creationTime}</p>
                                {/* <p>Derniere connexion : {lastSeen}</p> */}
                            </div>
                        </div>   
                        <div class="user-detail-editable">
                            <h2>Infos</h2>
                            <div className="detail-item">
                                Email :<p id="email">{email}</p> cm
                            </div>
                            <div className="detail-item">
                                localisation :<p id="poids" contentEditable="true">{localisation}</p>
                            </div>
                            <div className="detail-item">
                                localisation :<p id="localisation" contentEditable="true">{localisation}</p>
                            </div>           
                            <div className="detail-item">
                                description :<p id="description" contentEditable="true">{description}</p>
                            </div>
                        </div>    
                        <div className="btns">
                            <button className="dash-btn" onClick={updatePharmacieProfile}>Enregistrer les modifications</button>
                            <button className="dash-btn" onClick={logout}>Se deconnecter</button>
                        </div>
                    </div>   
                    <div className="panier">
                        <h1>Medicaments</h1>
                        <div id="medicament-area"></div>
                        <button onClick={switchToCreateMedicament}>ajouter un medicament</button>
                    </div>                             
            </div> 

            <Footer />
        </>
    )
}

export default Pharnacie;