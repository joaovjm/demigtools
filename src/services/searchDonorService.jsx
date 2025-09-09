import searchDonor from "../helper/searchDonor"

const fetchDonors = async (searchTerm, selectedValue, setLoading, setDonor) => {
  try {
    setLoading(true);
    const type = selectedValue !== "todos" ? selectedValue : "";
    const data = await searchDonor(searchTerm, type);
    setDonor(data);
    console.log(data)
  } catch (error) {
    console.log("Falha ao encontrar doador: ", error.message);
  } finally {
    setLoading(false);
  }
};

export default fetchDonors;
