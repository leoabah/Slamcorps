import { Link } from "react-router-dom";
import{ FaPen, FaTrash, FaPlus } from "react-icons/fa";



export default function ProductTable({
    products,
    handleDelete
}) {
    return(
       <div className="products-section">

        <div className="product-header">

            <h2>Productos</h2>

            <Link to="/alta" className="btn-add">
                <FaPlus />
                Añadir Producto
            </Link>

        </div>

        <div className="table-container">
             <table className="product-table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product =>(
                        <tr key={product._id}>
                            <td>
                                <img 
                                 src={product.image[0]}
                                 alt={product.title}
                                 className="table-image"
                                  />
                            </td>
                            <td>{product.title}</td>
                            <td>
                                $
                                {product.price.toLocaleString(
                                    "es-Ar"
                                )}
                            </td>
                            <td>{product.stock}</td>
                            <td className="actions">
                                <Link 
                                  to={`/edit/${product._id}`}>
                                    <button className="btn-edit" >

                                        <FaPen />
                                        Editar

                                    </button>

                                </Link>

                                   <button
                                   
                                   className="btn-delete"
                                    onClick={()=>
                                        handleDelete(product._id)}>

                                            <FaTrash />

                                   </button>
                            </td>
                        </tr>
                    ))}

                </tbody>

             </table>
        </div>
       </div>
    );
}