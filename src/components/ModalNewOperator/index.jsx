import React, { useState } from "react";
import FormInput from "../forms/FormInput";
import FormListSelect from "../forms/FormListSelect";
import "./index.css";
import { BtnNewOperator } from "../buttons/ActionButtons";
import UsersToOperators from "../../auth/UsersToOperators";
import { toast, ToastContainer } from "react-toastify";

const ModalNewOperator = ({ setModalShow, setStatus }) => {
  const typeOperator = ["Admin", "Operador", "Mensal"];
  const [newOperator, setNewOperator] = useState({
    cod: "",
    operator: "",
    password: "",
    type: "",
  });

  const handleOperatorChange = (e) => {
    const { name, value } = e.target;
    setNewOperator((prev) => ({ ...prev, [name]: value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (
      !newOperator.cod ||
      !newOperator.operator ||
      !newOperator.password ||
      !newOperator.type
    ) {
      toast.warning("Preencha todos os campos!");
    }
    try {
      const status = await UsersToOperators(newOperator);
      if (status === "OK") {
        toast.success("Operador criado com sucesso!");
        setTimeout(() => {
          setModalShow(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Erro: ", error.message);
    }
  };

  return (
    <main className="modal-newoperator">
      <div className="modal-newoperator-div">
        <div className="modal-newoperator-form">
          <div className="modal-newoperator-form-title">
            <h3 className="modal-title-text">Novo Operador</h3>
            <button
              type="button"
              className="modal-close-button"
              onClick={() => setModalShow(false)}
            >
              Fechar
            </button>
          </div>

          <div className="input-field">
            <label>Codigo</label>
            <input
              type="text"
              name="cod"
              value={newOperator.cod}
              onChange={handleOperatorChange}
            />
          </div>
          <div className="input-field">
            <label>Nome</label>
            <input
              type="text"
              name="operator"
              value={newOperator.operator}
              onChange={handleOperatorChange}
              autoComplete="username"
            />
          </div>
          <div className="input-field">
            <label>Senha</label>
            <input
              type="password"
              name="password"
              value={newOperator.password}
              onChange={handleOperatorChange}
              autoComplete="new-password"
            />
          </div>

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

          <div className="btns">
            <BtnNewOperator className="btn-edit" onClick={handleClick} />
          </div>
        </div>
      </div>
      <ToastContainer
        autoClose={2000}
        closeOnClick="true"
        pauseOnFocusLoss="false"
        position="top-left"
      />
    </main>
  );
};

export default ModalNewOperator;
