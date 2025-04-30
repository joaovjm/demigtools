import supabase from "./superBaseClient";

const GetLeads = async (
) => {
  try {
    //const from = (currentPage - 1) * itemsPerPage;
    //const to = from + itemsPerPage - 1;
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("leads_status", "Nunca Ligado")
      .order("leads_id", { ascending: true })

    if (error) throw error;

    return data
  
  } catch (error) {
    console.error("Erro ao buscar os dados", error.message);
  }
};

export default GetLeads;

// export default function ProdutoViewer() {
//   const [categoria, setCategoria] = useState('eletronicos')
//   const [produto, setProduto] = useState(null)
//   const [ultimoId, setUltimoId] = useState(null)

//   // Buscar o primeiro produto da categoria ao trocar o filtro
//   useEffect(() => {
//     const fetchPrimeiroProduto = async () => {
//       const { data, error } = await supabase
//         .from('produtos')
//         .select('*')
//         .eq('categoria', categoria)
//         .order('id', { ascending: true })
//         .limit(1)
//         .single()

//       if (error) {
//         console.error(error)
//         setProduto(null)
//         setUltimoId(null)
//       } else {
//         setProduto(data)
//         setUltimoId(data.id)
//       }
//     }

//     fetchPrimeiroProduto()
//   }, [categoria])

//   const buscarProximo = async () => {
//     const { data, error } = await supabase
//       .from('produtos')
//       .select('*')
//       .eq('categoria', categoria)
//       .gt('id', ultimoId) // id maior que o atual
//       .order('id', { ascending: true })
//       .limit(1)
//       .single()

//     if (error || !data) {
//       console.log('Fim da lista ou erro:', error)
//     } else {
//       setProduto(data)
//       setUltimoId(data.id)
//     }
//   }

//   return (
//     <div>
//       <select onChange={(e) => setCategoria(e.target.value)}>
//         <option value="eletronicos">Eletrônicos</option>
//         <option value="livros">Livros</option>
//         <option value="roupas">Roupas</option>
//       </select>

//       {produto ? (
//         <div>
//           <h2>{produto.nome}</h2>
//           <p>ID: {produto.id}</p>
//           <p>Categoria: {produto.categoria}</p>
//         </div>
//       ) : (
//         <p>Nenhum produto encontrado.</p>
//       )}

//       <button onClick={buscarProximo}>
//         Próximo
//       </button>
//     </div>
//   )
// }