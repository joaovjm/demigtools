import React from "react";
import "./index.css";
import { DataSelect } from "../DataTime";

const TableReceived = ({ donationsOperator }) => {
  return (
    <div className="table-received-container">
      <table className="table-received-table">
        <thead>
          <tr className="table-received-table-head">
            <th style={{ width: 340 }}>Nome</th>
            <th>Valor</th>
            <th>Data Recebida</th>
          </tr>
        </thead>
        <tbody>
          {donationsOperator?.map((item, index) => (
            <tr key={index} className="table-received-table-body">
              <td style={{ width: 340 }}>{item.donor.donor_name}</td>
              <td>{item.donation_value.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</td>
              <td>{DataSelect(item.donation_day_received)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableReceived;
