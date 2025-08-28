import React, { useEffect, useState } from "react";
import "./index.css";
import supabase from "../../helper/superBaseClient";
import { DataSelect } from "../../components/DataTime";

const DonationsReceived = () => {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [donationReceived, setDonationReceived] = useState([]);

  const fetchDonationReceived = async (i) => {
    let dateAdd;

    if (i >= 0) {
      const newDate = new Date(startDate);
      newDate.setDate(newDate.getDate() + i);
      const newDateAdd = newDate;
      dateAdd = DataSelect(newDateAdd, "noformated");
      
    } else {
      dateAdd = startDate;
      console.log("Chegou aqui");
    }
    try {
      const { data, error } = await supabase
        .from("donation")
        .select("donation_value")
        .eq("donation_day_received", dateAdd);

      if (error) throw error;
      if (data.length > 0) {
        const valueDonation = data.reduce(
          (acc, item) => acc + item.donation_value,
          0
        );
        const count = data.length;
        return { valueDonation, count, dateAdd };
      }
    } catch (error) {
      console.error(error);
    }
  };

  console.log(donationReceived)

  const handleDonationReceived = async () => {
    setDonationReceived([]);
    const diffTime = Math.abs(new Date(endDate) - new Date(startDate));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      const { valueDonation, count, dateAdd } = await fetchDonationReceived();
      setDonationReceived({ valueDonation, count, dateAdd });
    } else {
      for (let i = 0; i <= diffDays; i++) {
        const { valueDonation, count, dateAdd } = await fetchDonationReceived(i);
        setDonationReceived((prev) => [...prev, { valueDonation, count, dateAdd }]);
      }
    }
  };

  return (
    <div className="donation-received-container">
      <div className="donation-received-container-head">
        <div className="input-field">
          <label>Data Inicio</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="input-field">
          <label>Data Fim</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button onClick={handleDonationReceived}>Gerar</button>
      </div>
      <div className="donation-received-container-body">
        <table>
          <thead>
            <tr>
              <th>Dia</th>
              <th>Fichas</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {donationReceived?.map((item) => (
              <tr>
                <td>
                  {new Date(item.dateAdd).toLocaleDateString("pt-BR", {timeZone: 'UTC'}) || null}
                </td>
                <td>{item.count || 0}</td>
                <td>
                  {item.valueDonation?.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }) || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonationsReceived;
