import React, { useEffect, useState } from "react";

const ConfirmationCard = ({ operatorCount, setDonationFilterPerId }) => {
  
  const [operators, setOperators] =useState([]);
  const [count, setCount] =useState();
  const [add, setAdd] = useState();
  const [active, setActive] = useState();
  const operatorInfo = [
    ...new Map(
      operatorCount?.map((operators) => [
        operators.operator_code_id,
        { id: operators.operator_code_id, name: operators.operator_name },
      ])
    ).values(),
  ];

  const counting = operatorCount?.reduce((acc, count) => {
    acc[count.operator_code_id] = (acc[count.operator_code_id] || 0) + 1;
    return acc;
  }, {});

  const countingValue = operatorCount?.reduce((add, item) => {
    add[item.operator_code_id] = (add[item.operator_code_id] || 0) + item.donation_value
    return add
  }, {})

  useEffect(() => {
    setOperators(operatorInfo)
    setCount(counting)
    setAdd(countingValue)
  }, [])
  

  const handleClick = (id) => {
    setDonationFilterPerId(id);
    setActive(id)
  };

  return (
    operators?.length > 0 ? (
      operators.map((operator) => (
      <div
        onClick={() => handleClick(operator.id)}
        className={`section-operators-card ${active === operator.id ? "active" : ""}`}
        key={operator.id}
      >
        <div>{operator.name}</div>
        <div className="section-operators-card-value">
          <label>{count[operator.id]}</label>
          <label>R$ {add[operator.id]}</label>
        </div>
      </div>
    ))) : <></>
    
    
  )
  
  
};

export default ConfirmationCard;
