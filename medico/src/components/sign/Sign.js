import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

import { signInWithGoogle,auth } from "../../firebase";


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
        <button onClick={signClient}>client</button>        
        <button onClick={signPharmacie}>Pharmacie</button>    
      </>
    )
}

export default Sign;