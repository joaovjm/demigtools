import { PiMagnifyingGlassBold } from "react-icons/pi";
import  Loader  from "../../components/Loader"

export const SearchForm = ({searchTerm, selectedValue, loading, onSearchChange, onValueChange, onSearchSubmit}) => (
  <form onSubmit={onSearchSubmit} className="formsearch">
    <div className="input-field">
      <label >Buscar Doador</label>
      <input
        type="text"
        name="buscardoador"
        value={searchTerm}
        onChange={onSearchChange}
      />
    </div>
    <div className="input-field">
      <label htmlFor="dropdown" >
        Tipo
      </label>
      <select id="dropdown" value={selectedValue} onChange={onValueChange}>
        <option value="todos">Todos</option>
        <option value="avulso">Avulso</option>
        <option value="lista">Lista</option>
        <option value="mensal">Mensal</option>
      </select>
    </div>

    <button className="btnsearch" type="submit">
      {loading ? (
        <Loader className="loadersearch" />
      ) : (
        <PiMagnifyingGlassBold  style={{ fontSize: 32 }}/>
      )}{" "}
    </button>
  </form>
);
