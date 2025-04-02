import insertOperators from "../helper/insertOperators"
import SignUp from "./SignUp"

const UsersToOperators = async ({cod, operator, password, type}) => {
    const email = `${operator}@therocha.com`
    const signUp = await SignUp({email, password})

    if (signUp.user){
        const uuid = signUp.user.id;
        try{
            const data = await insertOperators(cod, operator, password, type, uuid)
            return "OK"
        } catch (error) {
            console.error("Erro: ", error.message)
        }
        
    }
}

export default UsersToOperators;