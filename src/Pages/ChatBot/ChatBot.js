import React, { useEffect, useState } from 'react';
import NewPizzaForm from '../../Components/NewPizzaForm/NewPizzaForm';
import OldPedido from '../../Components/OldPedido/OldPedido';
import robo from "../../Assets/robozinho.png";
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import 'react-confirm-alert/src/react-confirm-alert.css';

import "./chatBot.css"
import { toast, ToastContainer } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

export default function ChatBot(props) {

    const [isNewPizza, setIsNewPizza] = useState(false);
    const [isRepetirPedido, setIsRepetirPedido] = useState(false);
    const [saiuModal, setSaiuModal] = useState(false);
    const [actualAnswer, setActualAnswer] = useState("")
    const [dialog, setDialog] = useState([
        {
            sender: "bot",
            question: "Qual operação você deseja fazer?",
            answers: ["Novo pedido", "Repetir pedido", "Voltar"],
            indexes: [1, 2, 3]
        }
    ]);

    const handleButtonClick = () => {
        setSaiuModal(true)
        // Outras ações a serem executadas na página
      };

    useEffect(() => {
       function voltarAposFechar() {
            console.log("saiu modal", saiuModal)

            if (saiuModal) {
                setDialog([
                    {
                        sender: "bot",
                        question: "Qual operação você deseja fazer?",
                        answers: ["Novo pedido", "Repetir pedido", "Voltar"],
                        indexes: [1, 2, 3]
                    }
                ]);
                
                setActualAnswer("");
                setHistory([]);
                setCurrentNode(decisionTree)
            }
       }

       voltarAposFechar();
    }, [saiuModal])

    // Árvore de decisão
    const decisionTree = {
        question: "Qual operação você deseja fazer?",
        answers: {
            "Novo pedido": {
                question: "Deseja montar seu pedido?",
                answers: {
                    "Sim": newPedido,
                    "Não": goBack
                }
            },
            "Repetir pedido": {
                question: "Deseja repetir seu último pedido?",
                answers: {
                    "Sim": repetirPedido,
                    "Não": goBack
                }
            },
            "Sair": goBack
        }
    };

    const [currentNode, setCurrentNode] = useState(decisionTree);
    const [history, setHistory] = useState([decisionTree]);

    // Função para salvar a resposta e navegar para o próximo nó
    function saveButton(answer) {
        setActualAnswer(answer)
        setDialog([dialog.push({ sender: "user", question: answer, answers: [] })]);
        handleAnswer(answer);
    }

    // Função para lidar com a resposta do usuário
    function handleAnswer(answer) {
        setSaiuModal(false);
        const nextNode = currentNode.answers[answer]; // Navega para o próximo nó com base na resposta
        console.log("nextNode", nextNode)
        console.log("Current node", currentNode)
        console.log("repetir pedido", isRepetirPedido)
        // Se for um objeto, navega para o próximo nó e atualiza o diálogo
        if (typeof nextNode === "object") {
            setCurrentNode(nextNode);
            setDialog([...dialog, {
                sender: "bot",
                question: nextNode.question,
                answers: Object.keys(nextNode.answers),
                indexes: Object.keys(nextNode.answers).map((_, i) => i + 1)
            }]);

            setHistory([...history, nextNode]);
        } else {
            // Se for uma string, apenas exibe a mensagem final (como "Sair")
            setDialog([...dialog, { sender: "bot", question: nextNode, answers: [] }]);
        }

         // Se a resposta for uma função, executa a função e não tenta navegar mais
         if (typeof nextNode === "function") {
             nextNode();
             setHistory([...history, nextNode]);
         }
    }

    function goBack() {

        if (history.length === 0) 
            return

        const newHistory = [...history];
        const previousNode = newHistory[newHistory.length - 1];
        setCurrentNode(previousNode);  // Define o nó anterior como o atual
        setHistory(newHistory);  // Atualiza o histórico
    
        console.log(history)
        console.log("current node", previousNode)
        console.log("history", newHistory)
        // Remove a última interação no diálogo
        const newDialog = [...dialog];
        newDialog.push({
            sender: "user",
            question: actualAnswer, 
            answers: []
        });
        newDialog.push({
            sender: "bot",
            question: previousNode.question,
            answers: Object.keys(previousNode.answers),
            indexes: Object.keys(previousNode.answers).map((_, i) => i + 1)
        })
        setDialog(newDialog);
    }

    async function repetirPedido() {

        let confirmedFormOld = await confirmDialog()
        if (confirmedFormOld) {
            setIsRepetirPedido(true);
        }
    }

   async function newPedido() {
        let confirmedFormNew = await confirmDialog()
        console.log("Resultado", confirmedFormNew)
        if (confirmedFormNew) {
            setIsNewPizza(true);
        }
    }

    function confirmDialog() {
        return new Promise((resolve) => {
            confirmAlert({
              title: 'Confirmação',
              message: 'Você tem certeza que deseja continuar?',
              buttons: [
                {
                  label: 'Sim',
                  onClick: () => resolve(true),
                },
                {
                  label: 'Não',
                  onClick: () => resolve(false),
                },
              ],
            });
        });
    }

    function saiuModalFunction(value) {
        setSaiuModal(value)
    } 

    return props.show ? (
        <div className="container">
            <FontAwesomeIcon onClick={() => {
                window.location.reload()
                        }} className="cancel" icon={faCircleXmark} />
            <div className="dialog">
                {dialog.map((d, index) => (
                    <div key={index}>
                        {d.sender === "bot" ? (
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
                        ) : (
                            <div className="text-user">
                                <div className="text-area-user">
                                    <span>{d.question}</span>
                                </div>
                            </div>
                        )}

                        {index === dialog.length - 1 && d.answers.length > 0 && (
                            // Exibe as opções apenas para a última interação do bot
                            <div className='response-field'>
                                {d.answers.map((a, i) => (
                                    <button key={i} onClick={() => saveButton(a)}>
                                        {d.indexes[i]} - {a}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}


                <NewPizzaForm hidden={!isNewPizza} user={localStorage.getItem("@userId")} sair={handleButtonClick}/>
                <OldPedido hidden={!isRepetirPedido} sair={handleButtonClick}/>
            </div>
            <ToastContainer/>
        </div>) : (<></>);

}