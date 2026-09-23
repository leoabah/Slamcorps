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
      description:"",
      stock:{
        S:0,
        M:0,
        L:0,
        XL:0
      }
    };
    const {
      form,
      errors,
      handleSubmit,
      handleChange,
      handleBlur,
      resetForm
    } =
    useForm(initiaForm, validations);

    const MAX_IMAGES = 4;

  const [imageType, setImageType] = useState("file");
  const [ loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const [files, setFiles]=useState([])
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleFileChange = (e) =>{
    const selectedFiles = Array.from(e.target.files);
    if (!selectedFiles.length) return;

    const combined = [...files, ...selectedFiles].slice(0,     MAX_IMAGES);
      setFiles(combined);
      setImagePreviews(combined.map((file)=>URL.createObjectURL((file))))
    };
    

  const removeFile = (indexToRemove) =>{
    const combined = files.filter((_, i) => i !== indexToRemove);
    setFiles(combined);
    setImagePreviews(combined.map((file) => URL.createObjectURL(file)))
   
  };

  const [urls, setUrls]= useState([""]);

  const handleUrlChange = (index, value) => {
    const updateUrls = [...urls];
    updateUrls[index] = value;
    setUrls(updateUrls);
  };

  const addUrlField = () => {
    if (urls.length < MAX_IMAGES)
      setUrls([...urls, ""]);
  };

  const removeUrlField = (indexToRemove) =>{
    const updateUrls = urls.filter((_, index) => index  !== indexToRemove);
    setUrls(updateUrls.length >0 ? updateUrls : [""]);
  }

  
  const  sendForm = async (data)=>{
    setSubmitError(null);
    setSubmitSuccess(false);
    
    const token = localStorage.getItem("token");
    let payload;
    let headers = { "Authorization" : `Bearer ${token}`};

    const cleanStock ={
      S: Number(form.stock.S || 0),
      M: Number(form.stock.M || 0),
      L: Number(form.stock.L || 0),
      XL: Number (form.stock.XL || 0)
    };

    if (imageType === "file") {
      if (files.length === 0) {
        setSubmitError("Agrega al menos una imagen del producto.");
        return;
      }

      payload = new FormData();
      payload.append("title", data.title);
      payload.append("price",Number(data.price));
      payload.append("category",data.category);
      payload.append("description", data.description);
     //🟢 ENVIAR STOCK POR TALLE COMO JSON EN EL FORMDATA
     payload.append("stock", JSON.stringify(cleanStock));


      //Object.entries(data).forEach(([key, value]) => payload.append(key, value));
      files.forEach((file) => payload.append("image", file))

      // Axios maneja automáticamente el Content-Type con FormData, no es necesario especificarlo
      // headers["Content-Type"] = "multipart/form-data";
    } else {
      const clearUrls = urls.map((u) => u.trim()).filter((u) => u !== "");
      if (clearUrls.length === 0){
        setSubmitError("Ingresa al menos URL valida.");
        return;
      }

      payload = {
        title: data.title,
        price: Number(data.price),
        category: data.category,
        description: data.description,
        stock: {
          S: Number(form.stock.S),
          M: Number(form.stock.M),
          L: Number(form.stock.L),
          XL: Number(form.stock.XL)
        },
        imageURLs: clearUrls
      };
      headers["Content-Type"] = "application/json";
    }

    setLoading(true);
     try{
      await productsApi.post("/", payload, { headers });

      setSubmitSuccess(true);
      setFiles([]);
      setImagePreviews([]);
      setUrls([""]);
      resetForm();
     } catch (error){
      const message = error.response?.data?.message || "No se pudo crear el producto. Intenta de nuevo.";
      setSubmitError(message);
     } finally {
      setLoading(false);
     }
  };

  return (
     <div className='alta-contain'>
      <section className='alta-container'>
       <div className="alta-image">
          {/* <img
          //  src={imgALtas}
           alt='banner de formulario'
           /> */}
       </div>
       <div className='alta-form-container'>
        <h1 style={{"marginBottom":25}}
        className='alta-form-title'
        >
          Altas de Productos
        </h1>
        {submitSuccess && 
        <p style={{color:"green",
           fontWeight:"bold"
        }}>
          !Producto creado exitosamente!
        </p>
        }
        {submitError && 
        <p style={{color:"red",
          fontWeight:"bold"
        }}
        ></p>
        }
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
              Descripción:
            </label>
            <textarea

            name='description'
            placeholder="Descripción del producto..."
            value={form.description}
             onChange={handleChange}
             onBlur={handleBlur}
            />
            {
              errors.description && (
                <p className='error'>
                  {errors.description}
                </p>
              )
            }
          </div>

 <div className='form-group'>
  <label>Cantidad por Talle:</label>
  <div className="size-stock-container">
    {['S', 'M', 'L', 'XL'].map((size) => (
      <div key={size} className="size-stock-box">
        <label>{size}</label>
        <input
          type="number"
          min="0"
          placeholder="0"
          value={form.stock[size] ?? 0}
          onChange={(e) => {
            handleChange({
              target: {
                name: 'stock',
                value: {
                  ...form.stock,
                  [size]: Number(e.target.value)
                }
              }
            });
          }}
        />
      </div>
    ))}
  </div>
</div>
     
            {/* ─── CONTROL DE IMÁGENES HÍBRIDO ─── */}
            <div className='form-group' style={{ border: '1px solid #ddd', padding: 15, borderRadius: 8, marginTop: 20 }}>
              <label style={{ fontWeight: 'bold', marginBottom: 10, display: 'block' }}>Método de carga de imágenes:</label>
              <div style={{ marginBottom: 15, display: 'flex', gap: 20 }}>
                <label>
                  <input type="radio" name="imageType" value="file" checked={imageType === "file"} onChange={() => setImageType("file")} />
                  Subir desde PC (Cliente)
                </label>
                <label>
                  <input type="radio" name="imageType" value="url" checked={imageType === "url"} onChange={() => setImageType("url")} />
                  Pegar URL de Internet (Vos)
                </label>
              </div>

              {/* RENDER CONDICIONAL SEGÚN LA SELECCIÓN */}
              {imageType === "file" ? (
                <div>
                  <input type="file" name="image" accept="image/*" multiple disabled={files.length >= MAX_IMAGES} onChange={handleFileChange} />
                  {imagePreviews.length > 0 && (
                    <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
                      {imagePreviews.map((src, index) => (
                        <div key={src} style={{ position: "relative" }}>
                          <img src={src} alt={`Vista previa ${index + 1}`} style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: index === 0 ? "3px solid #2e7d32" : "1px solid #ccc" }} />
                          {index === 0 && <span style={{ position: "absolute", bottom: 2, left: 2, background: "#2e7d32", color: "#fff", fontSize: 8, padding: "1px 4px", borderRadius: 4 }}>Principal</span>}
                          <button type="button" onClick={() => removeFile(index)} style={{ position: "absolute", top: -5, right: -5, background: "#c62828", color: "#fff", border: "none", borderRadius: "50%", width: 18, height: 18, cursor: "pointer" }}>×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {urls.map((url, index) => (
                    <div key={index} style={{ display: 'flex', gap: 5, marginBottom: 8, alignItems: 'center' }}>
                      <input type="text" placeholder={`URL de la imagen ${index + 1} ${index === 0 ? '(Principal)' : ''}`} value={url} onChange={(e) => handleUrlChange(index, e.target.value)} style={{ flex: 1 }} />
                      {urls.length > 1 && (
                        <button type="button" onClick={() => removeUrlField(index)} style={{ background: '#c62828', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: 4, cursor: 'pointer' }}>Eliminar</button>
                      )}
                    </div>
                  ))}
                  {urls.length < MAX_IMAGES && (
                    <button type="button" onClick={addUrlField} style={{ background: '#0288d1', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: 4, cursor: 'pointer', marginTop: 5 }}>+ Añadir otra URL</button>
                  )}
                </div>
              )}
            </div>
              <button type="submit" disabled={loading} style={{ marginTop: 25, width: '100%', padding: '10px',
               justifyItems:"center", background: '#2e7d32', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>{loading ? "Guardando..." : "Crear Producto"}
              </button>
        </form>
       </div>
      </section>
    </div>
  );
}
