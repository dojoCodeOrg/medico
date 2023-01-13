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

        <div class="container">
                <main>
                    <div class="client">
                        <div class="image">
                            <img src={group1} alt="" />
                        </div>
                        <h1>Medico Client</h1>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore, voluptatibus commodi animi dolore reprehenderit, minus in natus id, culpa quam eligendi iusto amet nesciunt quisquam deserunt soluta atque aspernatur quos!</p>
                        <button>Client</button>
                    </div>
                    <div class="pharmacie">
                        <div class="image">
                            <img src={group2} alt="" />
                        </div>
                        <h1>Medico Pharmacie</h1>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore, voluptatibus commodi animi dolore reprehenderit, minus in natus id, culpa quam eligendi iusto amet nesciunt quisquam deserunt soluta atque aspernatur quos!</p>
                        <button>Pharmacie</button>
                    </div>
                </main>
        </div>
      </>
    )
}

export default Sign;