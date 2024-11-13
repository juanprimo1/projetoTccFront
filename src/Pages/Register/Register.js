import "../Login/login.css"
import 'react-toastify/dist/ReactToastify.css';

import {  useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEyeSlash } from "react-icons/fa";
import api from "../../Service/api";
import { ToastContainer, toast } from "react-toastify";

export default function Register() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [nome, setNome] = useState("");
    const [telefone, setTelefone] = useState("");
    const [tipoSenha, setTipoSenha] = useState("password");
    const [user, setUser] = useState({})

    const navigate = useNavigate();

    function showSenha() {
        if(tipoSenha === "password")
            setTipoSenha("text")
        else 
            setTipoSenha("password")
    }

    async function register(event) {
        event.preventDefault();

        if (nome === "" || email === "" || senha === "")
            toast.error("Preencha os campos Obrigatórios!")
        else {
            let usuario = {
                nomeUsuario: nome,
                email: email,
                senha: senha,
                telefone: telefone, 
            }

            await api.post('user/register', usuario, {
                headers: {
                  'Content-Type': 'application/json',
                },
            })
            .then((data) => {
                localStorage.setItem("@userCredential", nome)
                localStorage.setItem("@active", true)
                localStorage.setItem("@userId", data.data.codigoUsuario)
            navigate('/home') 
            })
            .catch((e) => {
                toast.error(e.response.data.message)
                return;
            })

        
        }

    }

        return (
            <div className="container">
                <div className="input-area">
                    <form div className="input-box" onSubmit={(event) => register(event)}>
                        <div className="title">
                            <h1>PIZZA</h1>
                            <span>Seja bem vindo! Crie sua conta.</span>
                        </div>

                        <div className="inputarea">
                            <label>Nome *</label>
                            <input type="text"
                                   placeholder="Seu nome" 
                                   value={nome} 
                                   onChange={(e) => setNome(e.target.value)}/>
                        </div>

                        <div className="inputarea">
                            <label>Telefone</label>
                            <input type="text"
                                   placeholder="(xx)xxxxx-xxxx" 
                                   value={telefone} 
                                   onChange={(e) => setTelefone(e.target.value)}/>
                        </div>

                        <div className="inputarea">
                            <label>Email *</label>
                            <input type="text"
                                   placeholder="xxxxx@xxxx.com" 
                                   value={email} 
                                   onChange={(e) => setEmail(e.target.value)}/>
                        </div>
    
                        <div className="inputarea">
                            <label>Senha *</label>
                            <div className="inputSenha">
                                <input type={tipoSenha}
                                       placeholder="******" 
                                       value={senha}
                                       onChange={(e) => setSenha(e.target.value)}/>
                                <FaRegEyeSlash color='#235789' onClick={showSenha} size={20} cursor="pointer"/>
                            </div>
                        </div>
    
                        <div className='btnRespo'>
                            <Link to='/' className="login-btn">Login</Link>
                            <button type='submit' className='register-btn'>Registrar</button>
                        </div>
                    </form>
                </div>
                <ToastContainer />
            </div>
    );
}