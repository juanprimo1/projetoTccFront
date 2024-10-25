import "./oldPedido.css";
import "../NewPizzaForm/newPizza.css";

import { FaPizzaSlice } from "react-icons/fa";
import { FaBeer } from "react-icons/fa";

import { useEffect, useState } from "react";
import api from "../../Service/api";
import { toast } from "react-toastify";

export default function OldPedido(props) {

    const [pedido, setPedido] = useState({})

    async function getLastPedido() {
        await api.get(`user/find/${localStorage.getItem("@email")}`)
        .then(async (u)=> {
            let user = u.data;
            await api.get(`pedidos/ultimo-pedido/${user.id}`).then((p) => setPedido(p.data)).catch((e) => toast.error(e.message))
        })
        .catch((e) => toast.error(e.message))
    }

    useEffect(() =>{
        function hidePizza() {
            
            if (props.hidden) {
                document.getElementById("pizza-form").setAttribute("class", "pizza-modal-hidden");
                return;
            }
            
            document.getElementById("pizza-form").setAttribute("class", "pizza-modal");
            getLastPedido();     
        }

        hidePizza();
    }, [props.hidden])


    async function submitPedido() {
        
    }

    return (
        <div id="pizza-form" className="pizza-modal">
            <form onSubmit={submitPedido}>
                <div className="inputs">
                    <div className="item-pizza">
                        <FaPizzaSlice size={20}/>
                        <span>teste pizza</span>
                    </div>
                    <div className="item-pizza">
                        <FaBeer size={20}/>
                        <span>teste bebida</span>
                    </div>
                </div>
                <button type="submit" className="login-btn">
                    Finalizar pedido
                </button>
            </form>
        </div>
    )
}