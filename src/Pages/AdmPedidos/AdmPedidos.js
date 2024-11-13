import { useNavigate } from "react-router-dom";
import "../Adm/adm.css"
import "./admPedidos.css"
import { useEffect, useState } from "react";
import api from "../../Service/api";
import { toast } from "react-toastify";

export default function AdmPedidos() {
    const navigate = useNavigate();
    const [pedidos, setPedidos] = useState([]);
    const [pizzaPedidos, setPizzaPedidos] = useState([]);

    useEffect(() => {
        async function getAllPedidos() {
            await api.get("/pedidos/get-all")
            .then((data) => {
                setPedidos(data.data);
            })
            .catch((error) => {
                console.log(error);
            })
            console.log(pedidos)
        }

        getAllPedidos();
    }, [])

    async function handleDeletePedido(idPedido) {
        await api.delete("/pedidos/" + idPedido)
        .then(() => {
            toast.success("Pedido Excluido com sucesso!")
        })
        .catch((error) => {
            console.log(error)
        })
    }

    return(
        <div className="container-geral">
            <button className="btn-voltar-home" onClick={() => navigate("/adm-area")}>Voltar</button>
            <div className="title-adm">
                <h1>Pedidos 🍕</h1>
                <span>Acompanhe os pedidos que foram realizados para manter a organização da Pizzaria!</span>
            </div>
            <div className="pedidos-area" >
                {pedidos.map((p) => (
                    <div className="card-pedidos">
                        <h2> Pedido #{p.codigoPedido}</h2>
                        <div className="itens">
                            {p.itensPedido.map((ip) => (
                                <div className="item">
                                    <div className="pizza-area"> 
                                        <span>{ip.pizza.nomePizza}</span>
                                        <p>{ip.pizza.ingredientes}</p>
                                    </div>
                                    <div className="bebida-area"> 
                                        <span>{ip.bebidas.bebida}</span>
                                    </div>
                                </div>    
                            ))}
                            
                        </div>    
                        <span>R$ {p.valorPedido.toFixed(2)}</span>
                        <button onClick={() => handleDeletePedido(p.codigoPedido)}>Excluir</button>
                    </div>
                ))}
            </div>
        </div>    
    );
}