import React from "react";
import "./index.css";
import { DataSelect } from "../DataTime";

const TableScheduled = ({
  scheduled,
  setModalOpen,
  setScheduledOpen,
  setNowScheduled,
  donationFilterPerId,
}) => {
  
  const handleClick = (e) => {
    setScheduledOpen({
      id: e.leads_id ? e.leads_id : e.id && e.id,
      donor_id: e.donor_id,
      name: e.leads_name || e.donor?.donor_name,
      address: e.leads_address || e.donor?.donor_address,
      city: e.leads_city,
      neighborhood: e.leads_neighborhood,
      phone: e.leads_tel_1 || e.donor?.donor_tel_1,
      phone2: e.leads_tel_2,
      phone3: e.leads_tel_3,
      phone4: e.leads_tel_4,
      phone5: e.leads_tel_5,
      phone6: e.leads_tel_6,
      leads: e.leads_created,
      date_accessed: e.leads_date_accessed,
      leads_icpf: e.leads_icpf,
      observation: e.leads_observation || e.request_observation,
      scheduling_date: e.leads_scheduling_date,
      operator_code_id: e.operator_code_id,
      typeScheduled: e.leads_id ? "lead" : e.donor_id !== undefined && "request"
    });
    setNowScheduled(e);
    setModalOpen(true);
  };

  const filterScheduled = scheduled.filter(
    (filter) => filter.operator_code_id === donationFilterPerId
  );

  const dataToShow = donationFilterPerId ? filterScheduled : scheduled;
  const showPhoneColumn = !donationFilterPerId;

  return (
    <div className="table-scheduled-container">
      <div className="table-scheduled-content">
        {dataToShow?.length > 0 ? (
          <div className="table-scheduled-wrapper">
            <div className="table-scheduled-header">
              <div className="table-scheduled-stats">
                <span className="stats-item">
                  <strong>{dataToShow.length}</strong> {dataToShow.length === 1 ? 'agendamento' : 'agendamentos'}
                </span>
                <span className="stats-item">
                  {showPhoneColumn ? 'Visualização completa' : 'Filtrado por operador'}
                </span>
              </div>
            </div>

            <div className="table-scheduled-scroll">
              <table className="table-scheduled">
                <thead>
                  <tr className="table-scheduled-head-row">
                    <th className="table-scheduled-head">Nome</th>
                    <th className="table-scheduled-head">Observação</th>
                    <th className="table-scheduled-head">Agendado para</th>
                    {showPhoneColumn && (
                      <th className="table-scheduled-head">Telefone Contactado</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {dataToShow.map((item) => (
                    <tr
                      key={item.leads_id ? item.leads_id : item.id && item.id}
                      className="table-scheduled-row"
                      onClick={() => handleClick(item)}
                    >
                      <td className="table-scheduled-cell">
                        <span className="scheduled-name">
                          {item.leads_name || item.donor?.donor_name || "—"}
                        </span>
                      </td>
                      <td className="table-scheduled-cell">
                        <span className="observation-text" title={item.leads_observation || item.request_observation || "Sem observação"}>
                          {item.leads_observation || item.request_observation || "—"}
                        </span>
                      </td>
                      <td className="table-scheduled-cell">
                        <span className="date-info">
                          {item.leads_scheduling_date 
                            ? DataSelect(item.leads_scheduling_date)
                            : item.request_scheduled_date
                            ? new Date(item.request_scheduled_date).toLocaleDateString("pt-BR", {timeZone: "UTC"})
                            : "—"}
                        </span>
                      </td>
                      {showPhoneColumn && (
                        <td className="table-scheduled-cell">
                          <span className="phone-info">
                            {item.request_tel_success || item.leads_tel_success || "—"}
                          </span>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="table-scheduled-empty">
            <div className="empty-icon">📅</div>
            <h4>Nenhum agendamento</h4>
            <p>Não há fichas agendadas no momento.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableScheduled;
