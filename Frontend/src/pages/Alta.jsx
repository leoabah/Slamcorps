import { useState } from 'react';
import { validations } from '../utils/formValidations';
// import imgALtas from "@/assets/imgALtas.png";
import "@/styles/alta.scss"
import  useForm  from '../hooks/useForm';
import productsApi from '../api/productsApi';
//import { data } from 'react-router-dom';

export const Alta = () => {

  const initiaForm =
    {
      title:"",
      price:"",
      category:"",
      descripcion:"",
      stock:""

    };
    const {
      form,
      errors,
      handleSubmit,
      handleChange,
      handleBlur
    } =
    useForm(initiaForm, validations);

const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const MAX_IMAGES = 4;

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const combined = [...images, ...files].slice(0, MAX_IMAGES);
    setImages(combined);
    setImagePreviews(combined.map((file) => URL.createObjectURL(file)));
  };

  const removeImage = (indexToRemove) => {
    const combined = images.filter((_, i) => i !== indexToRemove);
    setImages(combined);
    setImagePreviews(combined.map((file) => URL.createObjectURL(file)));
  };

  // Estados para saber qué está pasando durante el envío
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const  sendForm = async (data)=>{
    setSubmitError(null);
    setSubmitSuccess(false);

    if (images.length === 0) {
      setSubmitError("Agregá al menos una imagen del producto.");
      return;
    }

    // Se arma un FormData porque hay que mandar texto + archivos juntos
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    images.forEach((file) => {
      formData.append("image", file);
    });

    setLoading(true);
    try {
      const  token = localStorage.getItem("token");
      
      await productsApi.post("", formData, {
        headers: {
          "content-type":"multipart/form-data",
          "Authorization": `Bearer ${token}`
        }
      });

      setSubmitSuccess(true);
      setImages([]);
      setImagePreviews([]);
    } catch (error) {
      const message = error.response?.data?.message || "No se pudo crear el producto. Intentá de nuevo.";
      setSubmitError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
     <div className='alta-contain'>
      <section className='alta-container'>
       <div className="alta-image">
          <img
          //  src={imgALtas}
           alt='banner de formulario'
           />
       </div>
       <div className='alta-form-container'>
        <h1 style={{"marginBottom":25}}
        className='alta-form-title'
        >
          Altas de Productos
        </h1>
        <form
            className="alta-form"
            onSubmit={handleSubmit(sendForm)}
            encType="multipart/form-data"
>
          <div className='form-group'>
            <label>
              Título:
            </label>
            <input
             type='text'
             name='title'
             placeholder='Título del producto'
             value={form.title}
             onChange={handleChange}
             onBlur={handleBlur}
            />
            {
              errors.title &&(
                <p className='error'>
                  {errors.title}
                </p>
              )
            }
          </div>

          <div className='form-group'>
            <label>
              Precio:
            </label>
            <input
            type="number"
            name='price'
            placeholder="Solo numero"
            value={form.price}
             onChange={handleChange}
             onBlur={handleBlur}
            />
            {
              errors.price &&(
                <p className='error'>
                  {errors.price}
                </p>
              )
            }
          </div>

         

          <div className='form-group'>
            <label>
              Descripción:
            </label>
            <textarea

            name='descripcion'
            placeholder="Descripción del producto..."
            value={form.descripcion}
             onChange={handleChange}
             onBlur={handleBlur}
            />
            {
              errors.descripcion && (
                <p className='error'>
                  {errors.descripcion}
                </p>
              )
            }
          </div>

          <div className='form-group'>
            <label>
              cantidad:
            </label>
            <input
            type="number"
            name='stock'
            placeholder="Stock disponible"
            value={form.stock}
            onChange={handleChange}
            onBlur={handleBlur}
            />
            {
              errors.stock && (
                <p className='error'>
                  {errors.stock}
                </p>
              )
            }
          </div>

          <div className='form-group'>
            <label>
              Imágenes del producto (hasta {MAX_IMAGES}, la primera es la principal):
            </label>
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              disabled={images.length >= MAX_IMAGES}
              onChange={handleImageChange}
            />
            {imagePreviews.length > 0 && (
              <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
                {imagePreviews.map((src, index) => (
                  <div key={src} style={{ position: "relative" }}>
                    <img
                      src={src}
                      alt={`Vista previa ${index + 1}`}
                      style={{
                        width: 100,
                        height: 100,
                        objectFit: "cover",
                        borderRadius: 8,
                        border: index === 0 ? "3px solid #2e7d32" : "1px solid #ccc",
                      }}
                    />
                    {index === 0 && (
                      <span style={{
                        position: "absolute", bottom: 4, left: 4,
                        background: "#2e7d32", color: "#fff",
                        fontSize: 10, padding: "2px 6px", borderRadius: 4
                      }}>
                        Principal
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      style={{
                        position: "absolute", top: -6, right: -6,
                        background: "#c62828", color: "#fff",
                        border: "none", borderRadius: "50%",
                        width: 20, height: 20, cursor: "pointer"
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className='checkbox-group'>
            <label>
              <input
                type="radio"
                name="category"
                value="short"
                checked={form.category === "short"}
                onChange={handleChange}
              />
              Short
            </label>
            <label>
              <input
                type="radio"
                name="category"
                value="pantalon"
                checked={form.category === "pantalon"}
                onChange={handleChange}
              />
              Pantalón
            </label>
            <label>
              <input
                type="radio"
                name="category"
                value="jogging"
                checked={form.category === "jogging"}
                onChange={handleChange}
              />
              Jogging
            </label>
            <label>
              <input
                type="radio"
                name="category"
                value="gorra"
                checked={form.category === "gorra"}
                onChange={handleChange}
              />
              Gorra
            </label>
            <label>
              <input
                type="radio"
                name="category"
                value="remera"
                checked={form.category === "remera"}
                onChange={handleChange}
              />
              Remera
            </label>
            <label>
              <input
                type="radio"
                name="category"
                value="buzo"
                checked={form.category === "buzo"}
                onChange={handleChange}
              />
              Buzo
            </label>
            {
              errors.category && (
                <p className='error'>
                  {errors.category}
                </p>
              )
            }
          </div>

          {submitError && (
            <p className='error'>{submitError}</p>
          )}
          {submitSuccess && (
            <p style={{ color: "#2e7d32" }}>Producto creado con éxito.</p>
          )}

          <button
          type='submit'
          className='btn-submit'
          disabled={loading}
          style={{ marginTop: 20 }}
          >
            {loading ? "Enviando..." : "Crear Producto"}
          </button>
        </form>
       </div>
      </section>
    </div>
  );
}
