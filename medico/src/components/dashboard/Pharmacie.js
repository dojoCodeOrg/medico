import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth,logout,db } from "../../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { doc, updateDoc} from "firebase/firestore";

function Pharnacie() {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();
    const [photo, setPhoto] = useState('');
    const [name, setName] = useState("");
    const [lastSeen, setLastSeen]= useState('');
    const [creationTime, setCreationTime] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [localisation, setLocalisation] = useState('');
    const [email, setEmail] = useState('');



    let pharmaciename = null;
    let pharmacieid = null;
    try {
        pharmacieid = window.location.href.split('#')[1];
        pharmaciename = window.location.href.split('?')[1].split('#')[0].split('%20').join(' ');
    } catch (err) {
        console.log(err);
    }

    const fetchPharmacieInfo = async () => {
        try {            
            const q = query(collection(db, "pharmacies"), where("uid", "==", user?.uid));
            const doc = await getDocs(q);
            const data = doc.docs[0].data();

            setName(data.name);            
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

    useEffect(() => {
        if (loading) return;
        if (!user) navigate("/sign");
        
        fetchPharmacieInfo();

    }, [user, loading]);
        
    return (
        <>  
            <img referrerpolicy="no-referrer" src={photo} alt='Photo' />
            <p id="name" contentEditable="true">{name}</p>
            <p>inscrit le : {creationTime}</p>
            <p>derniere connexion : {lastSeen}</p>
            <h2>Mes info</h2>
            <p id="email">{email}</p>
            localisation :<p id="localisation" contentEditable="true">{localisation}</p>
            description :<p id="description" contentEditable="true">{description}</p>
            <button onClick={updatePharmacieProfile}>enregistrer les modifs</button>
            <button onClick={logout}>se deconnecter</button>
        </>
    )
}

export default Pharnacie;