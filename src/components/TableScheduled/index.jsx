import React from "react";

const TableScheduled = ({ scheduled }) => {
  const handleClick = (e) => {};

  return (
    <>
      {scheduled.length !== 0 ? (
        <table className="table-confirmation">
          <thead className="table-head-confirmation">
            <tr>
              <th className="table-head-confirmation-text">Nome</th>
              <th className="table-head-confirmation-text">Observação</th>
              <th className="table-head-confirmation-text">
                Data do Agendamento
              </th>
            </tr>
          </thead>
          <tbody className="table-body-confirmation">
            {scheduled?.map((item) => (
              <tr
                key={item.leads_id}
                className="table-body-confirmation-tr"
                onClick={() => handleClick(item.leads_id)}
              >
                <td className="table-body-confirmation-text">
                  {item.leads_name}
                </td>
                <td className="table-body-confirmation-text">
                  {item.leads_observation}
                </td>
                <td className="table-body-confirmation-text">
                  {item.leads_scheduling_date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        "Nenhuma ficha agendada"
      )}
    </>
  );
};

export default TableScheduled;
