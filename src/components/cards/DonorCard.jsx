import { FaMoneyCheckDollar } from "react-icons/fa6";

export const DonorCard = ({ donor, onClick }) => (
  <div
    key={donor.donor_id}
    className="Cardform"
    onClick={() => onClick(donor.donor_id)}
  >
    <header>
      <h3>
        <FaMoneyCheckDollar /> {donor.donor_name}{donor.operator_name && ` || ${donor.operator_name}`}
      </h3>
    </header>
    <div className="Cardinfo">
      <p>End.: {donor.donor_address}</p>
      <p>Tel.: {donor.donor_tel_1}</p>
      <p>Bairro: {donor.donor_neighborhood}</p>
      <p>Tipo: {donor.donor_type}</p>
    </div>
  </div>
);
