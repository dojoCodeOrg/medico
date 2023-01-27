import React, { useEffect, useState } from "react";
import { auth,db,stopNetworkAcces } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, getDocs } from "firebase/firestore";

import Header from "../header/Header";
import Footer from "../footer/Footer";
import LoadingSpinner from "../loadSpinner/LoadingSpinner";

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
        setIsLoading(true);
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

            let medoc_area = document.querySelector('#medoc_area_all');
            medoc_area.innerHTML = "";

            medicament.forEach((item) => {                    
                let ids = Object.keys(item);
                    let medoc_item = document.createElement('div');
                    medoc_item.classList.add('medoc-item');

                    let medoc_name = document.createElement('div');
                    medoc_name.classList.add('medoc-name');
                    medoc_name.innerHTML = item[ids].name;

                    let medco_desc = document.createElement('div');
                    medco_desc.classList.add('medoc-description');
                    medco_desc.innerHTML = item[ids].description;

                    let medco_photo = document.createElement('img');
                    medco_photo.classList.add('medoc-photo');
                    medco_photo.src = item[ids].fileUrl;

                    let medco_price = document.createElement('div');
                    medco_price.classList.add('medoc-price');
                    medco_price.innerHTML = item[ids].price;

                    let medoc_href = document.createElement('a');
                    medoc_href.classList.add('see-btn');
                    let linkText = document.createTextNode("Voir");
                    medoc_href.appendChild(linkText);
                    medoc_href.href = `/medicament?${Object.keys(item)[0]}#${item[ids].pharmacieWhoAsId}`;

                    medoc_item.appendChild(medco_photo);
                    medoc_item.appendChild(medoc_name);
                    medoc_item.appendChild(medco_desc);
                    medoc_item.appendChild(medco_price);
                    medoc_item.appendChild(medoc_href);

                    medoc_area.appendChild(medoc_item);
                    ids = ids+1;
            });
        } catch (error) {
            console.log(error);
        }  
        setIsLoading(false);
    }

    useEffect(() => {        
        if (loading) return;
        if (!user) navigate("/sign");

        fetchMedicaments();

    }, [user, loading]);

    return (
        <>
            {isLoading ? <LoadingSpinner /> : fetchMedicaments}
            <Header />   

            <div className="all-content">
                <h1 className="all-h1">Tout les medicaments sont ici</h1>
                <div id="medoc_area_all"></div>
            </div>

            <Footer />
        </>
    )
}

export default Medicaments;