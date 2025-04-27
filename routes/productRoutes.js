const express = require('express');
const Product = require('../models/product'); // Usamos el modelo de productos
const router = express.Router();

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await Product.find(); // Obtiene todos los productos
    res.json(products); // Responde con los productos en formato JSON
  } catch (err) {
    res.status(500).json({ message: err.message }); // Si hay un error, responde con un error 500
  }
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id); // Busca un producto por su ID
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' }); // Si no se encuentra el producto, responde con error 404
    res.json(product); // Responde con el producto encontrado
  } catch (err) {
    res.status(500).json({ message: err.message }); // Si hay un error, responde con un error 500
  }
});

// Crear un nuevo producto
router.post('/', async (req, res) => {
  const { nombre, precio, descripcion, stock } = req.body; // Extrae los datos del cuerpo de la solicitud

  // Asegúrate de que todos los campos requeridos están presentes
  if (!nombre || !precio || !descripcion || stock === undefined) {
    return res.status(400).json({ message: 'Faltan campos requeridos' });
  }

  // Crear un nuevo producto con los datos proporcionados
  const product = new Product({
    nombre,
    precio,
    descripcion,
    stock,
  });

  try {
    const newProduct = await product.save(); // Guarda el nuevo producto en la base de datos
    res.status(201).json(newProduct); // Responde con el producto recién creado
  } catch (err) {
    res.status(400).json({ message: err.message }); // Si hay un error, responde con error 400
  }
});

// Actualizar un producto
router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Actualiza el producto por su ID
    if (!updatedProduct) return res.status(404).json({ message: 'Producto no encontrado' }); // Si no se encuentra el producto, responde con error 404
    res.json(updatedProduct); // Responde con el producto actualizado
  } catch (err) {
    res.status(400).json({ message: err.message }); // Si hay un error, responde con error 400
  }
});

// Eliminar un producto
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id); // Elimina el producto por su ID
    if (!deletedProduct) return res.status(404).json({ message: 'Producto no encontrado' }); // Si no se encuentra el producto, responde con error 404
    res.json({ message: 'Producto eliminado' }); // Responde con un mensaje de éxito
  } catch (err) {
    res.status(500).json({ message: err.message }); // Si hay un error, responde con error 500
  }
});

module.exports = router; // Exportar las rutas
