import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { assignAllPackage, assignPackage, removeAllPackage } from "../../services/distributePackageService";

const RequestCard = ({
  perOperator,
  operatorName,
  operatorID,
  selected,
  setSelected,
  createPackage,
  setCreatePackage,
  unassigned
}) => {
  const [countValue, setCountValue] = useState(0);
  const [countQuant, setCountQuant] = useState(0);
  const [maxValue, setMaxValue] = useState(0);

  const calculateValues = () => {
    if (perOperator && perOperator.length > 0) {
      const value = perOperator.reduce(
        (acc, item) => acc + item.donation_value,
        0
      );
      const quantity = perOperator.length;

      setCountValue(value);
      setCountQuant(quantity);
    } else {
      setCountValue(0);
      setCountQuant(0);
    }
  };

  useEffect(() => {
    calculateValues();
  }, [perOperator]);

  const addSingle = (unassign) => {
    if (!selected) {
      toast.warning("Selecione uma doação para adicionar");
      return;
    }

    assignPackage(
      selected,
      operatorID,
      createPackage, 
      setCreatePackage,
      unassign
    )
  
    setSelected(null);
  };

  const addAll = () => {
    assignAllPackage(
      createPackage,
      unassigned,
      operatorID,
      setCreatePackage,
      maxValue,
      countValue
    );
  }

  const removeAll = () => {
    removeAllPackage(
      createPackage,
      operatorID,
      setCreatePackage
    );
  }

  return (
    <div className="request-front-right-card">
      <h4>
        {operatorID} - {operatorName}
      </h4>
      <div className="request-front-right-card-body">
        <label>
          Valor:{" "}
          {countValue?.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }) || 0}
        </label>
        <label>Doações: {countQuant || 0}</label>
        <div className="input-field">
          <label>Max</label>
          <input type="text" onChange={(e) => setMaxValue(e.target.value)} />
        </div>
      </div>
      <div className="request-front-right-card-btn">
        <button className="btn-delete" onClick={removeAll}>All</button>
        <button className="btn-delete">-1</button>
        <label>|</label>
        <button className="btn-add-card" onClick={addAll}>All</button>
        <button className="btn-add-card" onClick={addSingle}>
          +1
        </button>
      </div>
    </div>
  );
};

export default RequestCard;
