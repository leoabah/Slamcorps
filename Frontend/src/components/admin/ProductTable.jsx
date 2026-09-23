import { Link } from "react-router-dom";
import{ FaPen, FaTrash, FaPlus } from "react-icons/fa";
import { getImageUrl } from "@/utils/imageUrl";



export default function ProductTable({
    products,
    handleDelete
}) {
    return(
       <div className="products-section">

        <div className="product-header">

            <h2>Productos</h2>

            <Link to="/alta" 
            className="btn-add"
            style={{
                textDecoration:"none",
                color:"white",
                backgroundColor:"#4CAF50",
                border:"none",
                padding:"5px",
                borderRadius:"4px",
                cursor:"pointer"
            }}
            >
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
                                 src={getImageUrl(product.image?.[0])}
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
                            {/* 🟢 CÓDIGO NUEVO ADAPTADO A TALLES */}
                           <td>
                                {(() => {
                                 // Calculamos el stock total del producto para la fila
        const tStock = product.stock && typeof product.stock === 'object'
            ? Object.values(product.stock).reduce((a, b) => a + (b || 0), 0)
            : 0;
            
        // Si el backend te devuelve un desglose, creamos un texto descriptivo interactivo
        const sizesTooltip = product.stock && typeof product.stock === 'object'
            ? `S: ${product.stock.S || 0} | M: ${product.stock.M || 0} | L: ${product.stock.L || 0} | XL: ${product.stock.XL || 0}`
            : 'Sin desglose';

        return (
            <span title={sizesTooltip} style={{ cursor: 'help', fontWeight: '500' }}>
                {tStock} <small style={{ color: '#777', fontSize: '0.8rem' }}>({sizesTooltip})</small>
            </span>
        );
    })()}
</td>


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