import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth,logout,db } from "../../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { doc, updateDoc} from "firebase/firestore";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import LoadingSpinner from "../loadSpinner/LoadingSpinner";
import "./dashboard.css";

function Dashboard() {
    const [user, loading] = useAuthState(auth);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [photo, setPhoto] = useState('');
    const [name, setName] = useState("");
    const [poids, setPoids] = useState("");
    const [taille, setTaille] = useState("");
    const [age, setAge] = useState("");
    const [sexe, setSexe] = useState("");
    const [lastSeen, setLastSeen]= useState('');
    const [creationTime, setCreationTime] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('')

    let username = null;
    let userid = null;
    try {
        userid = window.location.href.split('#')[1];
        username = window.location.href.split('?')[1].split('#')[0].split('%20').join(' ');
    } catch (err) {
        console.log(err);
    }

    const fetchUserInfo = async () => {
        setIsLoading(true);
        try {            
            const q = query(collection(db, "users"), where("uid", "==", user?.uid));
            const doc = await getDocs(q);
            const data = doc.docs[0].data();

            setName(data.name);            
            setCreationTime(data.creationTime.split(',')[1].split('GMT'));
            setLastSeen(data.lastSeenTime.split(',')[1].split('GMT'));
            let userPhotoFetch = 0;
            userPhotoFetch = data.userPhoto;            
            setPhoto(userPhotoFetch);
            setPoids(data.poids);
            setTaille(data.taille);
            setAge(data.age);
            setSexe(data.sexe);
            setType(data.type);
            setDescription(data.description)
        } catch (err) {
            console.error(err);
        }
        setIsLoading(false);
    }; 


    const updateUserProfile = async () => {
        const cpoids = document.querySelector('#poids').textContent;
        const ctaille = document.querySelector('#taille').textContent;
        const cage = document.querySelector('#age').textContent;
        const csexe = document.querySelector('#sexe').textContent;
        const cdescription = document.querySelector('#description').textContent;
        if (cpoids === poids && ctaille === taille && cage === age && csexe === sexe && cdescription === description) {
            alert('aucun modification aporte');
            return false;
        } else {
            setPoids(cpoids);
            setTaille(ctaille);
            setAge(cage);
            setSexe(csexe);
            setDescription(cdescription);
            try {
                const userDocByUsername = doc(db, "users", name);
                await updateDoc(userDocByUsername, {
                    poids: cpoids,
                    taille: ctaille,
                    age: cage,
                    sexe: csexe,
                    description: cdescription,
                });
            } catch (err) {
                console.error(err);               
            }
            alert('modification ajouter');
        }
        fetchUserInfo();
    }

    useEffect(() => {
        if (loading) return;
        if (!user) navigate("/sign");
        
        fetchUserInfo();

    }, [user, loading]);
        
    return (
        <>  
         <Header />              
            {isLoading ? <LoadingSpinner /> : fetchUserInfo}
            <div id="user-dash">
                    <div class="user-dash-content">
                        <div class="user-detail">
                            <div class="image-dash">
                                <img referrerpolicy="no-referrer" src={photo} alt="Photo"/>
                            </div>
                            <div class="infos-dash">
                                <h3>{username}</h3>
                                <p>inscrit le : {creationTime}</p>
                                {/* <p>Derniere connexion : {lastSeen}</p> */}
                            </div>
                        </div>   
                        <div class="user-detail-editable">
                            {/* <h2>Mes info</h2> */}
                            <div className="detail-item">
                                Poids :<p id="poids" contentEditable="true">{poids}</p> kg
                            </div>
                            <div className="detail-item">
                                Taille :<p id="taille" contentEditable="true">{taille}</p> cm
                            </div>
                            <div className="detail-item">
                                Age :<p id="age" contentEditable="true">{age}</p> ans
                            </div>
                            <div className="detail-item">
                                Sexe :<p id="sexe" contentEditable="true">{sexe}</p>
                            </div>
                            <div className="detail-item">
                                Infos :<p id="description" contentEditable="true">{description}</p>
                            </div>
                        </div>    
                        <div className="btns">
                            <button className="dash-btn" onClick={updateUserProfile}>Enregistrer les modifications</button>
                            <button className="dash-btn" onClick={logout}>Se deconnecter</button>
                        </div>
                    </div>   
                    <div className="panier">
                        <h2>Panier</h2>
                        <div className="panier-item">
                            <div className="panier-item-content">
                                <p>Paracetamol x<span>1</span> <span>200fr</span></p>
                                <p>Chez: xxxx</p>
                            </div>
                            <div className="remove-add-item-btn">
                                -
                            </div>
                        </div>
                        <div className="panier-item">
                            <div className="panier-item-content">
                                <p>Paracetamol x<span>1</span> <span>200fr</span></p>
                                <p>Chez: xxxx</p>
                            </div>
                            <div className="remove-add-item-btn">
                                -
                            </div>
                        </div>
                        <div className="panier-item">
                            <div className="panier-item-content">
                                <p>Paracetamol x<span>1</span> <span>200fr</span></p>
                                <p>Chez: xxxx</p>
                            </div>
                            <div className="remove-add-item-btn">
                                -
                            </div>
                        </div>
                        <button className="commande-validator">Passer commande</button>
                    </div>                             
            </div> 

            <Footer />
        </>
    )
}

export default Dashboard;