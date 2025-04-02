import React, { useState } from "react";
import FormInput from "../forms/FormInput";
import FormListSelect from "../forms/FormListSelect";
import "./index.css";
import { BtnNewOperator } from "../buttons/ActionButtons";
import UsersToOperators from "../../auth/UsersToOperators";


const ModalNewOperator = ({setModalShow}) => {
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
          window.alert("Todos os campos devem ser preenchidos!")
          return;
        }
        try{
            const status = await UsersToOperators(newOperator)
            if(status === "OK"){
              window.alert("Usuário criado com sucesso!")
              setModalShow(false)
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
    </div>
  );
};

export default ModalNewOperator;
