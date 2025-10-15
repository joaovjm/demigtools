import { useNavigate } from "react-router";
import { FaUser, FaMapMarkerAlt, FaPhone, FaDollarSign, FaExclamationTriangle, FaEye } from "react-icons/fa";
import "./index.css";

const ModalDonationInOpen = ({ donationOpen, onClose }) => {
  const navigate = useNavigate();
  
  return (
    <main className="modal-donation-in-open-container">
      <div className="modal-donation-in-open">
        <div className="modal-donation-in-open-content">
          <div className="modal-donation-in-open-header">
            <div className="modal-title-section">
              <h2 className="modal-title">
                <FaExclamationTriangle />
                Doação em Aberto
              </h2>
              <span className="receipt-number">
                Recibo: #{donationOpen.receipt_donation_id}
              </span>
            </div>
            <button
              onClick={() => onClose()}
              className="btn-close-modal"
              title="Fechar"
            >
              ✕
            </button>
          </div>

          <div className="modal-donation-in-open-body">
            <div className="donation-info-section">
              <h3>Informações da Doação</h3>
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-label">
                    <FaDollarSign />
                    Valor
                  </div>
                  <div className="info-value">
                    R$ {donationOpen.donation_value},00
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">
                    <FaExclamationTriangle />
                    Motivo
                  </div>
                  <div className="info-value reason">
                    {donationOpen.donation_confirmation_reason}
                  </div>
                </div>
              </div>
            </div>

            <div className="donor-info-section">
              <h3>Dados do Doador</h3>
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-label">
                    <FaUser />
                    Nome
                  </div>
                  <div className="info-value">
                    {donationOpen.donor_name}
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">
                    <FaMapMarkerAlt />
                    Endereço
                  </div>
                  <div className="info-value">
                    {donationOpen.donor_address}
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">
                    <FaPhone />
                    Telefone 1
                  </div>
                  <div className="info-value">
                    {donationOpen.donor_tel_1}
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">
                    <FaPhone />
                    Telefone 2
                  </div>
                  <div className="info-value">
                    {donationOpen.donor_tel_2 || "*****-****"}
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">
                    <FaPhone />
                    Telefone 3
                  </div>
                  <div className="info-value">
                    {donationOpen.donor_tel_3 || "*****-****"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-donation-in-open-footer">
            <button
              onClick={() => navigate(`/donor/${donationOpen.donor_id}`)}
              className="btn-view-donor"
            >
              <FaEye />
              Abrir Doador
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ModalDonationInOpen;
