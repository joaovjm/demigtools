import { useEffect, useState } from "react";
import "./index.css";
import { getDonation } from "../../../helper/getDonation";

const TableDonor = ({ idDonor }) => {
  const [dados, setDados] = useState([]);

  {/*const media = (
    dados.reduce((acc, curr) => acc + curr.valor, 0) / dados.length
  ).toFixed(2);*/}
  useEffect(() => {
    if (idDonor) {
      getDonation(idDonor)
        .then((data) => {
          setDados(data);
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  }, [idDonor]);
  console.log(dados)

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
            <tr className="trBody" key={item.donation_id}>
              <td className="tableBody">
                {item.receipt_donation_id}
              </td>
              <td className="tableBody">
                {item.operador}
              </td>
              <td className="tableBody">
                {item.donation_value}
              </td>
              <td className="tableBody">
                {item.donation_extra}
              </td>
              <td className="tableBody">
                {item.donation_day_contact}
              </td>
              <td className="tableBody">
                {item.donation_day_to_receive}
              </td>
              <td className="tableBody">
                {item.donation_day_received}
              </td>
              <td className="tableBody">
                {item.donation_print}
              </td>
              <td className="tableBody">
                {item.donation_received}
              </td>
              <td className="tableBody">
                {item.donation_monthref}
              </td>
              <td className="tableBody">
                {item.coletador}
              </td>
            </tr>
            <tr className="trFoot">
              <td colSpan="11" className="obs">
                {item.donation_description ? item.donation_description : "..."}
              </td>
            </tr>
          </tbody>
        ))}
      </table>
    </div>
  );
};

export default TableDonor;
