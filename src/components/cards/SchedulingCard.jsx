import React, { useEffect, useState } from "react";

const SchedulingCard = ({ operatorCount, setDonationFilterPerId }) => {

  const [operators, setOperators] =useState([])
  const [count, setCount] =useState()
  const operatorInfo = [
    ...new Map(
      operatorCount?.map((operators) => [
        operators.operator_code_id,
        { id: operators.operator_code_id, name: operators.operator_name.operator_name },
      ])
      
    ).values(),
  ];

  const counting = operatorCount?.reduce((acc, count) => {
    acc[count.operator_code_id] = (acc[count.operator_code_id] || 0) + 1;
    return acc;
  }, {});

  useEffect(() => {
    setOperators(operatorInfo)
    setCount(counting)
 

  }, [operatorCount])
  

  const handleClick = (id) => {
    setDonationFilterPerId(id);
  };
  
  return (
    operators?.length > 0 ? (
      operators.map((operator) => (
      <div
        onClick={() => handleClick(operator.id)}
        className="section-operators-card"
        key={operator.id}
      >
        <div>{operator.name}</div>
        <div className="section-operators-card-value">
          <label>{count[operator.id]}</label>
        </div>
      </div>
    ))) : <></>
    
    
  )
  
  
};

export default SchedulingCard;
