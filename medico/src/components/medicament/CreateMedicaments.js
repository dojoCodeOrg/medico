import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth,logout,db } from "../../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { doc, updateDoc} from "firebase/firestore";
import { async } from "@firebase/util";
import { isEmpty } from "@firebase/util";
import storage from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import "./createMedicament.css";
import Header from "../header/Header";
import Footer from "../footer/Footer";



function CreateMedicament() {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();
    const [medicament, setMedicament] = useState([]);
    const [fileUrl, setUrl] = useState("");
    const [percent, setPercent] = useState(0);
    const [isReady, setIsready] = useState(true);


    let pharmaciename = null;
    try {
        pharmaciename = window.location.href.split('?')[1];
    } catch (error) {
        pharmaciename = 0;
        console.log(error)
    }

    const fetchPharmacieMedicaments = async () => {
        try {            
            const q = query(collection(db, "pharmacies"), where("uid", "==", user?.uid));
            const doc = await getDocs(q);
            const data = doc.docs[0].data();

            setMedicament(data.medicaments);

        } catch (err) {
            console.error(err);
        }   
    };

    const createNewMedicament = async () => {
        console.log(medicament)
        if (isReady) {
            try {       
                const name = document.querySelector('#name').value;
                const description = document.querySelector('#description').value;
                const price = document.querySelector('#price').value; 
                if (name === '' || description === '' || price === '') {
                    alert("remplissez tout les champs svp");
                    return false;
                } else {               
                    let key = 0;
                    const date = new Date();
                    if (isEmpty(medicament)) {
                        console.log("isEMpty");
                        setMedicament({});
                        key = 0;
                    } else {
                        key = parseInt(Object.keys(medicament[medicament.length-1])[0])+1;
                    }
                    console.log(`On a deja ${key} questions`);
                    let new_medoc = {};
                    new_medoc[key] = {name:name,description:description, price:price.split(','), date, fileUrl, pharmacieWhoAsId:user?.uid};
                    medicament.push(new_medoc);
                    const userDocByUsername = doc(db, "pharmacies", pharmaciename);
                    await updateDoc(userDocByUsername, {
                        medicaments: medicament
                    });
                    window.location = `/medicament?${key}#${user?.uid}`;
                }            
    
            } catch (error) {
                console.log(error);
            }
        } else {
            alert('Patienter le temps que le fichier se charge ...')
        }        
    };

    const handleUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            return false;
        }
     
        const storageRef = ref(storage,`/photo/medicaments/${file.name}`)
        const uploadTask = uploadBytesResumable(storageRef, file);
     
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const percent = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
     
                // update progress
                setPercent(percent);
                if (percent != 100) {
                    setIsready(false);
                }
            },
            (err) => console.log(err),
            () => {
                // download url
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    if (url) {
                        console.log(url)
                        setUrl(url);
                        setIsready(true);
                    }
                });
            }
        ); 
    };

    useEffect(() => {
        if (loading) return;
        if (!user) navigate("/sign");
        
        fetchPharmacieMedicaments();
    }, [user, loading]);

    return (
        <>

        <Header />       

                <div class="create-container">
                    <main class="create-main">
                        <h1>Ajouter un nouveau medicament</h1><br></br><br></br>

                        <div class="block1">
                            <p className="create-titre">Nom</p>
                            <p className="create-p">Soyez précis sur le nom du medicament.</p>
                            <input type="text" id="name" />
                        </div>

                        <div class="block2">
                            <p className="create-titre">Description</p>
                            <p className="create-p">Présentez le medicament. Minimum 20 caractères.</p>
                            <textarea className="create-textarea" id="description"></textarea>
                        </div>

                        <div class="block3">
                            <p className="create-titre">Prix</p>
                            <p className="create-p">Ajouter le prix du medicament.</p>
                            <input type="text" id="price" />
                        </div>

                        <label className="create-label">
                            Photo:
                            <input required type="file" accept="/image/*" onChange={handleUpload}/>
                            <p className="create-percent">{percent} "%"</p>
                        </label>

                        <div class="button">
                            <a onClick={createNewMedicament}>Ajouter un medicament</a>
                        </div>
                    </main>
                </div> 
        

            <Footer />

        </>
    )
}

export default CreateMedicament;