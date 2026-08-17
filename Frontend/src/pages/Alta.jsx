
import { validations } from '../utils/formValidations';
import imgALtas from "@/assets/imgALtas.png";
import "@/styles/alta.scss"
import  useForm  from '../hooks/useForm';
import { data } from 'react-router-dom';

export const Alta = () => {

  const initiaForm =
    {
      name:"",
      price:"",
      age:"",
      category:"",
      shortDescription:"",
      longDescription:"",
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
  const  sendForm = (data)=>{
    console.log(data)
  };
  
  return (
     <div className='alta-contain'>
      <section className='alta-container'>
       <div className="alta-image">
          <img 
           src={imgALtas}
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
>
          <div className='form-group'>
            <label>
              Nombre completo:
            </label>
            <input 
             type='text'
             name='name'
             placeholder='Nombre del prodcuto'
             value={form.name}
             onChange={handleChange}
             onBlur={handleBlur}
            />
            {
              errors.name &&(
                <p className='error'>
                  {errors.name}
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
              Edad:
            </label>
            <input 
            type="number"
            name='age'
            placeholder="Edad recomendada"
            value={form.age}
             onChange={handleChange}
             onBlur={handleBlur}
            />
            {
              errors.age &&(
                <p className='error'>
                  {errors.age}
                </p>
              )
            }
          </div>

          <div className='form-group'>
            <label>
              Descripcion cortas:
            </label>
            <textarea
           
            name='shortDescription'
            placeholder="Descripcion corta.."
            value={form.shortDescription}
             onChange={handleChange}
             onBlur={handleBlur}
            />
            {
              errors.shortDescription && (
                <p className='error'>
                  {errors.shortDescription}
                </p>
              )
            }
          </div>
          <div className='form-group'>
            <label>
              Descripcion larga:
            </label>
            <textarea 
           
            name='longDescription'
            placeholder="Descripcion larga.."
            value={form.longDescription}
             onChange={handleChange}
             onBlur={handleBlur}
            />
            {
              errors.longDescription && (
                <p className='error'>
                  {errors.longDescription}
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
          <div className='checkbox-group'>

            <label>
              <input type="checkbox" />
              amistad
              
            </label>
            <label>
              <input type="checkbox"/>
              shonen
            </label>
            <label>
              <input type="checkbox" />
              demonios
            </label>
          </div>
          <button
          type='submit'
          className='btn-submit'
          >
            Enviar
          </button>
        </form>
       </div>
      </section>
    </div>
  );
}
