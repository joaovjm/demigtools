import supabase from "./superBaseClient";

const getOperatorMeta = async (operator) => {
  console.log(operator)
  let query = supabase
    .from("operator_meta")
    .select(
      "id, meta, operator_code_id, operator_name: operator_code_id(operator_name), start_date"
    );
  if (operator) {
    query = query.eq("operator_code_id", operator);
  } else {
    query = query;
  }

  try {
    const { data, error } = await query;
    console.log(data)
    if (error) throw error;
    if (!error) return data;
  } catch (error) {
    console.log("Error: ", error.message);
  }
};

export default getOperatorMeta;
