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
    const [bebidas, setBebidas] = useState([]);
    const [show, setShow] = useState(false);
    const [isAdm, setIsAdm] = useState(false);
    const userId = localStorage.getItem("@userId")

    const navigate = useNavigate();
    useEffect( ()=>{

        async function getBebidas() {
            await api.get("/bebidas")
            .then((response) => {
                setBebidas(response.data)
            })
        }

        async function getData() {
            await api.get("/pizza")
            .then((response) => {
                setPizzas(response.data)
                toast.success("Seja bem vindo!")
            }).catch(() => {
                toast.error("Erro ao carregar dados!")
            })
        }

        async function isAdm() {
            try {
                const response = await api.get(`user/find/${userId}`);
    
                setIsAdm(response.data.adm === 1); // Atualiza o estado do usuário
            } catch (error) {
                console.log("Erro ao buscar usuário");
            }
        }
        
        getData();
        getBebidas();
        isAdm()
        
    }, [])

    async function handleDeletePizza(id) {
        await api.delete("/pizza/" + id)
        .then(() => {
            toast.success("Pizza Deletada com sucesso!");
        })
        .catch((error) => {
            console.log(error)
        })
    }

    async function handleDeleteBebida(id) {
        await api.delete("/bebidas/" + id)
        .then(() => {
            toast.success("Bebida Deletada com sucesso!");
        })
        .catch((error) => {
            console.log(error)
        })
    }

    return (
        <>
            <Header name={localStorage.getItem("@userCredential")} />
            <body>
                <div className="container-feed">
                    <h1>Pizzas</h1>
                    <div className="feed">

                        {pizzas.map((p) => (
                            <div className="card">
                                <div className="image">
                                    <img src={p.imagem !== null ? `data:image/png;base64,${p.imagem}` : pizza} alt="imagem de Pizza"/>
                                </div>
                                <div className="infos">
                                    <h2>{p.nomePizza}</h2>
                                    <p>{p.ingredientes}</p>
                                    <span>R${p.valorPizza}.00</span>
                                    <button className={isAdm ? "deletar" : "deletar-hidden"} onClick={() => handleDeletePizza(p.codigoPizza)}>Excluir</button>
                                </div>
                            </div>

                        ))}

                    </div>
                    <h1>Bebidas</h1>
                    <div className="feed">

                        {bebidas.map((p) => (
                            <div className="card">
                                <div className="image">
                                    <img src={p.imgBebida !== null ? `data:image/png;base64,${p.imgBebida}` : pizza} alt="imagem de Pizza"/>
                                </div>
                                <div className="infos">
                                    <h2>{p.bebida}</h2>
                                    <span>R${p.valorBebida}.00</span>
                                    <button className={isAdm ? "deletar" : "deletar-hidden"} onClick={() => handleDeleteBebida(p.codigoBebida)}>Excluir</button>
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