import { useEffect, useState, Fragment } from "react";
import "./index.css";
import { getDonation } from "../../helper/getDonation";
import { toast } from "react-toastify";
import { DataSelect } from "../DataTime";

const TableDonor = ({ idDonor, modalShow, setModalEdit, setDonation, modalEdit }) => {
  const caracterOperator = JSON.parse(localStorage.getItem("operatorData"));
  const [dados, setDados] = useState([]);

  // Carrega os dados da doação
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
  }, [idDonor, modalShow, modalEdit]);


  const handleEditDonation = (item) => {
    if (caracterOperator.operator_code_id !== item.operator_code_id){
      if(caracterOperator.operator_type !== "Admin"){
        toast.warning("Não pode editar movimento de outro operator!")
        return;
      } 
    }
    if (item.donation_print === "Sim" || item.donation_received === "Sim"){
      toast.warning("Impossível editar. Essa ficha já foi impressa ou já foi recebida!")
      return;
    }
    setModalEdit(true)
    setDonation(item)
  };

  return (
    <div className="table-wrapper">
        <table className="tabledonor">
          <thead>
            <tr className="trHead">
              <th className="tableHead">Recibo</th>
              <th className="tableHead">Operador</th>
              <th className="tableHead">Valor</th>
              <th className="tableHead">Extra</th>
              <th className="tableHead">Contato</th>
              <th className="tableHead">Receber</th>
              <th className="tableHead">Recebida</th>
              <th className="tableHead">Impresso</th>
              <th className="tableHead">Recebido</th>
              <th className="tableHead">MesRef</th>
              <th className="tableHead">Coletador</th>
            </tr>
          </thead>

          <tbody>
            {dados && dados.length > 0 ? (
              dados.map((item) => (
                <Fragment key={item.receipt_donation_id}>
                  <tr
                    onClick={() => handleEditDonation(item)}
                    className="trBody"
                  >
                    <td className="tableBody">{item.receipt_donation_id}</td>
                    <td className="tableBody">
                      {item.operator_code_id} - {item.operator?.operator_name}
                    </td>
                    <td className="tableBody">{item.donation_value.toLocaleString("pt-BR", {style: 'currency', currency: 'BRL'})}</td>
                    <td className="tableBody">{item?.donation_extra?.toLocaleString("pt-BR", {style: 'currency', currency: 'BRL'})}</td>
                    <td className="tableBody">{DataSelect(item.donation_day_contact)}</td>
                    <td className="tableBody">
                      {DataSelect(item.donation_day_to_receive)}
                    </td>
                    <td className="tableBody">{DataSelect(item.donation_day_received)}</td>
                    <td className="tableBody">{item.donation_print}</td>
                    <td className="tableBody">{item.donation_received}</td>
                    <td className="tableBody">{DataSelect(item.donation_monthref, "mesref")}</td>
                    <td className="tableBody">
                      {item.collector_code_id} -{" "}
                      {item.collector?.collector_name || ""}
                    </td>
                  </tr>
                  <tr className="trFoot">
                    <td colSpan="11" className="obs">
                      {item.donation_description
                        ? item.donation_description
                        : "..."}
                    </td>
                  </tr>
                </Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="tableBody no-data">
                  Não há dados de doação disponíveis
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
  );
};

export default TableDonor;
