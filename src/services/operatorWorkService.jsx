import { toast } from "react-toastify";
import getReceiveDonationPerOperator from "../helper/getReceiveDonationPerOperator";
import { DataSelect } from "../components/DataTime";

const filterName = async (operatorWork) => {
  const operator = [
    ...new Map(
      operatorWork?.map((op) => [
        op.operator_name.operator_name,
        { name: op.operator_name.operator_name },
      ])
    ).values(),
  ];

  return operator;
};

//Retorna a quantidade de fichas recebidas e o valor total
const filterValueReceived = (operatorWork, metode) => {
  const countDonation = operatorWork.reduce((acc, item) => {
    const name = item.operator_name.operator_name;
    if (item.donation_received === "Sim") {
      acc[name] =
        (acc[name] || 0) + (metode === "count" ? 1 : item.donation_value);
      return acc;
    }
    return acc;
  }, {});

  return countDonation;
};

//Retorna a quantidade de fichas não recebidas e o valor total
const filterValueNotReceived = (operatorWork, metode) => {
  const countDonation = operatorWork.reduce((acc, item) => {
    const name = item.operator_name.operator_name;
    if (item.donation_received !== "Sim") {
      acc[name] =
        (acc[name] || 0) + (metode === "count" ? 1 : item.donation_value);
    }
    return acc;
  }, {});

  return countDonation;
};

export const operatorWorkService = async (startDate, endDate) => {
  if ([startDate, endDate].some((v) => v === "")) {
    toast.warning("Selecione as datas de inicio e fim!");
    return;
  }
  if (endDate < startDate) {
    toast.warning("A data final não pode ser menor que a data inicial");
    return;
  }

  const operatorWork = await getReceiveDonationPerOperator(startDate, endDate);
  const names = await filterName(operatorWork);
  const countReceived = await filterValueReceived(operatorWork, "count");
  const addValueReceived = await filterValueReceived(operatorWork);
  const countNotReceived = await filterValueNotReceived(operatorWork, "count");
  const addValueNotReceived = await filterValueNotReceived(operatorWork);

  return {
    names,
    countReceived,
    addValueReceived,
    countNotReceived,
    addValueNotReceived,
  };
};
