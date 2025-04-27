require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes'); // Ruta de productos
const clientRouter = require('./routes/clientRoutes');


const app = express();

app.use(cors()); // Habilita CORS
app.use(express.json()); // Habilita el parseo de JSON

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a la base de datos MongoDB'))
  .catch(err => console.log('Error al conectar a MongoDB:', err));

app.use('/api/products', productRoutes); // Ruta base para productos
app.use('/api/clients', clientRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
