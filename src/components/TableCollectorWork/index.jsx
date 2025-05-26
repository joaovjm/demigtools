import React from "react";
import "./index.css";

const TableCollectorWork = ({ relatory }) => {
  const {
    names,
    countReceived,
    addValueNotReceived,
    countNotReceived,
    addValueReceived,
  } = relatory;
  return (
    <div>
      <table className="table-collectorWork">
        <thead className="table-collectorWork-header">
          <tr>
            <th>Coletador</th>
            <th>Qtd. Aberto</th>
            <th>Valor Aberto</th>
            <th>Qtd. Recebido</th>
            <th>Valor Recebido</th>
          </tr>
        </thead>
        {relatory &&
          names?.map((name) => {
            if (!name.name) return null;
            return (
              <tbody key={name.name} className="table-collectorWork-body">
                <tr>
                  <td>{name.name}</td>
                  <td>{countNotReceived[name.name] || 0}</td>
                  <td>
                    R${" "}
                    {addValueNotReceived[name.name]
                      ?.toFixed(2)
                      .replace(".", ",") || "0,00"}
                  </td>
                  <td>{countReceived[name.name] || 0}</td>
                  <td>
                    R${" "}
                    {addValueReceived[name.name]
                      ?.toFixed(2)
                      .replace(".", ",") || "0,00"}
                  </td>
                </tr>
              </tbody>
            );
          })}
      </table>
    </div>
  );
};

export default TableCollectorWork;
