import { useEffect, useState } from "react";
import productsApi from "../api/productsApi";
import { FaSearch } from "react-icons/fa";
import "../styles/admin/adminDashboard.scss";

import Sidebar from "../components/admin/Sidebar";
import HearderAdmin from "../components/admin/HeaderAdmin";
import ProductTable from "../components/admin/ProductTable";
import DashboardCards from "../components/admin/DashboardCards";
import SearchBar from "../components/admin/SearchBar";


export default function AdminDashboard() {

    const [search , setSearch]=useState("");
    
    const [ products, setProducts]= useState([]);

const filteredProducts = products.filter(product => product.title
.toLowerCase()
.includes(search.toLowerCase())
);

 const handleDelete = async(id) =>{

    const confirmar = window.confirm(
        "Eliminar producto?"
    );

    if(!confirmar) return;

    try{
await productsApi.delete(`/${id}`);
   
    setProducts(
        products.filter(
            product => 
            product._id !== id
        )
    );
    } catch(error){
        console.error(error);
    }

 };


  useEffect(() =>{

    const getProducts = async() => {

        try{
            const response = 
            await productsApi.get("/");

            setProducts(
                response.data
            );
        } catch  (error){

            console.error(error);

        }
    };

    getProducts();

  }, []);

     const totalProducts = products.length;

    const totalStock = products.reduce((acc, product)=> acc + product.stock,
    0
);

    
    const totalValue = products.reduce(
        (acc, product) => acc +(product.price * product.stock),
        0
    );

return (

    <div className="admin-layout">

        <Sidebar />
        
    <main className="admin-content">
            
        <HearderAdmin />
            
        <DashboardCards
            totalProducts={totalProducts}
            totalStock={totalStock}
            totalValue={totalValue}
            totalOrders={0}

        />

        <div className="products-section">

            <div className="products-top">

                <h2>Productos</h2>

                  <SearchBar

                    search={search}

                    setSearch={setSearch}

                  />
            </div>

            <ProductTable

               products={filteredProducts}

               handleDelete={handleDelete}

            />

           
        </div>
        

    </main>

    </div>
);
}