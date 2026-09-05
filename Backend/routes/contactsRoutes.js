import express from "express";

import { 
    createMessage,
    getContacts,
    deleteContact,
    markContactAsRead 
} from "../controllers/contactsController.js";

const router = express.Router();

// Publico
router.post("/", createMessage);

//Dashboard
router.get("/", getContacts);
router.delete("/:id", deleteContact);

//Marcar mensaje como leido
router.patch("/:id/read", markContactAsRead);

export default router;