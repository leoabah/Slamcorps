 import { FaSearch } from "react-icons/fa";
 
 export default function SearchHome({search, setSearch}) {


   return (
    
             <div className="search-Bar">
     
                 <input
                 type="text"
                 placeholder="buscar Producto..."
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 />
                 <button>
                    <FaSearch/>
                 </button>
     
             </div>
         );
 }
 