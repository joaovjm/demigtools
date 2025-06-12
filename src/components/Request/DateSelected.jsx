import React from "react";
import { ICONS } from "../../constants/constants";

const DateSelected = ({ date, setDataForm, setFilterForm, setContinueClick }) => {

  const handleDateForm = () => {
    setFilterForm(true)
    setDataForm(false)
    setContinueClick(true);
  }
  return (
    <div className="request-front-left-bottom">
      <div className="request-front-left-bottom-header">
        <label>DATA</label>
        <button onClick={handleDateForm}>Continuar</button>
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
