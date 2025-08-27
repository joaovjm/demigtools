import React, { useEffect, useState } from "react";
import { FaAngleDown, FaAngleUp, FaEye, FaEyeSlash } from "react-icons/fa";
import { distribute } from "../../services/distributePackageService";

const DonationTable = ({ unassigned, setSelected, selected, createPackage, setCreatePackage, operatorID, selection }) => {
  const [visible, setVisible] = useState(true);
  const [packageCount, setPackageCount] = useState(0);
  const [nowPage, setNowPage] = useState(1);

  const itemsPerPage = 50;
  const endPage = nowPage * itemsPerPage;
  const startPage = endPage - itemsPerPage;

  const itemsPaginated = unassigned.slice(startPage, endPage);
  const totalPage = Math.ceil(unassigned.length / itemsPerPage);

  useEffect(() => {
    const countPackage = () => {
      const count = unassigned?.reduce((acc, item) => {
        return acc + item.donation_value;
      }, 0);

      setPackageCount(count);
    };
    countPackage();
  }, [unassigned]);

  const handleUnassignedClick = (id) => {
    setSelected(id);
  };
  const handleDistribute = async () => {
    const response = await distribute(unassigned, createPackage, selection)
    setCreatePackage(response);
  }

  return (
    <div className="request-front-left-bottom-3">
      <div className="input-field">
        <label>Doação</label>
        <input type="text" value={unassigned.length} disabled />
      </div>
      <div className="input-field">
        <label>Total</label>
        <input
          type="text"
          value={packageCount.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
          disabled
        />
      </div>
      <div className="input-field">
        <label>Filtro</label>
        <input type="text" />
      </div>
      <div className="input-field">
        <label>Valor Filtro R$</label>
        <input type="text" />
      </div>
      <div className="request-front-left-bottom-3-btn">
        <button onClick={() => setVisible(!visible)}>
          {visible ? <FaEye /> : <FaEyeSlash />}
        </button>
      </div>
      <div className="request-front-left-bottom-3-table">
        <label>Doação</label>
        <div className="request-front-left-bottom-3-table-header">
          <label>Valor</label>
          <label>Recibo</label>
          <label>Operador</label>
          <label>Tel</label>
          <label>Ultima OP</label>
        </div>
        <div className="request-front-left-bottom-3-table-body">
          {itemsPaginated?.map((cp) => (
            <div
              key={cp.receipt_donation_id}
              onClick={() => handleUnassignedClick(cp.receipt_donation_id)}
              id={cp.receipt_donation_id}
              className={`table-row ${
                selected === cp.receipt_donation_id ? "selected" : ""
              }`}
            >
              <label>
                {cp.donation_value.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </label>
              <label>{cp.receipt_donation_id}</label>
              <label>{cp.operator_name}</label>
              <label>{cp.donor_tel_1}</label>
              <label>null</label>
            </div>
          ))}
        </div>
      </div>
      <div className="request-front-left-bottom-3-table-btn">
        <button onClick={handleDistribute}>Distribuir Aleatóriamente</button>
        <div className="request-front-left-bottom-3-table-pagination">
          <button
            onClick={() => setNowPage((prev) => Math.max(prev - 1, 1))}
            disabled={nowPage === 1}
          >
            <FaAngleDown />
          </button>
          <label> {nowPage} </label>
          <button
            onClick={() => setNowPage((prev) => Math.min(prev + 1, totalPage))}
            disabled={nowPage === totalPage}
          >
            <FaAngleUp />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationTable;
