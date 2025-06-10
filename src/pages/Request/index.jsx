import { useEffect, useState } from "react";
import "./index.css";
import DateSelected from "../../components/Request/DateSelected";
import DonationValues from "../../components/Request/DonationValues";
import CreatePackage from "../../components/Request/CreatePackage";
import DonationTable from "../../components/Request/DonationTable";
import RequestCard from "../../components/Request/RequestCard";
import {distributePackageService} from "../../services/distributePackageService";

const Request = () => {
  const [dataForm, setDataForm] = useState(false);
  const [filterForm, setFilterForm] = useState(false);
  const [requestForm, setRequestForm] = useState(false);
  const [createPackage, setCreatePackage] = useState([]);
  const [date, setDate] = useState([]);
  const [perOperator, setPerOperator] = useState({});
  const [unassigned, setUnassigned] = useState([]);
  const [operatorID, setOperatorID] = useState([]);
  const [operatorName, setOperatorName] = useState({});
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    distributePackageService(
      createPackage,
      setPerOperator,
      setUnassigned,
      setOperatorID,
      setOperatorName
    );
  }, [createPackage]);

  return (
    <div className="request-main">
      <div className="request-front">
        <div className="request-front-left">
          <CreatePackage
            setDataForm={setDataForm}
            setCreatePackage={setCreatePackage}
            setDate={setDate}
          />

          {dataForm ? (
            <DateSelected
              date={date}
              setDataForm={setDataForm}
              setFilterForm={setFilterForm}
            />
          ) : filterForm ? (
            <DonationValues
              createPackage={createPackage}
              setFilterForm={setFilterForm}
              setRequestForm={setRequestForm}
            />
          ) : (
            requestForm && (
              <DonationTable
                unassigned={unassigned}
                selected={selected}
                setSelected={setSelected}
              />
            )
          )}
        </div>
        {requestForm && (
          <div className="request-front-right">
            {operatorID?.map((cp) => (
              <RequestCard
                perOperator={perOperator[cp]}
                setPerOperator={setPerOperator}
                key={cp}
                operatorName={operatorName[cp]}
                operatorID={cp}
                selected={selected}
                setSelected={setSelected}
                createPackage={createPackage}
                setCreatePackage={setCreatePackage}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Request;
