import React from "react";
import { DataSelect } from "../DataTime";

const TableScheduled = ({ scheduled, setModalOpen, setScheduledOpen, setNowScheduled, donationFilterPerId }) => {
  const handleClick = (e) => {

    setScheduledOpen({
      id: e.leads_id,
      name: e.leads_name,
      address: e.leads_address,
      city: e.leads_city,
      neighborhood: e.leads_neighborhood,
      phone: e.leads_tel_1,
      phone2: e.leads_tel_2,
      phone3: e.leads_tel_3,
      phone4: e.leads_tel_4,
      phone5: e.leads_tel_5,
      phone6: e.leads_tel_6,
      leads: e.leads_created,
      date_accessed: e.leads_date_accessed,
      leads_icpf: e.leads_icpf,
      observation: e.leads_observation,
      scheduling_date: e.leads_scheduling_date,
      operator_code_id: e.operator_code_id,
    })
    setNowScheduled(e)
    setModalOpen(true);
  };

  const filterScheduled = scheduled.filter(
    (filter) => filter.operator_code_id === donationFilterPerId  );

  return (
    <>
      {donationFilterPerId ? (
        filterScheduled?.length !== 0 ? (
          <table className="table-confirmation">
            <thead className="table-head-confirmation">
              <tr>
                <th className="table-head-confirmation-text">Nome</th>
                <th className="table-head-confirmation-text">Observação</th>
                <th className="table-head-confirmation-text">
                  Agendado para
                </th>
              </tr>
            </thead>
            <tbody className="table-body-confirmation">
              {filterScheduled?.map((item) => (
                <tr
                  key={item.leads_id}
                  className="table-body-confirmation-tr"
                  onClick={() => handleClick(item)}
                >
                  <td className="table-body-confirmation-text">
                    {item.leads_name}           
                  </td>
                  <td className="table-body-confirmation-text">
                    {item.leads_observation}
                  </td>
                  <td className="table-body-confirmation-text">
                    {DataSelect(item.leads_scheduling_date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
        "Nenhuma ficha agendada"
        )) : (
          scheduled?.length !== 0 ? (
          <table className="table-confirmation">
            <thead className="table-head-confirmation">
              <tr>
                <th className="table-head-confirmation-text">Nome</th>
                <th className="table-head-confirmation-text">Observação</th>
                <th className="table-head-confirmation-text">
                  Agendado para
                </th>
              </tr>
            </thead>
            <tbody className="table-body-confirmation">
              {scheduled?.map((item) => (
                <tr
                  key={item.leads_id}
                  className="table-body-confirmation-tr"
                  onClick={() => handleClick(item)}
                >
                  <td className="table-body-confirmation-text">
                    {item.leads_name}
                  </td>
                  
                  <td className="table-body-confirmation-text">
                    {item.leads_observation}
                  </td>
                  <td className="table-body-confirmation-text">
                    {DataSelect(item.leads_scheduling_date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      ) : (
        "Nenhuma ficha agendada"
      ))}
        
    </>
  );
};

export default TableScheduled;
