import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth,logout,db } from "../../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { doc, updateDoc} from "firebase/firestore";

function Dashboard() {
    const [user, loading] = useAuthState(auth);
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
            <img referrerpolicy="no-referrer" src={photo} alt='Photo' />
            <p>{username}</p>
            <p>inscrit le : {creationTime}</p>
            <p>derniere connexion : {lastSeen}</p>
            <h2>Mes info</h2>
            poids :<p id="poids" contentEditable="true">{poids}</p>
            taille :<p id="taille" contentEditable="true">{taille}</p>
            age :<p id="age" contentEditable="true">{age}</p>
            sexe :<p id="sexe" contentEditable="true">{sexe}</p>
            description :<p id="description" contentEditable="true">{description}</p>
            <button onClick={updateUserProfile}>enregistrer les modifs</button>
            <button onClick={logout}>se deconnecter</button>
        </>
    )
}

export default Dashboard;