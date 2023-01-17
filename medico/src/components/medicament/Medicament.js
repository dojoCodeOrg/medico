import React, { useEffect, useState } from "react";
import { auth,db,stopNetworkAcces } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, getDocs, where } from "firebase/firestore";

function Medicament() {
    const [isLoading, setIsLoading] = useState(false);
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();


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
            console.log(medicament);

            let medoc_area = document.querySelector('#medoc_area');
            medoc_area.innerHTML = "";

            medicament.forEach((item) => {
                if (Object.keys(item)[0] === medicamentID) {   
                    let medoc_item = document.createElement('div');
                    medoc_item.classList.add('medoc-item');

                    let medoc_name = document.createElement('div');
                    medoc_name.classList.add('medoc-name');
                    medoc_name.innerHTML = item[medicamentID].name;

                    let medco_desc = document.createElement('div');
                    medco_desc.classList.add('medoc-description');
                    medco_desc.innerHTML = item[medicamentID].description;

                    let medco_photo = document.createElement('a');
                    medco_photo.classList.add('medoc');
                    medco_photo.src = item[medicamentID].photo;

                    let medco_price = document.createElement('div');
                    medco_price.classList.add('medoc-price');
                    medco_price.innerHTML = item[medicamentID].price;

                    medoc_item.appendChild(medoc_name);
                    medoc_item.appendChild(medco_desc);
                    medoc_item.appendChild(medco_price);
                    medoc_item.appendChild(medco_photo);

                    medoc_area.appendChild(medoc_item);
                };
            });
        } catch (error) {
            console.log(error);
        }  
    }

    useEffect(() => {        
        if (loading) return;
        if (!user) navigate("/sign");

        fetchMedicament();

    }, [user, loading]);

    return (
        <>
        <h1>Medicament (item)</h1>
        <div id="medoc_area"></div>
        </>
    )
}

export default Medicament;