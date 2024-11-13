import { useEffect, useState } from "react";
import api from "../../Service/api";
import { toast} from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaCartPlus } from "react-icons/fa";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

import "./newPizza.css";
import "../../Pages/Login/login.css";

export default function NewPizzaForm(props) {

    
    const [pizzaNew, setPizzaNew] = useState({});
    const [bebidaNew, setBebidaNew] = useState({})

    const [pizzaCodigo, setPizzaCodigo] = useState("");
    const [bebida, setBebida] = useState("");
    const [quantidadePizza, setQuantidadePizza] = useState(1);
    const [quantidadeBebida, setQuantidadeBebida] = useState(1);
    const [observacao, setObservacao] = useState("")
    const [itensPedido, setItensPedido] = useState([]);
    const [pizzaDescription, setPizzaDescription] = useState("");

    const [pizzas, setPizzas] = useState([]);
    const [bebidas, setBebidas] = useState([]);

    useEffect(() =>{
        function hidePizza() {
            
            if (props.hidden) {
                document.getElementById("pizza-form").setAttribute("class", "pizza-modal-hidden");
                return;
            }
        
            document.getElementById("pizza-form").setAttribute("class", "pizza-modal");     
            getPizzas();
            getBebidas();
        }

        hidePizza();
    }, [props.hidden])

    async function getPizzas() {
        await api.get("pizza")
            .then((res) => {
                setPizzas(res.data)
                setPizzaCodigo(res.data[0].codigoPizza)
            })  
            .catch((error) => {
                toast.error(error.message);
            })
    }

    async function getBebidas() {

        await api.get("bebidas")
            .then((res) => {
                setBebidas(res.data);
                setBebida(res.data[0].codigoBebida)
            })  
            .catch((error) => {
                toast.error(error.message);
            })
    }

    async function addPedido() {
        try {

            if (pizzaCodigo === "" || bebida === "") {
                toast.error("Opções faltantes!")
                return;
            }
            const [pizzaResponse, bebidaResponse] = await Promise.all([
                api.get(`pizza/${pizzaCodigo}`),
                api.get(`bebidas/${bebida}`)
            ]);
    
            setPizzaNew(pizzaResponse.data);
            setBebidaNew(bebidaResponse.data);
    
            setItensPedido(prevItens => [
                ...prevItens, 
                {
                    pizza: pizzaResponse.data,
                    bebidas: bebidaResponse.data,
                    quantidadePizza,
                    quantidadeBebida
                }
            ]);
    
            toast.success("Item adicionado ao carrinho!");
        } catch (error) {
            toast.error(error.message);
        }
    }

    async function submitPedido(event) {
        console.log(itensPedido)
        event.preventDefault()
        let valorPedido = 0;

        itensPedido.map((ip) => {
            valorPedido += (ip.pizza.valorPizza + ip.bebidas.valorBebida)
        })

        console.log(valorPedido)
        if (pizzaNew !== null && bebidaNew !== null)
            await api.post('pedidos',{
                valorPedido: valorPedido,
                informacaoAdicional: observacao,
                codigoUsuario: props.user,
                itensPedido: itensPedido
            })
            .then(() => toast.success("Pedido Registrado com sucesso!"))
            .catch(() => toast.error((error) => toast.error(error.message)))
    }

    return(
        <div id="pizza-form" className="pizza-modal">
                <form onSubmit={(event) => submitPedido(event)}>  
                <FontAwesomeIcon onClick={() => {
                        document.getElementById("pizza-form").setAttribute("class", "pizza-modal-hidden")
                        props.sair()
                        }} className="cancel" icon={faCircleXmark} />
                    <div className="inputs">
                        <div className="inputarea">
                            <label>Pizza</label>
                            <div className="multi-value">
                                <select value={pizzaCodigo} onChange={(e) =>  {
                                    setPizzaCodigo(e.target.value)
                                    pizzas.map((p) => {
                                        if (p.codigoPizza === e.target.value)
                                            setPizzaDescription(p.ingredientes);
                                    })
                                    }}>
                                    {pizzas.map((p) => (
                                        <option value={p.codigoPizza}>
                                            {p.nomePizza}
                                        </option>
                                    ))}
                                </select>
                                <input type="number" value={quantidadePizza} onChange={(e) => setQuantidadePizza(e.target.value)} min={1} step={1}/>
                            </div>
                        </div>

                        <div className="desc-pizza">
                            <span>{pizzaDescription}</span>
                        </div>

                        <div className="inputarea">
                            <label>Bebida</label>
                            <div className="multi-value">
                                <select value={bebida} onChange={(e) => setBebida(e.target.value)}>
                                    {bebidas.map((b) => (
                                        <option value={b.codigoBebida}>
                                            {b.bebida}
                                        </option>
                                    ))}
                                </select>
                                <input type="number" value={quantidadeBebida} onChange={(e) => setQuantidadeBebida(e.target.value)} min={1} step={1}/>
                            </div>
                        </div>
                        <div className="inputarea">
                            <label>informacao Adicional</label>
                                <textarea value={observacao} onChange={(e) => setObservacao(e.target.value)}/>
                        </div>
                        <button type="button" onClick={() => addPedido()} className="login-btn">
                            Adicionar ao carrinho <FaCartPlus size={15} />
                        </button>
                    </div>
                    <button type="submit" disabled={itensPedido.length === 0 ? true : false} className={itensPedido.length === 0 ? "login-btn-blocked" : "login-btn"}>
                        Finalizar pedido
                    </button>
                </form>
            
        </div>
    );
}