import React, { useState } from "react";
import FormInput from "../forms/FormInput";
import FormListSelect from "../forms/FormListSelect";
import "./index.css";
import { BtnNewOperator } from "../buttons/ActionButtons";
import UsersToOperators from "../../auth/UsersToOperators";
import { toast, ToastContainer } from "react-toastify";


const ModalNewOperator = ({setModalShow, setStatus}) => {
    const typeOperator = ["Admin", "Operador", "Mensal"]
    const [newOperator, setNewOperator] = useState({
        cod: "",
        operator: "",
        password: "",
        type: ""
    })

    const handleOperatorChange = (e) => {
        const {name, value} = e.target
        setNewOperator((prev) => ({...prev, [name]: value}))
    }

    const handleClick = async (e) => {
        e.preventDefault();
        if (!newOperator.cod || !newOperator.operator || !newOperator.password || !newOperator.type){
          toast.warning("Preencha todos os campos!")
        }
        try{
            const status = await UsersToOperators(newOperator)
            if(status === "OK"){
              toast.success("Operador criado com sucesso!")
              setTimeout(()=> {
                setModalShow(false)
              }, 2000)
              
              
            }
            
        } catch (error) {
            console.error("Erro: ", error.message)
        }
    }

  return (
    <div className="modal-container">
      <div className="modal">
        <form className="modal-form">
          <div className="modal-title">
            <h3 className="modal-title-text">Novo Operador</h3>
            <button 
              type="button" 
              className="modal-close-button" 
              onClick={() => setModalShow(false)}
            >
              Fechar
            </button>
          </div>
          <div className="inputs">
            <FormInput
              label="Codigo"
              type="text"
              name="cod"
              value={newOperator.cod}
              onChange={handleOperatorChange}
              style={{ width: 172 }}
            />
            <FormInput
              label="Nome"
              type="text"
              name="operator"
              value={newOperator.operator}
              autoComplete="username"
              onChange={handleOperatorChange}
              style={{ width: 182 }}
            />
            <FormInput
              label="Senha"
              type="password"
              name="password"
              value={newOperator.password}
              autoComplete="new-password"
              onChange={handleOperatorChange}
              style={{ width: 182 }}
            />
            <FormListSelect
            className="label"
              label="Tipo"
              name="type"
              value={newOperator.type}
              options={typeOperator}
              ///disableOption={}
              defaultValue="Admin"
              onChange={handleOperatorChange}
              style={{ width: 198 }}
            />
          </div>

          <div className="btns">
            <BtnNewOperator
                className="btn-edit"
                type="button"
                onClick={handleClick}
            />
          </div>
        </form>
      </div>
      <ToastContainer autoClose={2000} closeOnClick="true" pauseOnFocusLoss="false" position="top-left"/>
    </div>
  );
};

export default ModalNewOperator;
