const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  descripcion: { type: String, required: true },
  stock: { type: Number, required: true }, // Agregamos el campo "stock"
});

module.exports = mongoose.model('Product', productSchema);
