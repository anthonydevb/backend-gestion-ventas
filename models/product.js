const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  descripcion: { type: String, required: true },
  stock: { type: Number, required: true },
  imagen: { type: String },
  ventas: { type: Number, default: 0 }, // Número de ventas del producto
});

module.exports = mongoose.model('Product', productSchema);
