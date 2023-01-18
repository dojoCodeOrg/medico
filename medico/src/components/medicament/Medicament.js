import React, { useEffect, useState } from "react";
import { auth,db,stopNetworkAcces } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, getDocs, where } from "firebase/firestore";

import "./medicament.css"
import Header from "../header/Header";
import Footer from "../footer/Footer";


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


    let medicamentID = null;
    let pharmacieid = null;
    try {
        pharmacieid = window.location.href.split('#')[1];
        medicamentID = window.location.href.split('?')[1].split('#')[0];
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

    const fetchMedicament = async () => {
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
    }

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
                <Header />
                <div className="medoc">
                    <img src={medicamentPhoto} alt="photo" />
                    <div className="medoc-content">
                        <h1>{medicamentName}</h1>
                        <p>{medicamentDescription}</p>
                        <p>{medicamentPrice}</p>
                        <button>Ajouter au panier</button>
                    </div>
                </div>
                <Footer />
            </>
            
        )
    } else {
        return (
            <>
                <Header />
                <div className="med">
                    <img src={medicamentPhoto} alt="photo" />
                    <div className="medoc-content">
                        <h1>{medicamentName}</h1>
                        <p>{medicamentDescription}</p>
                        <p>{medicamentPrice}</p>
                    </div>
                </div>
                <Footer />
            </>
        )
    }
}

export default Medicament;