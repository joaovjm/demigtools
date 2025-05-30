import supabase from "./superBaseClient";

const getOperatorMeta = async (operator) => {
  let query = supabase
    .from("operator_meta")
    .select(
      "id, meta, operator_code_id, operator_name: operator_code_id(operator_name), start_date"
    );
  if (operator) {
    query = await query.eq("operator_code_id", operator);
  } else {
    query = await query;
  }

  try {
    const { data, error } = query;
    if (error) throw error;
    if (!error) return data;
  } catch (error) {
    console.log("Error: ", error.message);
  }
};

export default getOperatorMeta;
