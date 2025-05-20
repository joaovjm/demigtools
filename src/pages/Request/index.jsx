import { useEffect, useState } from "react";
import "./index.css";

const Request = () => {
  const [list1, setList1] = useState([
    { id: 1, name: "Item 1" },
    { id: 2, name: "Item 2" },
    { id: 3, name: "Item 3" },
    { id: 4, name: "Item 4" },
    { id: 5, name: "Item 5" },
  ]);

  const Items = () => (
    <div className="form-request-list1-items">
      {list1.map((item) => (
        <div className="form-request-list1-items-item" key={item.id}>
          {item.name}
        </div>
      ))}
    </div>
  );

  useEffect(() => {
    console.log("entrou no useEffect");
  }, [list1]);

  const handleAddItem = () => {
    setList1((prev) => [
      ...prev,
      { id: prev.length + 1, name: `Item ${prev.length + 1}` },
    ]);
  };

  return (
    <div>
      <h1>Development started</h1>
      <div className="form-request">
        <div className="form-request-list1">
          <h5>Lista 1</h5>
          <Items />
          <button onClick={handleAddItem} className="btn-add-item">
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default Request;
