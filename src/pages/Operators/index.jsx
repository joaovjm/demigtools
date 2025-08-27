import React, { useEffect, useState } from "react";
import "./index.css";
import FormInput from "../../components/forms/FormInput";
import FormListSelect from "../../components/forms/FormListSelect";
import { ICONS } from "../../constants/constants";
import {
  BtnDelete,
  BtnEdit,
  BtnNewOperator,
} from "../../components/buttons/ActionButtons";
import { getOperators } from "../../helper/getOperators";
import editOperator from "../../helper/editOperator";
import Loader from "../../components/Loader";
import ModalNewOperator from "../../components/ModalNewOperator";
import deleteOperator from "../../helper/deleteOperator";
import { ModalConfirm } from "../../components/ModalConfirm";
import { toast, ToastContainer } from "react-toastify";

const Operators = () => {
  const [formTerm, setFormTerm] = useState({
    cod: "",
    operator: "",
    password: "",
    type: "",
    active: false,
  });

  const [tableOperators, setTableOperators] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    onConfirm: null,
  });
  const [modalConfirmOpen, setModalConfirmOpen] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const operators = async () => {
      try {
        const data = await getOperators({from: 0, to: 20});
        const operatorsWithDisableState = data.map((op) => ({
          ...op,
          isDisable: true,
        }));
        setTableOperators(operatorsWithDisableState);

        if (data.length > 0) {
          const operator = data[0];
          setFormTerm({
            cod: operator.operator_code_id,
            operator: operator.operator_name,
            password: "",
            type: operator.operator_type,
            active: operator.operator_active,
          });
        }
      } catch (error) {
        console.error("Erro: ", error.message);
      }
    };
    operators();
  }, [modalShow === false, modalConfirmOpen === false]);

  const handleInputChange = (e, operator) => {
    const { name, value, type, checked } = e.target;

    const inputValue = type === "checkbox" ? checked : value;

    const updatedOperators = tableOperators.map((op) => {
      if (op.operator_code_id === operator.operator_code_id) {
        if (name === "operator") {
          return { ...op, operator_name: inputValue };
        } else if (name === "cod") {
          return { ...op, operator_code_id: inputValue };
        } else if (name === "type") {
          return { ...op, operator_type: inputValue };
        } else if (name === "active") {
          return { ...op, operator_active: inputValue };
        } else if (name === "password") {
          return { ...op, operator_password: inputValue };
        }
        return { ...op, [`operator_${name}`]: inputValue };
      }
      return op;
    });

    setTableOperators(updatedOperators);
  };

  const handleSubmit = async (e, action, operatorId) => {
    e.preventDefault();
    if (action === "edit") {
      setTableOperators((prevOperators) =>
        prevOperators.map((op) =>
          op.operator_code_id === operatorId
            ? { ...op, isDisable: !op.isDisable }
            : op
        )
      );
    } else if (action === "save") {
      const operatorToUpdate = tableOperators.find(
        (op) => op.operator_code_id === operatorId
      );

      if (operatorToUpdate) {
        const operatorData = {
          id: operatorToUpdate.operator_code_id,
          name: operatorToUpdate.operator_name,
          type: operatorToUpdate.operator_type,
          active: operatorToUpdate.operator_active,
          password: operatorToUpdate.operator_password,
        };

        const data = await editOperator(operatorData);
        if (data === "success") {
          toast.success("Dados atualizados com sucesso!");
        }

        setTableOperators((prevOperators) =>
          prevOperators.map((op) =>
            op.operator_code_id === operatorId ? { ...op, isDisable: true } : op
          )
        );
      }
    } else if (action === "delete") {
      return new Promise((resolve) => {
        setModalConfig({
          title: "Deletar Usuario",
          message: "Tem certeza que desejas deletar este usuário?",
          onConfirm: async () => {
            await deleteOperator(operatorId).then(resolve);
            setModalConfirmOpen(false);
            toast.success("Usuário deletado com sucesso!");
          },
        });
        setModalConfirmOpen(true);
      });
    } else if (action === "newoperator") {
      setModalShow(true);
    }
  };

  const typeOperator = ["Admin", "Operator", "Mensal", "Confirmação"];
  return (
    <div className="operators">
      <div className="header-btn">
        <BtnNewOperator
          className="btn-new-operator"
          onClick={(e) => handleSubmit(e, "newoperator")}
          icon={ICONS.CIRCLEOUTLINE}
        />
      </div>

      <ModalConfirm
        isOpen={modalConfirmOpen}
        onClose={() => setModalConfirmOpen(false)}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
      />

      <div className="operators-table">
        <div className="operators-table-inner">
          {tableOperators ? (
            tableOperators.map((operator, index) => (
              <form
                key={operator.operator_code_id || index}
                onSubmit={(e) => e.preventDefault()}
                className="form-operators"
              >
                <div className="gerent-operators">
                  <FormInput
                    label="Codigo"
                    type="text"
                    name="cod"
                    value={operator.operator_code_id}
                    onChange={(e) => handleInputChange(e, operator)}
                    readOnly={operator.isDisable}
                  />
                  <FormInput
                    label="Operador"
                    type="text"
                    name="operator"
                    value={operator.operator_name}
                    autoComplete="username"
                    onChange={(e) => handleInputChange(e, operator)}
                    readOnly={operator.isDisable}
                  />
                  <FormInput
                    label="Senha"
                    type="password"
                    name="password"
                    value={operator.operator_password || ""}
                    autoComplete="current-password"
                    onChange={(e) => handleInputChange(e, operator)}
                    readOnly={operator.isDisable}
                  />
                  <FormListSelect
                    label="Tipo"
                    value={operator.operator_type}
                    name="type"
                    id={operator.operator_code_id}
                    onChange={(e) => handleInputChange(e, operator)}
                    options={typeOperator}
                    disabled={operator.isDisable}
                  />
                  <div className="input-field">
                    <label>Ativo?</label>
                    <input
                      type="checkbox"
                      value="active"
                      name="active"
                      checked={operator.operator_active}
                      onChange={(e) => handleInputChange(e, operator)}
                      style={{ width: 20 }}
                      disabled={operator.isDisable}
                    />
                  </div>

                  <BtnEdit
                    label={operator.isDisable ? "Editar" : "Salvar"}
                    onClick={(e) =>
                      handleSubmit(
                        e,
                        operator.isDisable ? "edit" : "save",
                        operator.operator_code_id
                      )
                    }
                  />
                  <button
                    className="btn-delete-operator"
                    onClick={(e) =>
                      handleSubmit(e, "delete", operator.operator_code_id)
                    }
                  >
                    {ICONS.TRASH} Delete
                  </button>
                </div>

                {modalShow && (
                  <ModalNewOperator
                    setModalShow={setModalShow}
                    setStatus={setStatus}
                  />
                )}
              </form>
            ))
          ) : (
            <Loader />
          )}
        </div>
      </div>

      <ToastContainer
        closeOnClick="true"
        pauseOnFocusLoss="false"
        position="top-left"
      />
    </div>
  );
};

export default Operators;
