import React, { useEffect, useState } from "react";
import { auth,db,stopNetworkAcces } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, getDocs } from "firebase/firestore";

function Medicaments() {
    const [isLoading, setIsLoading] = useState(false);
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();


    let medicamentID = null;
    try {
        medicamentID = window.location.href.split('?')[1].split('!')[0];
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
                    let medoc_item = document.createElement('div');
                    medoc_item.classList.add('medoc-item');

                    let medoc_name = document.createElement('div');
                    medoc_name.classList.add('medoc-name');
                    medoc_name.innerHTML = item[ids].name;

                    let medco_desc = document.createElement('div');
                    medco_desc.classList.add('medoc-description');
                    medco_desc.innerHTML = item[ids].description;

                    let medco_photo = document.createElement('a');
                    medco_photo.classList.add('medoc');
                    medco_photo.src = item[ids].photo;

                    let medco_price = document.createElement('div');
                    medco_price.classList.add('medoc-price');
                    medco_price.innerHTML = item[ids].price;

                    medoc_item.appendChild(medoc_name);
                    medoc_item.appendChild(medco_desc);
                    medoc_item.appendChild(medco_price);
                    medoc_item.appendChild(medco_photo);

                    medoc_area.appendChild(medoc_item);
                    ids = ids+1;
            });
        } catch (error) {
            console.log(error);
        }  
    }

    useEffect(() => {        
        if (loading) return;
        if (!user) navigate("/sign");

        fetchMedicaments();

    }, [user, loading]);

    return (
        <>
        <h1>Medicaments (tout)</h1>
        <div id="medoc_area"></div>
        </>
    )
}

export default Medicaments;