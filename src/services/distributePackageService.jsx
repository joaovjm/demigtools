import { getOperators } from "../helper/getOperators";

export const distributePackageService = async (
  createPackage,
  setPerOperator,
  setUnassigned,
  setOperatorID,
  setOperatorName
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

  const newPerOperator = {};
  const unassigned = [];

  createPackage?.forEach((donation) => {
    if (opFilter.includes(donation.operator_code_id)) {
      if (!newPerOperator[donation.operator_code_id]) {
        newPerOperator[donation.operator_code_id] = [];
      }
      newPerOperator[donation.operator_code_id].push(donation);
    } else {
      unassigned.push(donation);
    }
  });

  setPerOperator(newPerOperator);
  setUnassigned(unassigned);
  setOperatorID(opFilter);
  setOperatorName(opName);
};

export function assignPackage(
  selected,
  operatorID,
  createPackage,
  setCreatePackage
) {
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

export function removePackage(createPackage, setCreatePackage, operatorID) {
  let updated = false;
  const update = createPackage.map((pkg) => {
    if (pkg.operator_code_id === operatorID) {
      if (updated === false) {
        updated = true;
        return { ...pkg, operator_code_id: "" };
      }
    }
    return pkg;
  });
  setCreatePackage(update);
}

export function assignAllPackage(
  createPackage,
  unassigned,
  operatorID,
  setCreatePackage,
  maxValue,
  countValue
) {
  let count = countValue;
  const update = createPackage?.map((pkg) => {
    if (
      unassigned.some(
        (item) => item.receipt_donation_id === pkg.receipt_donation_id
      )
    ) {
      if (count < maxValue) {
        if (count + pkg.donation_value > maxValue) {
          return pkg;
        }
        count = count + pkg.donation_value;
        return {
          ...pkg,
          operator_code_id: operatorID,
        };
      }
    }
    return pkg;
  });
  setCreatePackage(update);
}

export function removeAllPackage(createPackage, operatorID, setCreatePackage) {
  const update = createPackage?.map((pkg) => {
    if (pkg.operator_code_id === operatorID) {
      return {
        ...pkg,
        operator_code_id: null,
      };
    }
    return pkg;
  });
  setCreatePackage(update);
}

export async function addEndDataInCreatePackage(createPackage, setCreatePackage, endDateRequest) {
  const update = createPackage?.map((pkg) => ({
    ...pkg, request_end_date: endDateRequest
  }))

  await setCreatePackage(update)
  return update;
}
