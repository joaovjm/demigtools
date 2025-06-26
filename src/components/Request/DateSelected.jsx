import React, { useState } from "react";
import { ICONS } from "../../constants/constants";
import Loader from "../Loader";

const DateSelected = ({ date, setDataForm, setFilterForm, setContinueClick }) => {
  const [loading, setLoading] = useState(false);

  const handleDateForm = () => {
    setLoading(true)
    setFilterForm(true)
    setDataForm(false)
    setContinueClick(true);
    setLoading(false)
  }
  return (
    <div className="request-front-left-bottom">
      <div className="request-front-left-bottom-header">
        <label>DATA</label>
        <button onClick={handleDateForm}>{loading ? <Loader/> : "Continuar"}</button>
      </div>

      {date?.map((data, index) => (
        <div key={index} className="request-front-left-bottom-body">
          <label>
            {data.startDate} --- {data.endDate}
          </label>
          <p>{ICONS.CONFIRMED}</p>
        </div>
      ))}
    </div>
  );
};

export default DateSelected;
