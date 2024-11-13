import { useEffect, useRef, useState } from "react"
import "./adm.css"
import "../Login/login.css"
import 'react-toastify/dist/ReactToastify.css'
import api from "../../Service/api";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Adm() {

    const [nomePizza, setNomePizza] = useState("");
    const [ingredientes, setIngredientes] = useState("");
    const [valor, setValor] = useState(0);
    const [userId, setUserId] = useState(0);

    const [fileName, setFileName] = useState("");
    const [fileBebidaName, setFileBebidaName] = useState("");
    const fileInputRef = useRef(null);
    const fileInputRefBebida = useRef(null);

    const [nomeBebida, setNomeBebida] = useState("");
    const [valorBebida, setValorBebida] = useState(0);

    const [bebidaImage, setBebidaImage] = useState("");
    const [pizzaImage, setPizzaImage] = useState("");

    const [users, setUsers] = useState([]);

    const [response, setResponse] = useState({})
    const navigate = useNavigate();

    useEffect(() => {
        async function findUsers() {
            await api.get("/user/all")
            .then((res) => setUsers(res.data))
            .catch((error) => console.log(error))
        }

        findUsers();
    }, [])

    async function cadastraPizza(e) {
        e.preventDefault()

        if (nomePizza === "" || ingredientes === "" || valor === 0) {
            toast.error("Todos os campos devem ser preenchidos!")
        }
        else{

            await api.post("/pizza", {
                nomePizza: nomePizza,
                ingredientes: ingredientes,
                valorPizza : valor,
                imagem: pizzaImage
            }).then((res) => {
                setResponse(res.data)
                toast.success("Pizza Registrada")
                setPizzaImage("");
                setNomePizza("");
                setValor(0);
                setIngredientes("")
            }).catch((error) => {
                toast.error(error)
            })

        }
    }

    async function cadastraBebida() {
        console.log()

        if (nomeBebida === "" || valorBebida === 0) {
             toast.error("Todos os campos devem ser preenchidos!")
            return
        }
        else {
            await api.post("/bebidas", {
                bebida: nomeBebida,
                valorBebida,
                imgBebida: bebidaImage
            }).then(() => {
                toast.success("Bebida criada com sucesso!")
                setBebidaImage("");
                setNomeBebida("");
                setNomeBebida("");
            }).catch((error) => {
                toast.error(error.response.data.message);
            })
        }
    }

    async function cadastraAdm(e) {
        e.preventDefault();

        await api.put("/user/new-adm/" + userId)
        .then((d) => {
            toast.success("Usuário agora é um ADM!")
        })
        .catch((e) => {
            toast.error(e.response.data.message);
        })
    }

    const handleImageChange = (e) => {
        e.preventDefault()
        const file = e.target.files[0];
        if (file) {
          setFileBebidaName(file.name);
          const reader = new FileReader();
          reader.onloadend = () => {
            setBebidaImage(reader.result.split(',')[1]); // Remove o prefixo 'data:image/png;base64,'
          };
          reader.readAsDataURL(file);
        }
      };

      const handleImageChangePizza = (e) => {
        const file = e.target.files[0];
    
        if (file) {
          setFileName(file.name); // Armazena o nome do arquivo para exibir no label
          const reader = new FileReader();
          reader.onloadend = () => {
            setPizzaImage(reader.result.split(',')[1]); // Remove o prefixo 'data:image/png;base64,'
          };
          reader.readAsDataURL(file);
        }
      };

    return (
       <div className="container-geral">
            <button className="btn-voltar-home" onClick={() => navigate("/home")}>Sair</button>
            <button className="btn-pedidos-adm" onClick={() => navigate("/pedidos")}>Pedidos</button>
            <div className="title-adm">
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
                        <div className="inputarea" >
                            <input ref={fileInputRef} className="fileinput" type="file" onChange={(e) => handleImageChangePizza(e)}/>
                            <label onClick={() => fileInputRef.current.click()} for="fileInput" class="file-label">{fileName === "" ? "Escolha uma Imagem para a Pizza" : fileName}</label> 
                        </div>

                        <div className="btnForm">
                            <button className="login-btn" type="submit">Cadastrar</button>
                        </div>
                    </form>
                </div>

                <div className="form-area">
                    <h2>Cadastre um novo Administrador</h2>
                    <form onSubmit={cadastraAdm}>
                        <div className="inputarea">
                            <label>Usuário</label>
                            <select onChange={(e) => setUserId(e.target.value)} value={userId}>
                                {users.map((u) => (
                                    <option value={u.codigoUsuario}>{u.nomeUsuario}</option>
                                ))}
                            </select>
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
                        <div className="inputarea">
                        <input ref={fileInputRefBebida} className="fileinput" type="file" onChange={(e) => handleImageChange(e)}/>
                        <label onClick={() => fileInputRefBebida.current.click()} for="fileInput" class="file-label">{fileBebidaName === "" ? "Escolha uma Imagem para a Bebida" : fileBebidaName}</label>
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