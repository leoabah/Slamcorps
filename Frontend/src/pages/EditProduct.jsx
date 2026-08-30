import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import productsApi from "../api/productsApi";
import { toast } from "react-toastify";
import "@/styles/editProduct.scss";
import { getImageUrl } from "@/utils/imageUrl";


export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const MAX_IMAGES = 4;

  // 1. Campos corregidos para coincidir con Mongoose (title, description)
  const [form, setForm] = useState({
    title: "",
    price: "",
    stock: "",
    category: "",
    description: ""
  });

  // Control híbrido de imágenes
  const [imageType, setImageType] = useState("file");
  const [files, setFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [urls, setUrls] = useState([""]);
  const [loading, setLoading] = useState(false);

  // 2. Traer los datos existentes del producto al cargar la página
  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await productsApi.get(`/${id}`);
        const product = response.data;
        
        setForm({
          title: product.title || "",
          price: product.price || "",
          stock: product.stock || "",
          category: product.category || "",
          description: product.description || ""
        });

        // Si el producto ya tenía imágenes guardadas, las precargamos en el modo correspondiente
        if (product.image && product.image.length > 0) {
          if (product.image[0].startsWith("/uploads/")) {
            setImageType("file");
            // Al ser rutas del servidor, mostramos las miniaturas apuntando al backend
            setImagePreviews(product.image.map(getImageUrl));
          } else {
            setImageType("url");
            setUrls(product.image);
          }
        }
      } catch (error) {
        console.error(error);
        toast.error("No se pudieron cargar los datos del producto");
      }
    };
    getProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Manejo de archivos físicos
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (!selectedFiles.length) return;

    const combined = [...files, ...selectedFiles].slice(0, MAX_IMAGES);
    setFiles(combined);
    setImagePreviews(combined.map((file) => URL.createObjectURL(file)));
  };

  // Manejo de URLs escritas
  const handleUrlChange = (index, value) => {
    const updateUrls = [...urls];
    updateUrls[index] = value;
    setUrls(updateUrls);
  };

  const addUrlField = () => {
    if (urls.length < MAX_IMAGES) setUrls([...urls, ""]);
  };

  // 3. Envío adaptado al controlador del backend
  const updateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    let payload;
    let headers = { "Authorization": `Bearer ${token}` };

    if (imageType === "file") {
      payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, value));
      
      // Solo adjuntamos archivos si el usuario seleccionó fotos NUEVAS
      if (files.length > 0) {
        files.forEach((file) => payload.append("image", file));
      }
      headers["Content-Type"] = "multipart/form-data";
    } else {
      const cleanUrls = urls.map((u) => u.trim()).filter((u) => u !== "");
      payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        imageURLs: cleanUrls.length > 0 ? cleanUrls : undefined 
      };
      headers["Content-Type"] = "application/json";
    }

    try {
      await productsApi.put(`/${id}`, payload, { headers });
      toast.success("Producto actualizado con éxito");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error al actualizar");
    } finally {
      setLoading(false);
    }
  };


return (
  <div className='edit-contain'>
    <section className='edit-container'>
      
    

      {/* Columna Derecha: Contenedor del Formulario */}
      <div className='edit-form-container'>
        <h1 className='edit-form-title'>Editar Producto</h1>
        
        <form className="edit-form" onSubmit={updateProduct}>
          
          <div className='form-group'>
            <label>Título:</label>
            <input type='text' name='title' value={form.title} onChange={handleChange} required />
          </div>

          <div className='form-group'>
            <label>Precio:</label>
            <input type="number" name='price' value={form.price} onChange={handleChange} required />
          </div>

          <div className='form-group'>
            <label>Descripción:</label>
            <textarea name='description' value={form.description} onChange={handleChange} />
          </div>

          <div className='form-group'>
            <label>Cantidad:</label>
            <input type="number" name='stock' value={form.stock} onChange={handleChange} required />
          </div>

          <div className='form-group'>
            <label>Categoría:</label>
            <div className='checkbox-group'>
              <label><input type="radio" name="category" value="short" checked={form.category === "short"} onChange={handleChange} /> Short</label>
              <label><input type="radio" name="category" value="pantalon" checked={form.category === "pantalon"} onChange={handleChange} /> Pantalón</label>
              <label><input type="radio" name="category" value="jogging" checked={form.category === "jogging"} onChange={handleChange} /> Jogging</label>
            </div>
          </div>

          {/* Caja contenedora híbrida de fotos */}
          <div className='form-group image-manager-box'>
            <label style={{ fontWeight: 'bold' }}>Método de carga de imágenes:</label>
            <div className="image-type-selector">
              <label><input type="radio" name="imageType" value="file" checked={imageType === "file"} onChange={() => setImageType("file")} /> Subir desde PC</label>
              <label><input type="radio" name="imageType" value="url" checked={imageType === "url"} onChange={() => setImageType("url")} /> Pegar URL</label>
            </div>

            {imageType === "file" ? (
              <div>
                <input type="file" name="image" accept="image/*" multiple onChange={handleFileChange} />
                {imagePreviews.length > 0 && (
                  <div className="image-previews">
                    {imagePreviews.map((preview, index) => (
                      <img key={index} src={preview} alt={`Vista previa ${index + 1}`} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                {urls.map((url, index) => (
                  <div key={index} className="url-input-row">
                    <input type="text" value={url} onChange={(e) => handleUrlChange(index, e.target.value)} />
                  </div>
                ))}
                <button type="button" className="btn-action" onClick={addUrlField}>+ Añadir URL</button>
              </div>
            )}
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar Cambios"}
          </button>

        </form>
      </div>
    </section>
  </div>
);
}