import "./login.css"
import 'react-toastify/dist/ReactToastify.css';
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { FaRegEyeSlash } from "react-icons/fa";
import api from "../../Service/api";
import { toast, ToastContainer } from "react-toastify";

export default function Login() {

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [tipoSenha, setTipoSenha] = useState("password");
    const navigate = useNavigate();

    function showSenha() {
        if(tipoSenha === "password")
            setTipoSenha("text")
        else 
            setTipoSenha("password")
    }

    async function autenticate(e) {
        e.preventDefault();

        await api.get(`/user/login/${email}/${senha}`)
        .then((res) => {
            localStorage.setItem("@userCredential", res.data.nomeUsuario)
            localStorage.setItem("@active", true)
            localStorage.setItem("@userId", res.data.codigoUsuario)
            navigate('/home')
        })
        .catch((err) => {
            toast.error(err.response.data.message)
            localStorage.setItem("@active", false)
            
        })
    }

    return (
        <div className="container">
            <div className="input-area">
                <form div className="input-box" onSubmit={(event) => autenticate(event)}>
                    <div className="title">
                        <h1>ConversaTech</h1>
                        <span>Faça o login para continuar!</span>
                    </div>
                    <div className="inputarea">
                        <label>Email</label>
                        <input type="text"
                               placeholder="xxxxx@xxxx.com" 
                               value={email} 
                               onChange={(e) => setEmail(e.target.value)}/>
                    </div>

                    <div className="inputarea">
                        <label>Senha</label>
                        <div className="inputSenha">
                                <input type={tipoSenha}
                                       placeholder="******" 
                                       value={senha}
                                       onChange={(e) => setSenha(e.target.value)}/>
                                <FaRegEyeSlash color='#235789' onClick={showSenha} size={20} cursor="pointer"/>
                            </div>
                    </div>

                    <div className='btnRespo'>
                        <button className="login-btn" type='submit'>Login</button>
                        <Link to='/register' className='register-btn'>Registrar</Link>
                    </div>
                </form>
            </div>
            <ToastContainer/>
        </div>
    )
}
