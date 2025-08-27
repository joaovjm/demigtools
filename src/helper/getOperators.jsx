import supabase from "./superBaseClient";

export const getOperators = async ({ active, item, from, to }) => {
  let query = supabase.from("operator");
  console.log(item);
  if (item) {
    query = query.select(item);
  } else {
    query = query.select();
  }
  if (active) query = query.eq("operator_active", active);

  const { data, error } = await query
    .select("*", { count: "exact" })
    .range(from, to)
    .order("operator_code_id", {ascending: false});

  if (data) {
    return data;
  }
  if (error) {
    return error;
  }
};
