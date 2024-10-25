import { Navigate } from "react-router-dom"
import { useState, useEffect } from "react"
import api from "./Service/api";

export default function PrivateAdm({ children }) {
    
    const [loading, setloading] = useState(true)
    const [signed, setSigned] = useState(false);
    const userId = localStorage.getItem("@userId");

    useEffect(() => {
       async function isSigned() {

            const adm = await isAdm();
            const authorized = localStorage.getItem("@active")
           // Se autorizado for "true", usuário está autenticado
            if (authorized === "true") {
                console.log("private", adm)

                if (adm)
                    setSigned(true);

            } else {
                setSigned(false); // Usuário não autenticado
            }
            
            setloading(false);
        }
        
        isSigned();
    }, [])

    async function isAdm() {
            try {
                const response = await api.get(`user/find/${userId}`);
                console.log(response.data)
                return response.data.adm === 1; // Atualiza o estado do usuário
            } catch (error) {
                console.log("Erro ao buscar usuário");
            }
    }

    if(loading){
        return(
            <div>
                
            </div>
        );
    }

    if(!signed){
         return <Navigate to="/home" />;
    }

    return children
}