import { toast } from "react-toastify";
import supabase from "../helper/superBaseClient";

const NameOrCode = (login) => {
  if (/^\d{1,9}$/.test(login)) {
    return "code";
  } else {
    return "name";
  }
};

const GetOperator = async (nameOrCode, login) => {
  let column;
  if (nameOrCode == "code") {
    column = "operator_code_id";
  } else {
    column = "operator_name";
  }

  try {
    const { data, error } = await supabase
      .from("operator")
      .select(
        `
              operator_active,
              operator_name,
              operator_type,
              operator_uuid`
      )
      .eq(column, login);

    if (error) throw error;
    if (!error) {
      return data;
    }
  } catch (error) {
    console.log("Error: ", error.message);
  }
};

const OperatorSessionLogin = async (login, password) => {
  if (!login || !password) {
    toast.warning("Preencha os campos");
    return;
  }
  const nameOrCode = NameOrCode(login);
  const data = await GetOperator(nameOrCode, login);


  if (data.length > 0) {
    const username = data[0].operator_name;
    const login = username.normalize("NFD").replace(/[\u0300-\u036f\s]/g, "").toLocaleLowerCase();

    if (data[0].operator_active) {
      try {
        const { data: responseLogin, error } =
          await supabase.auth.signInWithPassword({
            email: `${login}@therocha.com`,
            password: password,
          });

        if (error) throw error;

        return responseLogin;
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      toast.error("Usuario desativado. Contacte o administrador");
    }
  } else {
    toast.error("Usuário não localizado");
  }
};

export default OperatorSessionLogin;
