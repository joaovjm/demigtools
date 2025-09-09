import supabase from './superBaseClient';
import { toast } from 'react-toastify';

const updateRequestSelected = async (status, id, setModalOpen, setActive) => {
  console.log(status)
  console.log(id)
  
    try {
      const { data, error } = await supabase
        .from("request")
        .update({ request_status: status })
        .eq("id", id)
        .select();
      if (error) console.error(error);
      if (!error) {
        toast.success("Processo concluído com sucesso");
        setModalOpen(false);
        if (setActive) setActive("");
        console.log(data)
        return data;
      }
    } catch (error) {
      console.error(error.message);
    }
}

export default updateRequestSelected

