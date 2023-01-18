import React, { useEffect, useState } from "react";
import { auth,db,stopNetworkAcces } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, getDocs } from "firebase/firestore";

import "./medicaments.css";
import para from "../../assets/images/para.svg";

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

    }

    useEffect(() => {        
        if (loading) return;
        if (!user) navigate("/sign");

        fetchMedicaments();

    }, [user, loading]);

    return (
        <>
        <main>
            <div className="top-medoc">
                <div className="top-medoc-header">
                    <p className="pop-p">Medicament populaire</p>
                </div>
                <div className="top-medoc-content">
                    <div className="top-medoc-item">
                        <img className="item-image" src={para} />
                        <p>Paracetamols</p>
                        <a>voir</a>
                    </div>
                    <div className="top-medoc-item">
                        <img className="item-image" src={para} />
                        <p>Paracetamols</p>
                        <a>voir</a>
                    </div>
                    <div className="top-medoc-item">
                        <img className="item-image" src={para} />
                        <p>Paracetamols</p>
                        <a>voir</a>
                    </div>
                    <div className="top-medoc-item">
                        <img className="item-image" src={para} />
                        <p>Paracetamols</p>
                        <a>voir</a>
                    </div>
                    <div className="top-medoc-item">
                        <img className="item-image" src={para} />
                        <p>Paracetamols</p>
                        <a>voir</a>
                    </div>
                    <div className="top-medoc-item">
                        <img className="item-image" src={para} />
                        <p>Paracetamols</p>
                        <a>voir</a>
                    </div>
                    <div className="top-medoc-item">
                        <img className="item-image" src={para} />
                        <p>Paracetamols</p>
                        <a>voir</a>
                    </div>
                    <div className="top-medoc-item">
                        <img className="item-image" src={para} />
                        <p>Paracetamols</p>
                        <a>voir</a>
                    </div>
                    <div className="top-medoc-item">
                        <img className="item-image" src={para} />
                        <p>Paracetamols</p>
                        <a>voir</a>
                    </div>
                    <div className="top-medoc-item">
                        <img className="item-image" src={para} />
                        <p>Paracetamols</p>
                        <a>voir</a> 
                    </div>
                </div>
            </div>
        </main>
        </>
    )
}

export default Medicaments;