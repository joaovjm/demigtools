import React, { useEffect, useState } from "react";
import "./index.css";
import { getDonationsPrint } from "../../services/printService";
import { FaAngleRight } from "react-icons/fa";
import { getCollector } from "../../helper/getCollector";
import GenerateReceiptPDF from "../../components/GenerateReceiptPDF";
import supabase from "../../helper/superBaseClient";

const CheckPrint = () => {
  const [datePrint, setDatePrint] = useState("");
  const [selectType, setSelectType] = useState("Todos");
  const [printers, setPrinters] = useState([]);
  const [collectors, setCollectors] = useState([]);
  const [config, setConfig] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchCollectors = async () => {
    const response = await getCollector();
    setCollectors(response);
  };

  useEffect(() => {
    fetchCollectors();
  }, []);

  const fetchDonationsNoPrint = async () => {
    getDonationsPrint(setPrinters, datePrint);
    const { data, error } = await supabase.from("receipt_config").select();
    if (error) throw error;
    if (!error) {
      setConfig(data[0]);
    }
  };

  const selected = (id, collector) => {
    const collectorName = collectors.find(
      (f) => f.collector_code_id === Number(collector)
    );
    console.log(collectorName);
    setPrinters((prev) =>
      prev.map((item) =>
        item.receipt_donation_id === id
          ? {
              ...item,
              collector_code_id: collector,
              collector: { collector_name: collectorName.collector_name },
            }
          : item
      )
    );
  };

  const handlePrint = () => {
    setIsOpen(!isOpen);
  };

  /*const payload = generatePixPayload({
    pixKey: "+55 " + config.pixKey ,
    //description: "Doação Teste",
    merchantName: config.pixName,
    merchantCity: config.pixCity,
    amount: config.pixValue,
    txid: "DON123",
  });*/
  console.log(printers);
  return (
    <main className="checkprint-container">
      <div className="ckeckprint-container-header">
        <div className="input-field">
          <label>Data</label>
          <input
            type="date"
            value={datePrint}
            onChange={(e) => setDatePrint(e.target.value)}
          />
        </div>
        <div className="input-field">
          <label>Tipo</label>
          <select
            value={selectType}
            onChange={(e) => setSelectType(e.target.value)}
          >
            <option value="Todos">Todos</option>
            <option value="Avulso">Avulso</option>
            <option value="Mensal">Mensal</option>
          </select>
        </div>
        <button onClick={fetchDonationsNoPrint}>Buscar</button>
      </div>

      <div className="checkprint-container-body">
        <div className="checkprint-container-body-header">
          <div className="input-field">
            <label>Fichas Encontradas:</label>
            <p style={{ fontWeight: 700 }}>{printers.length}</p>
          </div>
          <GenerateReceiptPDF cards={printers} receiptConfig={config} />
          <button
            onClick={handlePrint}
            className={`chechprint-container-body-exibitionBtn ${
              isOpen ? "open" : "close"
            }`}
          >
            {<FaAngleRight />}
          </button>
        </div>
        {isOpen && (
          <div className="checkprint-container-body-body">
            {printers?.map((print) => (
              <div
                key={print.receipt_donation_id}
                className="checkprint-container-body-body-item"
              >
                <div className="input-field">
                  <label>Recibo</label>
                  <p>{print.receipt_donation_id}</p>
                </div>
                <div className="input-field">
                  <label>Nome</label>
                  <p>{print.donor.donor_name}</p>
                </div>
                <div className="input-field">
                  <label>Endereço</label>
                  <p>{print.donor.donor_address}</p>
                </div>
                <div className="input-field">
                  <label>Bairro</label>
                  <p>{print.donor.donor_neighborhood}</p>
                </div>
                <div className="input-field">
                  <label>Valor</label>
                  <p>
                    {print.donation_value.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </div>

                <div className="input-field">
                  <label>Coletador</label>
                  <select
                    value={print.collector_code_id || ""}
                    onChange={(e) =>
                      selected(print.receipt_donation_id, e.target.value)
                    }
                  >
                    <option value="" disabled>
                      Selecione...
                    </option>
                    {collectors?.map((collector) => (
                      <option
                        key={collector.collector_code_id}
                        value={collector.collector_code_id || ""}
                      >
                        {collector.collector_name || ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default CheckPrint;
