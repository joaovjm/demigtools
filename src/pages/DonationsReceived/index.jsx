import React, { useEffect, useState } from "react";
import "./index.css";
import supabase from "../../helper/superBaseClient";
import { DataSelect } from "../../components/DataTime";
import Loader from "../../components/Loader";

const DonationsReceived = () => {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [donationReceived, setDonationReceived] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState();
  const [totalValue, setTotalValue] = useState();

  const fetchDonationReceived = async (i) => {
    let dateAdd;

    if (i >= 0) {
      const newDate = new Date(startDate);
      newDate.setDate(newDate.getDate() + i);
      const newDateAdd = newDate;
      dateAdd = DataSelect(newDateAdd, "noformated");
    } else {
      dateAdd = startDate;
    }
    try {
      const { data, error } = await supabase
        .from("donation")
        .select("donation_value")
        .eq("donation_day_received", dateAdd);

      if (error) throw error;
      if (data) {
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

  const handleDonationReceived = async () => {
    setIsLoading(true);
    setDonationReceived([]);
    let totalCount = 0;
    let totalValue = 0;
    const diffTime = Math.abs(new Date(endDate) - new Date(startDate));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      const { valueDonation, count, dateAdd } = await fetchDonationReceived();
      setDonationReceived([{ valueDonation, count, dateAdd }]);
    } else {
      for (let i = 0; i <= diffDays; i++) {
        const { valueDonation, count, dateAdd } = await fetchDonationReceived(
          i
        );
        setDonationReceived((prev) => [
          ...prev,
          { valueDonation, count, dateAdd },
        ]);

        totalValue = totalValue + valueDonation;
        totalCount = totalCount + count;
      }
    }
    
    setTotalValue(totalValue);
    setTotalCount(totalCount);
    setIsLoading(false);
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
        <button style={{ width: 80 }} onClick={handleDonationReceived}>
          {isLoading ? <Loader /> : "Gerar"}
        </button>
      </div>
      <div className="donation-received-container-body">
        {donationReceived.length > 0 ? (
          <table className="donation-received-table">
            <thead>
              <tr className="donation-received-table-tr">
                <th>Dia</th>
                <th>Fichas</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {donationReceived?.map((item, index) => (
                <tr key={index} className="donation-received-table-body-tr">
                  <td>
                    {new Date(item.dateAdd).toLocaleDateString("pt-BR", {
                      timeZone: "UTC",
                    }) || null}
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
        ) : null}
      </div>
      {donationReceived.length > 0 ? (
        <div className="donation-received-result">
          <label>Fichas: {totalCount}</label>
          <label>
            Total Geral:{" "}
            {totalValue?.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </label>
        </div>
      ) : null}
    </div>
  );
};

export default DonationsReceived;
