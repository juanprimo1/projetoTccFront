import { useEffect, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import robo from "../../Assets/robozinho.png";
import { toast } from "react-toastify";
import NewPizzaForm from "../../Components/NewPizzaForm/NewPizzaForm";
import "./chatBot.css"


export default function ChatBot() {
    
    const [option, setOption] = useState("");
    const [pizzas, setPizzas] = useState([]);

    const [isNewPizza, setIsNewPizza] = useState(false);
    const [isRepetirPedido, setIsRepetirPedido] = useState(false);

    const [history, setHistory] = useState([]);
    const [dialog, setDialog] = useState([{question: "Qual operação você deseja fazer?", answers: ["Novo pedido", "Repetir pedido", "Sair"]}])

    const decisionTree = {
        question: "Qual operação você deseja fazer?",
        answers: {
            "Novo pedido": {
                question: "Deseja montar seu pedido?",
                answers: {
                    "Sim": newPedido,
                    "Não": sair
                }
            },
            "Repetir pedido": { question: "Deseja repetir seu último pedido:", answers: { "Sim": repetirPedido, "Não": sair} },
            "Sair": "Você saiu do sistema."
        }
    };

    const [currentNode, setCurrentNode] = useState(decisionTree);
    const handleAnswer = (answer) => {
        const nextNode = currentNode.answers[answer];
       // console.log(history)
        console.log("Resposta: ", answer)
        console.log("Next node: ",nextNode)
        console.log("current node: ", currentNode)
        console.log("Dialog", dialog)
        if (nextNode ===  undefined) {
            alert("Opção inválida!");
            return
        }
        
        if (typeof nextNode === 'string') {
            // Se a resposta for uma string, significa que é uma mensagem final.
            alert(nextNode); // Você pode substituir isso por outra forma de exibir a mensagem final
            setCurrentNode(decisionTree); // Volta para a árvore inicial ou qualquer outro estado que você desejar
        } else if (typeof nextNode === 'function') {
            // Se for uma função, executa a função correspondente
            nextNode();
        } else {
            // Caso contrário, navega para o próximo nó da árvore
            setCurrentNode(nextNode);
            setDialog([...dialog, { question: nextNode.question, answers:Object.keys(nextNode.answers) }])
        }
        
        setHistory([...history, { question: currentNode.question, answers: currentNode.answers }]);
    };

    function repetirPedido() {
        alert("Repetir pedido")
        setIsRepetirPedido(true)
    }

    function sair() {
        setDialog([{question: "Qual operação você deseja fazer?", answers: ["Novo pedido", "Repetir pedido", "Sair"]}])
        setHistory([]);
        setOption("")
        alert("sair")
    }

    function newPedido() {
        alert("new pedido")
        setIsNewPizza(true);
    }

    return(
        <div className="container">
            <div className="dialog">
                {dialog.map((d) => (
                    <>
                        <div className="text-bot">
                            <img src={robo} className="robo-figure"/>
                            <div className="text-area" >
                                <span>{d.question}</span>
                                {d.answers.map((a) => (
                                    <>
                                        <span>- {a}</span>
                                    </>
                                ))}
                            </div>
                        </div>
                        <div className="text-user">
                            <div className="text-area-user" >
                                <span>resposta resposta resposta resposta resposta</span>
                            </div>
                        </div>
                    </>
                ) )}
                
                <NewPizzaForm hidden={!isNewPizza} />
                <div className="response-field">
                    <input type="text" value={option} onChange={(e) => setOption(e.target.value)} />
                    <button onClick={() => handleAnswer(option)}>
                        <FaPaperPlane size={25} />
                    </button>
                </div>
            </div>
        </div>
       
    );
}