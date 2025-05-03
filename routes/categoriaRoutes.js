// rutas para categoria xd
const express = require('express');
const Categoria = require('../models/categoria'); 
const router = express.Router();  

// Crearemos un nuevo post para agregar una categoria
router.post('/', async (req, res) => {
    try {
        // Crear una nueva categoria con los datos enviados en el cuerpo de la solicitud
        const nuevaCategoria = new Categoria({
            categoria: req.body.categoria // Asegúrate de que el cliente esté enviando 'categoria'
        });

        // Guardamos la categoria en la base de datos
        await nuevaCategoria.save();
        res.status(201).json({ message: 'Categoría creada con éxito', categoria: nuevaCategoria });
    } catch (error) {
        res.status(500).json({ message: 'Hubo un error al crear la categoría', error });
    }
});

module.exports = router;
