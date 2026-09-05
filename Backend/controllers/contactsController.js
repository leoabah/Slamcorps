import Contact from "../models/Contact.js";

// creacion del message
export const createMessage = async (
    req,
     res
    ) => {
  try {
    const { name, email, message } = req.body;

    // Validación de campos requeridos
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }
    const contact = await Contact.create({ 
        name,
        email,
        message 
    });

    res.status(201).json({
        message: "Mensaje enviado correctamente",
        contact
    });

} catch (error) {
    console.error("Error al crear el Contacto:", error);

    res.status(500).json({ message: "Error interno del servidor" });
  }
};

//obtener todos los mensajes
export const getContacts = async (req, res) => {
    try{
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json(contacts);
    } catch (error) {
        console.error("Error al obtener los contactos:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Eliminar mensaje
export const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await Contact.findByIdAndDelete(id);

        if (!contact) {
            return res.status(404).json({ message: "Mensaje no encontrado" });
        }

        res.status(200).json({ message: "Mensaje eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar el contacto:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

//Marcar mensaje como leido
export const markContactAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await Contact.findByIdAndUpdate(
            id,
            { isRead: true },
            { new: true });

        if (!contact) {
            return res.status(404).json({ message: "Mensaje no encontrado" });
        }

        res.status(200).json({
            message: "Mensaje marcado como leído",
            contact
        });

    } catch (error) {
        console.error("Error al marcar el mensaje como leído:", error);

        res.status(500).json({ message: "Error interno del servidor" });
    }
};