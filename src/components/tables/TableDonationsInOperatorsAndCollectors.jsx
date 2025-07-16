import React, { useEffect, useState } from "react";
import supabase from "../../helper/superBaseClient";

const TableDonationsInOperatorsAndCollectors = ({ click }) => {
  const [donations, setDonations] = useState([]);

//   const getRelatory = async () => {
//     try {
//       const { data, error } = await supabase
//         .from("donation")
//         .select()
//         .eq("operator_code_id", click)
        
//       if (error) throw error;
//       if (!error) console.log(data);
//     } catch (error) {
//       console.log("Erro: ", error.message);
//     }
//   };
//   useEffect(() => {getRelatory();}, [click]);

  return (
    <table>
      <thead>
        <tr>
          <th>recibo</th>
          <th>Nome</th>
          <th>Valor</th>
        </tr>
      </thead>
      <tbody>
        {donations?.map((donation) => {
          <tr>
            <td>{donation.donor_id}</td>
          </tr>;
        })}
      </tbody>
    </table>
  );
};

export default TableDonationsInOperatorsAndCollectors;
