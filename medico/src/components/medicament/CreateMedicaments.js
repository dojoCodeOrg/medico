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

function CreateMedicament() {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();
    const [medicament, setMedicament] = useState([]);
    const [fileUrl, setUrl] = useState("");
    const [percent, setPercent] = useState(0);
    const [isReady, setIsready] = useState(true);


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
                    const date = new Date();
                    let key = 1;
                    if (isEmpty(medicament)) {
                        setMedicament({});
                        key = 0;
                    }
                    console.log(`On a deja ${medicament.length} questions`);
                    let new_medoc = {};
                    new_medoc[key] = {name:name,description:description, price:price.split(','), date, fileUrl};
                    medicament.push(new_medoc);
                    console.log(medicament);
                    // const userDocByUsername = doc(db, "pharmacies", name);
                    // await updateDoc(userDocByUsername, {
                    //     medicament: medicament
                    // });
                    // window.location = `/medicament?${+key}!${user?.uid}`;
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
     
        const storageRef = ref(storage,`/photo/question/${file.name}`)
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
        nom: <input id="name" type="text"></input>
        description: <input id="description" type="text"></input>
        price: <input id="price" type="text"></input>
                        <label className="create-label">
                            Photo:
                            <input type="file" accept="/image/*" onChange={handleUpload}/>
                            <p className="create-percent">{percent} "%"</p>
                        </label>
        <button onClick={createNewMedicament}>ajouter un medicament</button>
        </>
    )
}

export default CreateMedicament;