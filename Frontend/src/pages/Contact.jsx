
import { useState} from 'react'
import { toast } from 'react-hot-toast'
import imgALtas from "@/assets/imgALtas.png";

export default function Contact() {

   const [form,setForm]= useState({
    name:"",
    email:"",
    comments:"",
   });

   const [errors, setErrors] = useState({});

   const validateField = (name,value) =>{

    let error = "";

     switch(name){

      case "name":

        if (value.trim().length < 3){
          error = "Debe tener al menos 3 caracteres";
        }
        break;
        case "email":
          if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ){
            error = "emailinvalido";
          }
          break;

          case "comments":
            if (value.trim().length < 10){
              error = "debe tener al menos 10 caracteres"
            }
            break;

            default:
              break;
     }
     setErrors(prev => ({
      ...prev,
      [name]:error
     }))
   };
   const handleChange = (e) => {
    const {name, value} = e.target;

     setForm(prev => ({
      ...prev,
      [name]:value
     }));
   };

   const handleBlur = (e) => {
     validateField(
        e.target.name,
        e.target.value
     );
   };
   const handleSubmit = (e) =>{

     e.preventDefault();

     validateField("name", form.name);
     validateField("email", form.email);
     validateField("comments", form.comments);

     const hasErrors = 
     form.name.length < 3 ||
     !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)||
     form.comments.length < 10;

     if (hasErrors) {
      toast.error(
        "corrige los errores del formulario"
      ); 
      return;
     }

     toast.success(
      "Mensage enviado correctamente"
     );

     setForm({
      name:"",
      email:"",
      comments:""
     });
   };

   return(

    <div 
    className="contact-page" 
    >

      <div className='divImage'>
        <img 
                   src={imgALtas}
                   alt='banner de formulario'
                   />
      </div>
     <div 
     className=
     'contact-form-container'
     >
      <h1
      className='form-title'
      >
        Contacto
      </h1>
      <form 
      className='contact-form'
      onSubmit={handleSubmit}
      >
        <label>
          Nombre
        </label>
        <input
         type='text'
         name="name"
         value={form.name}
         onChange={handleChange}
         onBlur={handleBlur}
         />

         {errors.name && (
          <span className='error'>
            {errors.name}
          </span>
         )}
         <label>
          Email
         </label>
         <input 
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          onBlur={handleBlur}
          />
          {errors.email && (
            <span className='error'>
              {errors.email}
            </span>
          )}
          <label>
            Comentarios
          </label>

          <textarea
          name='comments'
          rows="5"
          value={form.comments}
          onChange={handleChange}
          onBlur={handleBlur}
          />
          {errors.comments &&(
            <span className='error'>
              {errors.comments}
            </span>
          )}

          <button
          type='submit'>
            Enviar
          </button>

      </form>
    </div>
    </div>
   );

}