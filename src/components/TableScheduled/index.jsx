import React from "react";

const TableScheduled = ({ scheduled }) => {
  console.log(scheduled);
  const handleClick = (e) => {
    console.log(e.target.parentElement.children[0].textContent);
  };

  return (
    <table className="table-confirmation">
      <thead className="table-head-confirmation">
        <tr>
          <th className="table-head-confirmation-text">Nome</th>
          <th className="table-head-confirmation-text">Observação</th>
          <th className="table-head-confirmation-text">Data do Agendamento</th>
        </tr>
      </thead>
      <tbody className="table-body-confirmation">
        {scheduled?.map((item) => (
          <tr
            key={item.id}
            className="table-body-confirmation-tr"
            onClick={handleClick}
          >
            <td className="table-body-confirmation-text">{item.leads_name}</td>
            <td className="table-body-confirmation-text">{item.leads_observation}</td>
            <td className="table-body-confirmation-text">{item.leads_scheduling_date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableScheduled;
