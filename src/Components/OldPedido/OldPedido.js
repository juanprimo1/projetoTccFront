import "./oldPedido.css";
import 'react-toastify/dist/ReactToastify.css';

import { FaPizzaSlice } from "react-icons/fa";
import { FaBeer } from "react-icons/fa";

import { useEffect, useState } from "react";
import api from "../../Service/api";
import { toast, ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

export default function OldPedido(props) {

    const [pedido, setPedido] = useState({})
    const [user, setUser] = useState({});
    const userId = localStorage.getItem("@userId")
    const [firstPedido, setFirstPedido] = useState(false)

    useEffect(() =>{
        function hidePizza() {
            console.log(props.hidden)
            
            if (props.hidden) {
                document.getElementById("pizza-form-old").setAttribute("class", "pizza-modal-hidden-old");
                return;
            }
            
            document.getElementById("pizza-form-old").setAttribute("class", "pizza-modal-old");     
        }

        hidePizza();
        getLastPedido();
        
    }, [props.hidden])

    async function getLastPedido() {
        
        try {
            const user = await verifyPedidosUser(); // Aguarda a função para obter o usuário
            if (user) {
                const response = await api.post(`pedidos/ultimo-pedido/${user.codigoUsuario}`);
                setPedido(response.data); // Seta o pedido após a resposta
            }
        } catch (error) {
            console.log(error)
            //toast.error(error.response.data.message || "Erro ao buscar pedido");
            setFirstPedido(true);
        }

        console.log(pedido)
    }

    async function submitPedido(event) {
        event.preventDefault()

         await api.post('pedidos',{
             valorPedido: pedido.valorPedido,
             informacaoAdicional: pedido.informacaoAdicional,
             codigoUsuario: props.user,
             itensPedido: pedido.itensPedido
         })
         .then(() => toast.success("Pedido Registrado com sucesso!"))
         .catch(() => toast.error((error) => toast.error(error.response.data.message)))
    }

    async function verifyPedidosUser() {
        try {
            const response = await api.get(`user/find/${userId}`);
            setUser(response.data); // Atualiza o estado do usuário
            return response.data; // Retorna o usuário para ser usado no getLastPedido
        } catch (error) {
            toast.error("Erro ao buscar usuário");
        }
    }

    return (
        <div id="pizza-form-old" className="pizza-modal-old">
            {firstPedido ? (
            <>
                <div className="card-oldpedido">
                    <FontAwesomeIcon onClick={() => {
                        document.getElementById("pizza-form-old").setAttribute("class", "pizza-modal-hidden-old")
                        props.sair()
                        }} className="cancel" icon={faCircleXmark} />
                    <h2>Ops... Parece que esse é seu primeiro Pedido!</h2>
                </div>
            </>) : (
                <form onSubmit={submitPedido}>
                    <FontAwesomeIcon onClick={() => {
                        document.getElementById("pizza-form-old").setAttribute("class", "pizza-modal-hidden-old")
                        props.sair()
                        }} className="cancel" icon={faCircleXmark} />
                    <h2>Repetir Pedido</h2>
                    <div className="inputs">
                        <label className="pizza-title">Pedido #{Object.keys(pedido).length > 0 ? pedido.codigoPedido : "noData" }</label>
                        <div className="pizzas-area">
                            <label className="pizza-title"><FaPizzaSlice size={20} /> Pizzas:</label>
                            {Object.keys(pedido).length > 0 ? pedido.itensPedido.map((ip) => (
                                <label className="pizzaname">{ip.pizza.nomePizza}</label>
                            )) : <></>}
                            
                        </div>
                        
                        <div className="pizzas-area">
                            <label className="pizza-title"><FaBeer size={20} /> Bebidas:</label>
                            {Object.keys(pedido).length > 0 ? pedido.itensPedido.map((ip) => (
                                <label className="pizzaname">{ip.bebidas.bebida}</label>
                            )) : <></>}
                        </div>
                        
                    </div>
                    <button type="submit" className="login-btn">
                        Finalizar pedido
                    </button>
            </form>
            )}
            <ToastContainer />
        </div>
    )
}