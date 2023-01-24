import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

import { signInWithGoogle,auth } from "../../firebase";

import group1 from "../../assets/images/Group 1.svg";
import group2 from "../../assets/images/Group 2.svg";
import "./sign.css";

function Sign() {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();

    function signClient() {
      signInWithGoogle('user');
    }
    function signPharmacie() {
      signInWithGoogle('pharmacie');
    }
    
    useEffect(() => {
      if (loading) return;
      if (user) navigate("/");
    }, [user, loading]);


    return (
      <>       

        <div class="container-sign">
                <main>
                    <div class="client">
                        <div class="image-sign">
                            <img src={group1} alt="" />
                        </div>
                        <h1 className="h1-sign">Pharma Home Client</h1>
                        <p className="p-sign">Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore, voluptatibus commodi animi dolore reprehenderit, minus in natus id, culpa quam eligendi iusto amet nesciunt quisquam deserunt soluta atque aspernatur quos!</p>
                        <button className="button-sign button-client-sign" onClick={signClient}>Client</button>
                    </div>
                    <div class="pharmacie">
                        <div class="image-sign">
                            <img src={group2} alt="" />
                        </div>
                        <h1 className="h1-sign">Pharma Home Pharmacie</h1>
                        <p className="p-sign">Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore, voluptatibus commodi animi dolore reprehenderit, minus in natus id, culpa quam eligendi iusto amet nesciunt quisquam deserunt soluta atque aspernatur quos!</p>
                        <button className="button-sign button-pharmacie" onClick={signPharmacie}>Pharmacie</button>
                    </div>
                </main>
        </div>
      </>
    )
}

export default Sign;