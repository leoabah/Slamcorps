import { useEffect,useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import productsApi from "../api/productsApi";
import { toast } from "react-toastify";

export default function EditProduct() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [form, setForm]= useState({
        name:"",
        price:"",
        stock:"",
        image:"",
    });
    
    useEffect(() =>{

        const getProduct = async() =>{
             try {

                const response =
                 await productsApi.get(
                    `/${id}`
                );
                setForm(
                    response.data
                );
             } catch(error){
                console.log(error);
             }
        };

        getProduct();
    },[id]);

    const handleChange = (e) =>{
        const {name,value} =
        e.target;
        setForm({
            ...form,
            [name]:value
        });
    };

    const updateProduct = async(e) =>{
        e.preventDefault();
        try{
            await productsApi.put(
                `/${id}`,
                form
            );
            toast.success(
                "producto actualizado"
            );
            navigate("/");
        } catch(error) {
            console.error(error);
            toast.error(
                "error al actualizar"
            );
        }
    }

    return(
        <div className="edit-container">
            <h1>
                Editar Producto
            </h1>
            <form onSubmit={updateProduct}>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Nombre"
                  />

                   <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Precio"
                  />
                   <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="Stock"
                  />
                   <input
                  type="text"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="Image"
                  />
                 <button type="submit">
                    Guardar Cambios
                 </button>
            </form>
        </div>
    );
}