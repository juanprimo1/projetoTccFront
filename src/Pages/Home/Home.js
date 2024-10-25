import Header from "../Header/Header";
import pizza from "../../Assets/pizzaTeste.jpg";
import robo from "../../Assets/robozinho.png";
import 'react-toastify/dist/ReactToastify.css';
import "./home.css"
import { useEffect, useState } from "react";
import api from "../../Service/api";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ChatBot from "../ChatBot/ChatBot";

export default function Home() {

    const [pizzas, setPizzas] = useState([]);
    const [show, setShow] = useState(false)
    const navigate = useNavigate();
    useEffect( ()=>{

        async function getData() {
            await api.get("/pizza")
            .then((response) => {
                setPizzas(response.data)
                toast.success("Seja bem vindo!")
            }).catch(() => {
                toast.error("Erro ao carregar dados!")
            })
        }
        
        getData();
        
    }, [])

    return (
        <>
            <Header name={localStorage.getItem("@userCredential")} />
            <body>
                <div className="container-feed">
                    <div className="feed">

                        {pizzas.map((p) => (
                            <div className="card">
                                <div className="image">
                                    <img src={pizza} alt="imagem de Pizza"/>
                                </div>
                                <div className="infos">
                                    <h2>{p.nomePizza}</h2>
                                    <p>{p.ingredientes}</p>
                                    <span>R${p.valorPizza}.00</span>
                                </div>
                            </div>

                        ))}

                    </div>
                </div>
                <div className="robo-area">
                    <div className="conteudo-robo">
                        <img src={robo} alt="imagem-robo"/>
                        <button onClick={() => setShow(true)}>Faça seu pedido</button> 
                    </div>     
                </div>
                <ChatBot show={show} />
            </body>
            <ToastContainer />
        </>
    );
}