import React from "react";
import "./index.css";

const TableLeadHistory = ({
  operator,
  operatorCasa,
  schedule,
  scheduleCasa,
  leadsNA,
  leadsNACasa,
  leadsNP,
  leadsNPCasa,
  leadsSuccess,
  leadsSuccessCasa,
  countLeads,
  countLeadsCasa
}) => {
    
  return (
    <table className="table-leadHistory">
      <thead className="table-leadHistory-header">
        <tr className="table-leadHistory-header-row">
          <th>Operador</th>
          <th>Não Atendeu</th>
          <th>Não Pode Ajudar</th>
          <th>Agendado</th>
          <th>Novo Doador</th>
          <th>Total Ligados</th>
        </tr>
      </thead>
      <tbody className="table-leadHistory-body">
        {operator.map((history) => (
          <tr className="table-leadsHistory-body-row" key={history.name}>
            <td>{history.name}</td>
            <td>{leadsNA?.[history.name] || 0}</td>
            <td>{leadsNP?.[history.name] || 0}</td>
            <td>{schedule?.[history.name] || 0}</td>
            <td>{leadsSuccess?.[history.name] || 0}</td>
            <td>{countLeads?.[history.name] || 0}</td>
          </tr>
        ))}
      </tbody>
      <tbody className="table-leadHistory-body">
        {operatorCasa.map((history) => (
          <tr className="table-leadsHistory-body-row" key={history.name}>
            <td>{history.name}(Casa)</td>
            <td>{leadsNACasa?.[history.name] || 0}</td>
            <td>{leadsNPCasa?.[history.name] || 0}</td>
            <td>{scheduleCasa?.[history.name] || 0}</td>
            <td>{leadsSuccessCasa?.[history.name] || 0}</td>
            <td>{countLeadsCasa?.[history.name] || 0}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableLeadHistory;
