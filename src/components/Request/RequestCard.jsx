import React, { useEffect, useState } from "react";
import { IoPersonRemoveSharp } from "react-icons/io5";
import {
  assignAllPackage,
  assignPackage,
  deleteOperatorInList,
  removeAllPackage,
  removePackage,
} from "../../services/distributePackageService";
import { toast } from "react-toastify";

const RequestCard = ({
  perOperator,
  operatorName,
  operatorID,
  selected,
  setSelected,
  createPackage,
  setCreatePackage,
  unassigned,
  allOperator,
  setAllOperator
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

  const relatory = () => {
    let pkgi = [];
    createPackage.map((pkg) => {
      if (pkg.operator_code_id === operatorID) {
        pkgi.push(pkg);
      }
    });
  };

  useEffect(() => {
    calculateValues();
    relatory();
  }, [perOperator]);

  const addSingle = () => {
    if (!selected) {
      toast.warning("Selecione uma doação!");
      return;
    }
    assignPackage(
      selected,
      operatorID,
      createPackage,
      setCreatePackage,
      unassigned
    );

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
  };

  const removeOperatorInList = () => {
    deleteOperatorInList(allOperator, setAllOperator, operatorID, createPackage, setCreatePackage);
  }

  const removeAll = () => {
    removeAllPackage(createPackage, operatorID, setCreatePackage);
  };

  const removeSingle = () => {
    removePackage(createPackage, setCreatePackage, operatorID);
  };

  return (
    <div className="request-front-right-card">
      <div className="request-front-right-card-head">
        <h4>
          {operatorID} - {operatorName}
        </h4>
        <p onClick={removeOperatorInList}><IoPersonRemoveSharp /></p>
      </div>

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
        <button className="btn-delete" onClick={removeAll}>
          All
        </button>
        <button className="btn-delete" onClick={removeSingle}>
          -1
        </button>
        <label>|</label>
        <button className="btn-add-card" onClick={addAll}>
          All
        </button>
        <button className="btn-add-card" onClick={addSingle}>
          +1
        </button>
      </div>
    </div>
  );
};

export default RequestCard;
