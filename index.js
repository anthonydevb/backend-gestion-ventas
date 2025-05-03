require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Necesario para servir archivos estáticos

// Importar rutas
const productRoutes = require('./routes/productRoutes'); // Rutas de productos
const clientRouter = require('./routes/clientRoutes');   // Rutas de clientes
const ventaRoutes = require('./routes/ventaRoutes');     // Rutas de ventas
const categoriaRoutes = require('./routes/categoriaRoutes'); // Rutas de categorías

const app = express();

// Middlewares
app.use(cors());              // Permitir peticiones desde el frontend
app.use(express.json());      // Permitir leer JSON en peticiones

// Servir archivos estáticos desde la carpeta 'uploads' (IMÁGENES)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a la base de datos MongoDB'))
  .catch(err => console.log('❌ Error al conectar a MongoDB:', err));

// Rutas API
app.use('/api/products', productRoutes);   // Ruta base para productos
app.use('/api/clients', clientRouter);     // Ruta base para clientes
app.use('/api/ventas', ventaRoutes);       // Ruta base para ventas
app.use('/api/categorias', categoriaRoutes); // Ruta base para categorías

// Puerto del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
