import React, { useEffect, useState } from "react";
import { auth,db,stopNetworkAcces } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, getDocs, where, doc } from "firebase/firestore";
import { updateDoc} from "firebase/firestore";

import LoadingSpinner from "../loadSpinner/LoadingSpinner";
import "./medicament.css"
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { async } from "@firebase/util";


function Medicament() {
    const [isLoading, setIsLoading] = useState(false);
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();
    const [medicamentName, setMedicamentName] = useState('');
    const [medicamentDescription, setMedicamentDescription] = useState('');
    const [medicamentPrice, setMedicamentPrice] = useState('');
    const [medicamentPhoto, setMmedicamentPhoto] = useState('');
    const [type, setType] = useState("");
    const [photo, setPhoto] = useState();
    const [name, setName] = useState("");
    const [userid, setUid] = useState("");
    const [medicaments, setMedicaments] = useState("");
    const [userMedicaments, setUserMedicaments] = useState("");


    let medicamentID = null;
    let pharmacieid = null;
    let pharmaciename= null;
    try {
        pharmacieid = window.location.href.split('#')[1].split('!')[0];
        medicamentID = window.location.href.split('?')[1].split('#')[0];
        pharmaciename = window.location.href.split('!')[1];
    } catch (error) {
        console.log(error)
    }
    
    function corMonth(m) {
        let finalMonth = null;
        const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        month.forEach((i) => {
            if (m == month.indexOf(i)) {
                finalMonth = i;
            }
        })
        return finalMonth
    }

    const firebaseTimeToDayMonthYearAndHourMinutes = async (time) => {
        const questionTime = time.getHours()+':'+time.getMinutes();
        const questionDate = time.getDate()+' '+corMonth(time.getMonth())+', '+time.getFullYear();
        return questionDate+' a '+questionTime;
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
            setUserMedicaments(data.medicaments);
            
        } catch (err) {
            try {
                const qs = query(collection(db, "pharmacies"), where("uid", "==", user?.uid));
                const docs = await getDocs(qs);
                const datas = docs.docs[0].data();
                setName(datas.name);
                // console.error(err);
                setType(datas.type);
            } catch (error) {
                console.log(error)
            }
            console.log(err);
        }
    }; 

    const fetchMedicament = async () => {
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
            setMedicaments(medicament);

            medicament.forEach((item) => {
                if (Object.keys(item)[0] === medicamentID) {   
                    setMedicamentName(item[medicamentID].name);  
                    setMedicamentDescription(item[medicamentID].description);
                    setMedicamentPrice(item[medicamentID].price);
                    setMmedicamentPhoto(item[medicamentID].fileUrl);
                };
            });
        } catch (error) {
            console.log(error);
        }  
        setIsLoading(false);
    };


    const addMedicamentToUserMedicament = async () => {
        console.log(name);
        userMedicaments.push(`${pharmaciename}!${pharmacieid}?${medicamentID}&${medicamentPrice}@${medicamentName}`)
        console.log(userMedicaments);
        const userDocByUsername = doc(db, "users", name);
        await updateDoc(userDocByUsername, {
            medicaments: userMedicaments
        });
        alert("Medicament ajouter avec succes !!!");
        window.location.href = `/medicaments`;
    }

    const deleteMedicament = async () => {
        console.log(medicaments);
        console.log(medicamentID);
        let newMedicament = [];
        medicaments.forEach((item) => {
            console.log(item)
            if (Object.keys(item)[0] != medicamentID) {   
                newMedicament.push(item)
            };
        });
        console.log(newMedicament);
        console.log(pharmaciename);
        const userDocByUsername = doc(db, "pharmacies", pharmaciename);
        await updateDoc(userDocByUsername, {
            medicaments: newMedicament
        });
        window.location.href = `/pharmacie?${pharmaciename}#${user?.uid}`;
    };

    useEffect(() => {        
        if (loading) return;
        if (!user) navigate("/sign");

        setTimeout(() => { 
            fetchUserInfo();
        }, 1000);

        fetchMedicament();

    }, [user, loading]);

    if (type === 'user') {
        return (
            <>
                {isLoading ? <LoadingSpinner /> : fetchMedicament}
                <Header />
                <div className="medoc">
                    <img src={medicamentPhoto} alt="photo" />
                    <div className="medoc-content">
                        <h1>{medicamentName}</h1>
                        <p>{medicamentDescription}</p>
                        <p>{medicamentPrice}</p>
                        <button onClick={addMedicamentToUserMedicament}>Ajouter au panier</button>
                    </div>
                </div>
                <Footer />
            </>
            
        )
    } else {
        return (
            <>
                {isLoading ? <LoadingSpinner /> : fetchMedicament}
                <Header />                
                <div className="med">
                    <img src={medicamentPhoto} alt="photo" />
                    <div className="medoc-content">
                        <h1>{medicamentName}</h1>
                        <p>{medicamentDescription}</p>
                        <p>{medicamentPrice}</p>
                    </div>
                    <button className="del-medoc" onClick={deleteMedicament}>supprimer le medicament</button>
                </div>
                <Footer />
            </>
        )
    }
}

export default Medicament;