import React from "react";
import "./index.css";
import TableDonationsInOperatorsAndCollectors from "../tables/TableDonationsInOperatorsAndCollectors";
const ModalOperatorsAndCollectorsWork = ({
  click,
  startDate,
  endDate,
  filter,
  setModalOpen
}) => {
    const handleOther = () => {

    }
  return (
    <div className="modal-area">
      <div className="modal-area-container">
        <div className="modal-area-container-header">
            <h3>{click.name}</h3>
            <button className="modal-area-container-header-button-exit" onClick={() => setModalOpen(false)}>Fechar</button>
        </div>
        <div className="modal-area-container-body">
          <TableDonationsInOperatorsAndCollectors
            click={click}
            startDate={startDate}
            endDate={endDate}
            filter={filter}
          />
        </div>
      </div>
    </div>
  );
};

export default ModalOperatorsAndCollectorsWork;
