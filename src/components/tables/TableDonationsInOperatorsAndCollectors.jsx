import React, { useEffect, useState } from "react";
import supabase from "../../helper/superBaseClient";
import "./index.css"
import { useNavigate } from "react-router";
import { DataSelect } from "../DataTime";

const TableDonationsInOperatorsAndCollectors = ({
  click,
  startDate,
  endDate,
  filter,
}) => {
  const [donations, setDonations] = useState([]);
  const [oc, setOc] = useState()

  const navigate = useNavigate()
  let f;

  if (filter === "Operadores") {
    f = "operator_code_id";
  } else if (filter === "Coletadores") {
    f = "collector_code_id";
  }

  const getRelatory = async () => {
    try {
      const { data, error } = await supabase
        .from("donation")
        .select(
          "donation_day_received, donation_print, donation_received, donation_value, receipt_donation_id, donor_id, donor: donor_id(donor_name, donor_tel_1), operator_code_id, operator: operator_code_id(operator_name), collector_code_id, collector: collector_code_id(collector_name)"
        )
        .eq(f, click.id)
        .gte("donation_day_to_receive", startDate)
        .lte("donation_day_to_receive", endDate);

      if (error) throw error;
      if (!error) setDonations(data);
  
    } catch (error) {
      console.log("Erro: ", error.message);
    }
  };
  useEffect(() => {
    getRelatory();
    setOc(filter)
  }, [click]);

  const handleClick = (id) => {
    navigate(`/donor/${id}`)
  }

  return (
    <table>
      <thead className="table-doac-head">
        <tr>
          <th>Recibo</th>
          <th>Valor</th>
          <th>Nome</th>
          <th>Telefone</th>
          <th>{oc === "Coletadores" ? "Operador" : "Coletador"}</th>
          <th>Recebida</th>
          <th>Impresso</th>
          <th>Recebido</th>
        </tr>
      </thead>
      <tbody className="table-doac-body">
        {donations.map((donation, index) => (
          <tr key={index} onClick={() => handleClick(donation.donor_id)}>
            <td>{donation.receipt_donation_id}</td>
            <td>{donation.donation_value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
            <td>{donation.donor.donor_name}</td>
            <td>{donation.donor.donor_tel_1}</td>
            <td>
              {filter ===
                "Coletadores" ? `${donation.operator?.operator_name}` : `${donation.collector?.collector_name}`}
            </td>
            <td>{DataSelect(donation.donation_day_received)}</td>
            <td>{donation.donation_print}</td>
            <td>{donation.donation_received}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableDonationsInOperatorsAndCollectors;
