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

  // 1. Inicialización de los estados base del producto
  const [form, setForm] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    stock: {
      S: 0,
      M: 0,
      L: 0,
      XL: 0
    }
  });

  // Control híbrido de imágenes
  const [imageType, setImageType] = useState("file");
  const [files, setFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [urls, setUrls] = useState([""]);
  const [loading, setLoading] = useState(false);

  // 2. Carga y mapeo seguro de datos del producto existente
  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await productsApi.get(`/${id}`);
        const product = response.data;
        
        // Sincronización del stock previniendo valores nulos o corruptos
        const parsedStock = product.stock && typeof product.stock === "object"
          ? {
              S: product.stock.S ?? 0,
              M: product.stock.M ?? 0,
              L: product.stock.L ?? 0,
              XL: product.stock.XL ?? 0
            }
          : { S: 0, M: 0, L: 0, XL: 0 };

        setForm({
          title: product.title || "",
          price: product.price || "",
          category: product.category || "",
          description: product.description || "",
          stock: parsedStock
        });

        // Formateo seguro para la carga de imágenes existentes
        if (product.image && product.image.length > 0) {
          const imagesArray = Array.isArray(product.image) ? product.image : [product.image];
          const firstImage = imagesArray[0] || "";
          
          if (firstImage.startsWith("/uploads/")) {
            setImageType("file");
            setImagePreviews(imagesArray.map(getImageUrl));
          } else {
            setImageType("url");
            setUrls(imagesArray);
          }
        }
      } catch (error) {
        console.error("❌ Error cargando producto:", error);
        toast.error("No se pudieron cargar los datos del producto");
      }
    };
    getProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSizeStockChange = (size, value) => {
    setForm((prevForm) => ({
      ...prevForm,
      stock: {
        ...prevForm.stock,
        [size]: Number(value)
      }
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (!selectedFiles.length) return;

    const combined = [...files, ...selectedFiles].slice(0, MAX_IMAGES);
    setFiles(combined);
    setImagePreviews(combined.map((file) => URL.createObjectURL(file)));
  };

  const handleUrlChange = (index, value) => {
    const updateUrls = [...urls];
    updateUrls[index] = value;
    setUrls(updateUrls);
  };

  const addUrlField = () => {
    if (urls.length < MAX_IMAGES) setUrls([...urls, ""]);
  };

  // 3. Envío blindado contra recargas y desvíos involuntarios
  const updateProduct = async (e) => {
    // 🟢 DETENCIÓN TOTAL: Evita que el HTML recargue la ventana pase lo que pase
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    setLoading(true);
    const token = localStorage.getItem("token");
    let payload;
    let headers = { "Authorization": `Bearer ${token}` };

    if (imageType === "file") {
      payload = new FormData();
      payload.append("title", form.title);
      payload.append("price", Number(form.price));
      payload.append("category", form.category);
      payload.append("description", form.description);
      
      // Enviamos el objeto parseado como texto string estructurado
      payload.append("stock", JSON.stringify(form.stock));
      
      // Adjuntamos binarios únicamente si el administrador cargó archivos nuevos
      if (files && files.length > 0) {
        files.forEach((file) => payload.append("image", file));
      }
      // Dejamos que Axios maneje el Content-Type dinámicamente con las boundaries
    } else {
      const cleanUrls = urls.map((u) => u.trim()).filter((u) => u !== "");
      payload = {
        title: form.title,
        price: Number(form.price),
        category: form.category,
        description: form.description,
        stock: form.stock,
        imageURLs: cleanUrls.length > 0 ? cleanUrls : undefined 
      };
      headers["Content-Type"] = "application/json";
    }

    try {
      console.log("🚀 Iniciando envío de datos a la API...");
      const response = await productsApi.put(`/${id}`, payload, { headers });
      
      console.log("✅ Servidor respondió exitosamente:", response.data);
      
      // Lanzamos la alerta de confirmación en pantalla
      toast.success("Producto actualizado con éxito");
      
      // 🟢 Retardo de cortesía: Le damos 1.2 segundos para leer el Toast antes de redirigir
      setTimeout(() => {
        navigate("/");
      }, 1200);

    } catch (error) {
      console.error("❌ Ocurrió un error al despachar la actualización:");
      console.error("Status del Servidor:", error.response?.status);
      console.error("Respuesta del Backend:", error.response?.data);
      
      toast.error(error.response?.data?.message || "Error al actualizar el producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='edit-contain'>
      <section className='edit-container'>
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

            {/* Ajustado a las clases del archivo SCSS */}
            <div className='form-group'>
              <label style={{ fontWeight: 'bold' }}>Cantidad por Talle:</label>
              <div className="size-stock-container">
                {['S', 'M', 'L', 'XL'].map((size) => (
                  <div key={size} className="size-stock-box">
                    <label>{size}</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={form.stock[size] ?? 0}
                      onChange={(e) => handleSizeStockChange(size, e.target.value)}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className='form-group'>
              <label>Categoría:</label>
              <div className='checkbox-group'>
                <label><input type="radio" name="category" value="short" checked={form.category === "short"} onChange={handleChange} /> Short</label>
                <label><input type="radio" name="category" value="pantalon" checked={form.category === "pantalon"} onChange={handleChange} /> Pantalón</label>
                <label><input type="radio" name="category" value="jogging" checked={form.category === "jogging"} onChange={handleChange} /> Jogging</label>
                <label><input type="radio" name="category" value="gorra" checked={form.category === "gorra"} onChange={handleChange} /> Gorra</label>
              </div>
            </div>

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
