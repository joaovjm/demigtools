import React, { useState } from "react";
import { setActivityHistoric } from "../../helper/setActivityHistoric";

const WorkHistory = () => {
  const [timeZone, setTimeZone] = useState()

  const handleTimeZone = async () => {
    const response = setActivityHistoric()
    setTimeZone(response)
  }
  return (
    <>
      <button onClick={handleTimeZone}>Aperte</button>

      <div>
        
      </div>
    </>
  );
};

export default WorkHistory;
