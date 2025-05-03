// routes/clientRouter.js
const express = require('express');
const Client = require('../models/Client'); // Importamos el modelo de cliente
const router = express.Router();

// Crear un nuevo cliente (POST)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, tipoDocumento, documento } = req.body;

    const nuevoCliente = new Client({
      name,
      email,
      phone,
      tipoDocumento,
      documento
    });

    await nuevoCliente.save();
    res.status(201).json(nuevoCliente); // Respondemos con el cliente creado
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
    
  }
});

// Obtener todos los clientes (GET)
router.get('/', async (req, res) => {
  try {
    const clientes = await Client.find();
    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({ mensaje: error.message }); 
  }
});

// Obtener un cliente por ID (GET)
router.get('/:id', async (req, res) => {
  try {
    const cliente = await Client.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' }); // Si no encontramos el cliente
    }
    res.status(200).json(cliente); // Respondemos con el cliente encontrado
  } catch (error) {
    res.status(500).json({ mensaje: error.message }); // Si hay un error, lo mostramos
  }
});

// Actualizar un cliente por ID (PUT)
router.put('/:id', async (req, res) => {
  try {
    const { name, email, phone, tipoDocumento, documento } = req.body;
    const clienteActualizado = await Client.findByIdAndUpdate(
      req.params.id, // El ID del cliente
      { name, email, phone, tipoDocumento, documento }, // Los nuevos datos del cliente
      { new: true } // Devuelve el cliente actualizado
    );

    if (!clienteActualizado) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' }); // Si no encontramos el cliente
    }

    res.status(200).json(clienteActualizado); // Respondemos con el cliente actualizado
  } catch (error) {
    res.status(500).json({ mensaje: error.message }); // Si hay un error, lo mostramos
  }
});

// Eliminar un cliente por ID (DELETE)
router.delete('/:id', async (req, res) => {
  try {
    const clienteEliminado = await Client.findByIdAndDelete(req.params.id); // Eliminamos el cliente por su ID
    if (!clienteEliminado) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' }); // Si no encontramos el cliente
    }
    res.status(200).json({ mensaje: 'Cliente eliminado correctamente' }); // Respondemos con un mensaje de éxito
  } catch (error) {
    res.status(500).json({ mensaje: error.message }); // Si hay un error, lo mostramos
  }
});

module.exports = router; // Exportamos las rutas
