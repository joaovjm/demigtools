import { FaMoneyCheckDollar } from "react-icons/fa6";
import styles from "./donorcard.module.css";

export const DonorCard = ({ donor, onClick }) => (
  <div
    key={donor.donor_id}
    className={styles.donorCard}
    onClick={() => onClick(donor.donor_id)}
  >
    <header className={styles.cardHeader}>
      <h3 className={styles.cardTitle}>
        <FaMoneyCheckDollar className={styles.cardIcon} /> 
        {donor.donor_name}
        {donor.operator_name && donor.isLead ? ` || ${donor.operator_name}` : ''}
      </h3>
    </header>
    <div className={styles.cardInfo}>
      <p><strong>End.:</strong> {donor.donor_address}</p>
      <p><strong>Tel.:</strong> {donor.donor_tel_1}</p>
      <p><strong>Bairro:</strong> {donor.donor_neighborhood}</p>
      <p><strong>Tipo:</strong> {donor.donor_type}</p>
    </div>
  </div>
);
