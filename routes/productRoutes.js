const express = require('express');
const multer = require('multer');  // Requerimos multer para manejar la subida de archivos
const path = require('path');      // Para manejar las extensiones de los archivos
const Product = require('../models/product'); // Usamos el modelo de productos
const fs = require('fs'); // Para manejar el sistema de archivos

const router = express.Router();

// Configuración de multer para guardar las imágenes en la carpeta 'uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Asegúrate de tener esta carpeta creada
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // El nombre de la imagen será único (timestamp + extensión)
  }
});

// Validación de tipo de archivo
const fileFilter = (req, file, cb) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (validTypes.includes(file.mimetype)) {
    cb(null, true);  // Si el archivo es válido, lo aceptamos
  } else {
    cb(new Error('Solo se permiten imágenes JPEG, JPG y PNG'), false);  // Si no es válido, rechazamos el archivo
  }
};

const upload = multer({ 
  storage, 
  limits: { fileSize: 5 * 1024 * 1024 },  // Limita el tamaño del archivo a 5MB
  fileFilter 
});  // Middleware para manejar las subidas de archivos

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
router.post('/', upload.single('imagen'), async (req, res) => {
  const { nombre, precio, descripcion, stock } = req.body; // Extrae los datos del cuerpo de la solicitud
  const imagen = req.file ? req.file.filename : null;  // Si hay una imagen, obtén su nombre (nombre único)

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
    imagen, // Incluimos el nombre de la imagen (si se subió)
  });

  try {
    const newProduct = await product.save(); // Guarda el nuevo producto en la base de datos
    res.status(201).json(newProduct); // Responde con el producto recién creado
  } catch (err) {
    res.status(400).json({ message: err.message }); // Si hay un error, responde con error 400
  }
});

// Actualizar un producto
router.put('/:id', upload.single('imagen'), async (req, res) => {
  const { nombre, precio, descripcion, stock } = req.body; // Extrae los datos del cuerpo de la solicitud
  const imagen = req.file ? req.file.filename : null;  // Si hay una nueva imagen, obtén su nombre

  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
      nombre,
      precio,
      descripcion,
      stock,
      imagen: imagen || undefined,  // Si no se actualiza la imagen, no la modificamos
    }, { new: true });

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

    // Si el producto tenía una imagen, eliminamos la imagen de la carpeta 'uploads'
    if (deletedProduct.imagen) {
      const imagePath = path.join(__dirname, '..', 'uploads', deletedProduct.imagen);
      fs.unlink(imagePath, (err) => {
        if (err) console.log('Error al eliminar la imagen:', err);
      });
    }

    res.json({ message: 'Producto eliminado' }); // Responde con un mensaje de éxito
  } catch (err) {
    res.status(500).json({ message: err.message }); // Si hay un error, responde con error 500
  }
});

module.exports = router; // Exportar las rutas
