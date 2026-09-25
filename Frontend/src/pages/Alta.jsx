import { useState } from 'react';
import { validations } from '../utils/formValidations';
import '../styles/alta.scss';
import useForm from '../hooks/useForm';
import productsApi from '../api/productsApi';

const categoryOptions = ['Short', 'Pantalón', 'Jogging', 'Gorra', 'Remera'];
const stockSizes = ['S', 'M', 'L', 'XL'];

export const Alta = () => {
  const initialForm = {
    title: '',
    price: '',
    category: 'Short',
    description: '',
    stock: {
      S: 0,
      M: 0,
      L: 0,
      XL: 0,
    },
  };

  const {
    form,
    errors,
    handleSubmit,
    handleChange,
    handleBlur,
    resetForm,
  } = useForm(initialForm, validations);

  const MAX_IMAGES = 4;
  const [imageType, setImageType] = useState('file');
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [files, setFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [urls, setUrls] = useState(['']);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (!selectedFiles.length) return;

    const combined = [...files, ...selectedFiles].slice(0, MAX_IMAGES);
    setFiles(combined);
    setImagePreviews(combined.map((file) => URL.createObjectURL(file)));
  };

  const removeFile = (indexToRemove) => {
    const combined = files.filter((_, index) => index !== indexToRemove);
    setFiles(combined);
    setImagePreviews(combined.map((file) => URL.createObjectURL(file)));
  };

  const handleUrlChange = (index, value) => {
    const updatedUrls = [...urls];
    updatedUrls[index] = value;
    setUrls(updatedUrls);
  };

  const addUrlField = () => {
    if (urls.length < MAX_IMAGES) {
      setUrls([...urls, '']);
    }
  };

  const removeUrlField = (indexToRemove) => {
    const updatedUrls = urls.filter((_, index) => index !== indexToRemove);
    setUrls(updatedUrls.length > 0 ? updatedUrls : ['']);
  };

  const handleStockChange = (size, value) => {
    handleChange({
      target: {
        name: 'stock',
        value: {
          ...form.stock,
          [size]: Number(value) || 0,
        },
      },
    });
  };

  const sendForm = async (data) => {
    setSubmitError(null);
    setSubmitSuccess(false);

    const token = localStorage.getItem('token');
    const cleanStock = {
      S: Number(form.stock.S || 0),
      M: Number(form.stock.M || 0),
      L: Number(form.stock.L || 0),
      XL: Number(form.stock.XL || 0),
    };

    let payload;
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    if (imageType === 'file') {
      if (files.length === 0) {
        setSubmitError('Agrega al menos una imagen del producto.');
        return;
      }

      payload = new FormData();
      payload.append('title', data.title);
      payload.append('price', Number(data.price));
      payload.append('category', data.category);
      payload.append('description', data.description);
      payload.append('stock', JSON.stringify(cleanStock));
      files.forEach((file) => payload.append('image', file));
    } else {
      const clearUrls = urls.map((url) => url.trim()).filter(Boolean);
      if (clearUrls.length === 0) {
        setSubmitError('Ingresa al menos una URL válida.');
        return;
      }

      payload = {
        title: data.title,
        price: Number(data.price),
        category: data.category,
        description: data.description,
        stock: cleanStock,
        imageURLs: clearUrls,
      };
      headers['Content-Type'] = 'application/json';
    }

    setLoading(true);
    try {
      await productsApi.post('/', payload, { headers });
      setSubmitSuccess(true);
      setFiles([]);
      setImagePreviews([]);
      setUrls(['']);
      resetForm();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'No se pudo crear el producto. Intenta de nuevo.';
      setSubmitError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='alta-page'>
      <section className='alta-container'>
        <div className='alta-form-container'>
          <h1 className='alta-form-title'>Título:</h1>

          {submitSuccess && (
            <p className='success-message'>¡Producto creado exitosamente!</p>
          )}
          {submitError && <p className='error-message'>{submitError}</p>}

          <form
            className='alta-form'
            onSubmit={handleSubmit(sendForm)}
            encType='multipart/form-data'
          >
            <div className='form-group'>
              <input
                type='text'
                name='title'
                placeholder='Gorra Trucker Azul Oscuro'
                value={form.title}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.title && <p className='error-text'>{errors.title}</p>}
            </div>

            <div className='form-group'>
              <label>Precio:</label>
              <input
                type='number'
                min='1'
                name='price'
                placeholder='17500'
                value={form.price}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.price && <p className='error-text'>{errors.price}</p>}
            </div>

            <div className='form-group'>
              <label>Descripción:</label>
              <textarea
                name='description'
                placeholder='Diseño moderno con frente estructurada, malla respirable y el logo distintivo bordado. Ideal para un look canchero y comodo todo el día. iCalidad premium para los que marcan la diferencia!'
                value={form.description}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.description && (
                <p className='error-text'>{errors.description}</p>
              )}
            </div>

            <div className='form-group'>
              <label>Cantidad por Talle:</label>
              <div className='size-stock-container'>
                {stockSizes.map((size) => (
                  <div key={size} className='size-stock-box'>
                    <span className='size-label'>{size}</span>
                    <input
                      type='number'
                      min='0'
                      value={form.stock[size] ?? 0}
                      onChange={(e) => handleStockChange(size, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className='form-group'>
              <label>Categoría:</label>
              <div className='category-options'>
                {categoryOptions.map((option) => (
                  <label key={option} className='category-option'>
                    <input
                      type='radio'
                      name='category'
                      value={option}
                      checked={form.category === option}
                      onChange={handleChange}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              {errors.category && <p className='error-text'>{errors.category}</p>}
            </div>

            <div className='form-group image-group'>
              <label>Método de carga de imágenes:</label>
              <div className='image-mode-switch'>
                <label className={imageType === 'file' ? 'active' : ''}>
                  <input
                    type='radio'
                    name='imageType'
                    value='file'
                    checked={imageType === 'file'}
                    onChange={() => setImageType('file')}
                  />
                  <span>Subir desde PC</span>
                </label>
                <label className={imageType === 'url' ? 'active' : ''}>
                  <input
                    type='radio'
                    name='imageType'
                    value='url'
                    checked={imageType === 'url'}
                    onChange={() => setImageType('url')}
                  />
                  <span>Pegar URL</span>
                </label>
              </div>

              {imageType === 'file' ? (
                <div className='upload-box'>
                  <label className='file-input-label'>
                    <span>Elegir archivos</span>
                    <input
                      type='file'
                      name='image'
                      accept='image/*'
                      multiple
                      disabled={files.length >= MAX_IMAGES}
                      onChange={handleFileChange}
                    />
                  </label>
                  <span className='file-count'>
                    {files.length > 0 ? `${files.length} archivos seleccionados` : 'Sin archivos seleccionados'}
                  </span>

                  {imagePreviews.length > 0 && (
                    <div className='preview-grid'>
                      {imagePreviews.map((src, index) => (
                        <div key={`${src}-${index}`} className='preview-item'>
                          <img src={src} alt={`Vista previa ${index + 1}`} />
                          {index === 0 && <span className='preview-label'>Principal</span>}
                          <button type='button' onClick={() => removeFile(index)}>
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className='url-box'>
                  {urls.map((url, index) => (
                    <div key={index} className='url-row'>
                      <input
                        type='text'
                        placeholder={`URL de la imagen ${index + 1}${index === 0 ? ' (Principal)' : ''}`}
                        value={url}
                        onChange={(e) => handleUrlChange(index, e.target.value)}
                      />
                      {urls.length > 1 && (
                        <button type='button' className='remove-url' onClick={() => removeUrlField(index)}>
                          Eliminar
                        </button>
                      )}
                    </div>
                  ))}
                  {urls.length < MAX_IMAGES && (
                    <button type='button' className='add-url' onClick={addUrlField}>
                      + Añadir otra URL
                    </button>
                  )}
                </div>
              )}
            </div>

            <button type='submit' className='btn-submit' disabled={loading}>
              {loading ? 'Guardando...' : 'Crear Producto'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
