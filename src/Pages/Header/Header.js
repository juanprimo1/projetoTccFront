import "./header.css"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import api from "../../Service/api";

export default function Header(props) {

    const navigate = useNavigate();
    const userId = localStorage.getItem("@userId");
    const [adm, setAdm] = useState(false);
    const [lockVisible, setLockVisible] = useState(false);

    useEffect(() => {
        async function liberarAdm() {
            await isAdm();

            if (adm)
                setLockVisible(true)
        }

        liberarAdm();
    }, [adm])

    function sair() {
        localStorage.clear();
        navigate('/')
    }

    async function isAdm() {
        try {
            const response = await api.get(`user/find/${userId}`);

            setAdm(response.data.adm === 1); // Atualiza o estado do usuário
        } catch (error) {
            console.log("Erro ao buscar usuário");
        }
    }
    
    return(
        <header>
            <div className="title-header">
                <span>Pizza</span>
            </div>

            <div className="title-header">
                <span>{props.name} 👤</span>
                { lockVisible ? <FontAwesomeIcon onClick={() => navigate("/adm-area")} size="xl" icon={faLock}/> : <></>}
                <button onClick={() => sair()}>Sair</button>
            </div>
        </header>
    );
}