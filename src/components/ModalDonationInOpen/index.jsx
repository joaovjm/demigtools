import { Navigate, useNavigate } from "react-router";
import "./index.css";

const ModalDonationInOpen = ({ donationOpen, onClose }) => {
  const navigate = useNavigate();
  return (
    <div className="modal-confirmations">
      <div className="modal-confirmations-content">
        <div className="modal-confirmations-div">
          <div className="modal-confirmations-title">
            <h2>Recibo: {donationOpen.receipt_donation_id}</h2>
            <button onClick={() => onClose()} className="btn-close">
              Fechar
            </button>
          </div>
          <div className="modal-confirmations-body">
            <label>Name: {donationOpen.donor_name}</label>
            <label>Endereço: {donationOpen.donor_address}</label>
            <label>Tel 1: {donationOpen.donor_tel_1}</label>
            <label>
              Tel 2:{" "}
              {donationOpen.donor_tel_2
                ? donationOpen.donor_tel_2
                : "*****-****"}
            </label>
            <label>
              Tel 3:{" "}
              {donationOpen.donor_tel_3
                ? donationOpen.donor_tel_3
                : "*****-****"}
            </label>
            <label>Valor: R$ {donationOpen.donation_value},00</label>
            <h4>Motivo: {donationOpen.donation_confirmation_reason}</h4>
          </div>

          <div className="modal-confirmation-body">
            <button
              onClick={() => navigate(`/donor/${donationOpen.donor_id}`)}
              className="btn-open-donation"
            >
              Abrir doador
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDonationInOpen;
