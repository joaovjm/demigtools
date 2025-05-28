import React from "react";
import { getLeadsHistory } from "../helper/getLeadsHistory";

const getNameOperator = (leads) => {
    console.log(leads)
  const operator = [
    ...new Map(
      leads?.map((history) => [
        history.operator_name,
        {
          name: history.operator_name,
        },
      ])
    ).values(),
  ];

  return operator;
};

export const leadsHistoryService = async () => {
  const { leads, leadsCasa } = await getLeadsHistory();
  const operator = getNameOperator(leads);
  console.log(operator)
};
