import { useEffect, useState } from "react";
import "./index.css";
import { getDonations } from "../../../helper/supabase";

const TableDonor = ({ idDonor }) => {
  const [dados, setDados] = useState([]);
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
    <table border="1" className="tabledonor">
      <thead>
        <tr>
          <th>Recibo</th>
          <th>Operador</th>
          <th>Valor</th>
          <th>Contato</th>
          <th>Receber</th>
          <th>Recebida</th>
          <th>Impresso</th>
          <th>Recebido</th>
          <th>MesRef</th>
          <th>Coletador</th>
        </tr>
      </thead>

      <tbody>
        {dados?.map((item) => (
          <tr key={item.recibo}>
            <td>{item.recibo}</td>
            <td>{item.operador}</td>
            <td>{item.valor}</td>
            <td>{item.contato}</td>
            <td>{item.receber}</td>
            <td>{item.recebida}</td>
            <td>{item.impresso}</td>
            <td>{item.recebido}</td>
            <td>{item.mesref}</td>
            <td>{item.coletador}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableDonor;
