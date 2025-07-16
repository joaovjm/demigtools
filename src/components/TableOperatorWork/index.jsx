import React from "react";
import "./index.css";

const TableOperatorWork = ({ relatory, setClick, setTableDonationOpen }) => {
  const {
    names,
    countReceived,
    addValueNotReceived,
    countNotReceived,
    addValueReceived,
  } = relatory;

  const handleClick = (id) => {
    setTableDonationOpen(true)
    setClick(id)
  }
  return (
    <div>
      {relatory && (
        <table className="table-operatorWork">
          <thead className="table-operatorWork-header">
            <tr>
              <th>Operador</th>
              <th>Qtd. Aberto</th>
              <th>Valor Aberto</th>
              <th>Qtd. Recebido</th>
              <th>Valor Recebido</th>
            </tr>
          </thead>
          <tbody className="table-operatorWork-body">
            {relatory &&
              names?.map((name) => (
                <tr key={name.name} className="table-operatorWork-body-tr" onClick={() => handleClick(name.id)}>
                  <td>{name.name}</td>
                  <td>{countNotReceived[name.name] || 0}</td>
                  <td>R$ {addValueNotReceived[name.name]?.toFixed(2).replace('.', ',') || '0,00'}</td>
                  <td>{countReceived[name.name] || 0}</td>
                  <td>R$ {addValueReceived[name.name]?.toFixed(2).replace('.', ',') || '0,00'}</td>
                </tr>


              ))}
          </tbody>
        </table>
      )}

    </div>
  );
};

export default TableOperatorWork;
