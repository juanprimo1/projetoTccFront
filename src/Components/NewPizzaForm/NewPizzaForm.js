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

    const [pizzaCodigo, setPizzaCodigo] = useState(null);
    const [bebida, setBebida] = useState(null);
    const [quantidadePizza, setQuantidadePizza] = useState(1);
    const [quantidadeBebida, setQuantidadeBebida] = useState(1);
    const [observacao, setObservacao] = useState("")
    var itensPedido = [];

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
            })  
            .catch((error) => {
                toast.error(error.message);
            })
    }

    async function getBebidas() {

        await api.get("bebidas")
            .then((res) => {
                setBebidas(res.data);
            })  
            .catch((error) => {
                toast.error(error.message);
            })
    }

    async function addPedido() {

        await api.get(`pizza/${pizzaCodigo}`)
        .then((res) => {
            setPizzaNew(res.data);
        })
        .catch((error) => toast.error(error.message))

        await api.get(`bebidas/${bebida}`)
        .then((res) => {
            setBebidaNew(res.data);
        })
        .catch((error) => toast.error(error.message))

        itensPedido.push({
            pizza: pizzaNew,
            bebidas: bebidaNew
        })
    }

    async function submitPedido() {
        let valorPedido = 0;

        itensPedido.map((ip) => {
            valorPedido += (ip.pizza.valorPizza + ip.bebida.valorBebida)
        })

        if (pizzaNew !== null && bebidaNew !== null)
            await api.post('pedido',{
                valorPedido: valorPedido,
                informacaoAdicional: observacao,
                codigoUsuario: props.userId,
                itensPedido: itensPedido
            })
            .then(() => toast.success("Pedido Registrado com sucesso!"))
            .catch(() => toast.error((error) => toast.error(error.message)))
    }

    return(
        <div id="pizza-form" className="pizza-modal">
                <form onSubmit={submitPedido}>
                    <FontAwesomeIcon onClick={() => document.getElementById("pizza-form").setAttribute("class", "pizza-modal-hidden")} className="cancel" icon={faCircleXmark} />
                    <div className="inputs">
                        <div className="inputarea">
                            <label>Pizza</label>
                            <div className="multi-value">
                                <select value={pizzaCodigo} onChange={(e) => setPizzaCodigo(e.target.value)}>
                                    {pizzas.map((p) => (
                                        <option value={p.codigoPizza}>
                                            {p.nomePizza}
                                        </option>
                                    ))}
                                </select>
                                <input type="number" value={quantidadePizza} onChange={(e) => setQuantidadePizza(e.target.value)} min={1} step={1}/>
                            </div>
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
                        <button onClick={addPedido} className="login-btn">
                            Adicionar ao carrinho <FaCartPlus size={15} />
                        </button>
                    </div>
                    <button type="submit" className="login-btn">
                        Finalizar pedido
                    </button>
                </form>
            
        </div>
    );
}