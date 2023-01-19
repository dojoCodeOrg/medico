import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import "./footer.css";

function Footer() {
    const [user, loading] = useAuthState(auth);
 
    function switchToHome() {
        window.location.href = `/`;
    }     
    function switchToPrivacy() {
        window.location.href = '/privacy-policy';
    }

    return (
        <>
            <hr className="hr-footer"></hr>
            <footer>
                <div class="content-text">
                    <div class="text1">
                        <h1 class="medico">Medico</h1>
                        <ul>
                            <li className="el-hover-footer" ><a href="mailto:hamedcuenca5@gmail.com">Contact</a></li>
                        </ul>
                        <ul>
                            <li onClick={switchToPrivacy} className="el-hover-footer">Termes of use</li>
                            <li className="el-hover-footer">Tips</li>
                        </ul>
                    </div>                  
                    <div class="text4">
                        <h1>Follow us</h1>
                        <div class="img">
                            <ul>
                                <li><a className="el-hover-footer" href="#">Youtube</a></li>
                                <li><a className="el-hover-footer" href="#">Facebook</a></li>
                            </ul>
                        </div>                      
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer;