import supabase from "./superBaseClient";

const GetLeads = async (
  itemsPerPage,
  currentPage,
  setItems,
  setTotalItems,
) => {


  try {
    const from = (currentPage - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;

    const { data, error, count } = await supabase
      .from("leads")
      .select("*", { count: "exact" })
      .range(from, to);

    if (error) throw error;

    setItems(data);
    setTotalItems(count);
  } catch (error) {
    console.error("Erro ao buscar os dados", error.message);
  }
};

export default GetLeads;
