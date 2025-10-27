import React, { useEffect, useState } from "react";


const CollectorCard = ({ operatorCount, setDonationFilterPerId }) => {
  
  const [collectors, setCollectors] = useState([])
  const [count, setCount] = useState()
  const [add, setAdd] = useState(0)
  const [active, setActive] = useState()

  const collectorInfo = [
    ...new Map(
      operatorCount?.map((donation) => [
        donation.collector_code_id,
        { id: donation.collector_code_id, name: donation.collector_name || "Sem Coletador" },
      ])
    ).values(),
  ];

  const counting = operatorCount?.reduce((acc, item) => {
    acc[item.collector_code_id] = (acc[item.collector_code_id] || 0) + 1;
    return acc;
  }, {});

  const countingValue = operatorCount?.reduce((add, item) => {
    add[item.collector_code_id] = (add[item.collector_code_id] || 0) + item.donation_value
    return add
  }, {})

  useEffect(() => {
    setCollectors(collectorInfo)
    setCount(counting)
    setAdd(countingValue)
  }, [])

  const handleClick = (id) => {
    setDonationFilterPerId(id);
    setActive(id)
  };

  return (
    collectors?.length > 0 ? (
      collectors.map((collector) => (
      <div
        onClick={() => handleClick(collector.id)}
        className={`section-operators-card ${active === collector.id ? "active" : ""}`}
        key={collector.id}
      >
        <div>{collector.name}</div>
        <div className="section-operators-card-value">
          <label>{count[collector.id]}</label>
          <label>R$ {add[collector.id]?.toFixed(2).replace('.',',') || '0,00'}</label>
        </div>
      </div>
    ))) : <></>
    
    
  )
  
  
};

export default CollectorCard;

