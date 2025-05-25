import React from "react";
import "./index.css";

const TableOperatorWork = ({ relatory, filter }) => {
  const {
    names,
    countReceived,
    addValueNotReceived,
    countNotReceived,
    addValueReceived,
  } = relatory;
  return (
    <div>
      <table className="table-operatorWork">
        <thead className="table-operatorWork-header">
          <tr>
            <th>Operador</th>
            {filter !== "Recebida" && <th>Qtd. Aberto</th>}
            {filter !== "Recebida" && <th>Valor Aberto</th>}
            <th>Qtd. Recebido</th>
            <th>Valor Recebido</th>
          </tr>
        </thead>
        {relatory &&
          names?.map((name) => (
            <tbody key={name.name} className="table-operatorWork-body">
              <tr>
                <td>{name.name}</td>
                {filter !== "Recebida" && <td>{countNotReceived[name.name] || 0}</td>}
                {filter !== "Recebida" && <td>R$ {addValueNotReceived[name.name]?.toFixed(2).replace('.',',') || '0,00'}</td>}
                <td>{countReceived[name.name] || 0}</td>
                <td>R$ {addValueReceived[name.name]?.toFixed(2).replace('.',',') || '0,00'}</td>
              </tr>
            </tbody>
          ))}
      </table>
    </div>
  );
};

export default TableOperatorWork;
