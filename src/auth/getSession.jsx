import supabase from "../helper/superBaseClient";

const getSession = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  console.log(session);
};

export default getSession;