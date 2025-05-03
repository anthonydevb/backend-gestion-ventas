const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  descripcion: { type: String, required: true },
  stock: { type: Number, required: true },
  imagen: { type: String, required: false }, 
});

module.exports = mongoose.model('Product', productSchema);
