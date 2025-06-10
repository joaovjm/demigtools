import { getOperators } from "../helper/getOperators";

export const distributePackageService = async (
  createPackage,
  setPerOperator,
  setUnassigned,
  setOperatorID,
  setOperatorName,
  setCreatePackage
) => {
  const response = await getOperators(
    true,
    "operator_name, operator_code_id, operator_type"
  );
  const opFilter = response
    .filter((op) => op.operator_type === "Operador")
    .map((op) => op.operator_code_id);

  const opName = response.reduce((acc, op) => {
    if (
      op.operator_type === "Operador" ||
      op.operator_type === "Operador Casa"
    ) {
      acc[op.operator_code_id] = op.operator_name;
    }
    return acc;
  }, {});
  const perOperator = {};
  const unassigned = [];

  createPackage?.forEach((donation) => {
    if (opFilter.includes(donation.operator_code_id)) {
      if (!perOperator[donation.operator_code_id]) {
        perOperator[donation.operator_code_id] = [];
      }
      perOperator[donation.operator_code_id].push(donation);
    } else {
      unassigned.push(donation);
    }
  });

  setPerOperator(perOperator);
  setUnassigned(unassigned);
  setOperatorID(opFilter);
  setOperatorName(opName);
};

export function assignPackage(selected, operatorID, createPackage, setCreatePackage) {
  const update = createPackage?.map((pkg) => {
    if (pkg.receipt_donation_id === selected) {
      return {
        ...pkg,
        operator_code_id: operatorID,
      };
    }
    return pkg;
  });
  setCreatePackage(update);
}
