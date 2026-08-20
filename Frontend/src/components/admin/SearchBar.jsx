import { FaSearch } from "react-icons/fa";
import "../../styles/admin/_searchBar.scss"

export default function SearchBar({
    search, setSearch
}){
    return(
        <div className="search-Bar">
            <FaSearch className="search-icon" />

            <input
            type="text"
            placeholder="buscar Producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            />

        </div>
    );
}