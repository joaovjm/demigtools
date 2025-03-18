import { useEffect, useState } from "react";
import "./index.css";
import { getDonations } from "../../../helper/supabase";

const TableDonor = ({ idDonor }) => {
  const [dados, setDados] = useState([]);

  const media = (
    dados.reduce((acc, curr) => acc + curr.valor, 0) / dados.length
  ).toFixed(2);
  useEffect(() => {
    if (idDonor) {
      getDonations(idDonor)
        .then((data) => {
          setDados(data);
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  }, [idDonor]);

  return (
    <div className="table-container">
      <table border="1" className="tabledonor">
        <thead>
          <tr className="trHead">
            <th className="tableHead">Recibo</th>
            <th className="tableHead">Operador</th>
            <th className="tableHead">Valor</th>
            <th className="tableHead">Comissão</th>
            <th className="tableHead">Contato</th>
            <th className="tableHead">Receber</th>
            <th className="tableHead">Recebida</th>
            <th className="tableHead">Impresso</th>
            <th className="tableHead">Recebido</th>
            <th className="tableHead">MesRef</th>
            <th className="tableHead">Coletador</th>
          </tr>
        </thead>

        {dados?.map((item) => (
          <tbody>
            <tr className="trBody" key={item.id}>
              <td className="tableBody">
                {item.recibo}
              </td>
              <td className="tableBody">
                {item.operador}
              </td>
              <td className="tableBody">
                {item.valor}
              </td>
              <td className="tableBody">
                {item.comissao}
              </td>
              <td className="tableBody">
                {item.data_contato}
              </td>
              <td className="tableBody">
                {item.data_receber}
              </td>
              <td className="tableBody">
                {item.data_recebida}
              </td>
              <td className="tableBody">
                {item.impresso}
              </td>
              <td className="tableBody">
                {item.recebido}
              </td>
              <td className="tableBody">
                {item.mes_ref}
              </td>
              <td className="tableBody">
                {item.coletador}
              </td>
            </tr>
            <tr className="trFoot">
              <td colSpan="11" className="obs">
                {item.obs_doacao ? item.obs_doacao : "..."}
              </td>
            </tr>
          </tbody>
        ))}
      </table>
    </div>
  );
};

export default TableDonor;
