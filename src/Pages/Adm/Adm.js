import { useState } from "react"
import "./adm.css"
import "../Login/login.css"
import 'react-toastify/dist/ReactToastify.css'
import api from "../../Service/api";
import { ToastContainer, toast } from "react-toastify";

export default function Adm() {

    const [nomePizza, setNomePizza] = useState("");
    const [ingredientes, setIngredientes] = useState("");
    const [valor, setValor] = useState(0);

    const [nomeBebida, setNomeBebida] = useState("");
    const [valorBebida, setValorBebida] = useState(0);

    const [response, setResponse] = useState({})

    async function cadastraPizza() {

        if (nomePizza === "" || ingredientes === "" || valor === 0) {
            toast.error("Todos os campos devem ser preenchidos!")
        }
        else{

            await api.post("/pizza", {
                nomePizza: nomePizza,
                ingredientes: ingredientes,
                valorPizza : valor
            }).then((res) => {
                setResponse(res.data)
                console.log(res.data)
                toast.success("Pizza Registrada")
            }).catch((error) => {
                toast.error(error)
            })

        }
    }

    async function cadastraBebida() {

        if (nomeBebida === "" || valorBebida === 0) {
             toast.error("Todos os campos devem ser preenchidos!")
            return
        }
        else {
            await api.post("/bebida", {
                bebida: nomeBebida,
                valorBebida
            }).then(() => {
                toast.success("Bebida criada com sucesso!")
            }).catch((error) => {
                toast.error(error);
            })
        }
    }

    return (
       <div className="container-geral">
            <div className="title">
                <h1>Área administrativa 🔒</h1>
                <span>Realize aqui o cadastro de novas pizzas e/ou bebidas ao cardápio!</span>
            </div>

            <div className="container-adm">
                <div className="form-area">
                    <h2>Cadastre uma nova Pizza</h2>
                    <form onSubmit={cadastraPizza}>
                        <div className="inputarea">
                            <label>Nome da pizza</label>
                            <input type="text" value={nomePizza} onChange={(e) => setNomePizza(e.target.value)}/>
                        </div>
                        <div className="inputarea-text">
                            <label>Ingredientes</label>
                            <textarea value={ingredientes} onChange={(e) => setIngredientes(e.target.value)}/>
                        </div>
                        <div className="inputarea">
                            <label>Valor</label>
                            <input type="text" value={valor} onChange={(e) => setValor(e.target.value)}/>
                        </div>

                        <div className="btnForm">
                            <button className="login-btn" type="submit">Cadastrar</button>
                        </div>
                    </form>
                </div>

                <div className="form-area">
                    <h2>Cadastre uma nova Bebida</h2>
                    <form onSubmit={cadastraBebida}>
                        <div className="inputarea">
                            <label>Bebida</label>
                            <input type="text" value={nomeBebida} onChange={(e) => setNomeBebida(e.target.value)}/>
                        </div>
                        <div className="inputarea">
                            <label>Valor</label>
                            <input type="text" value={valorBebida} onChange={(e) => setValorBebida(e.target.value)}/>
                        </div>

                        <div className="btnForm">
                            <button className="login-btn" type="submit">Cadastrar</button>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer/>
       </div>
    )
}