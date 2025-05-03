const mongoose = require('mongoose');

const ventaSchema = new mongoose.Schema({
  cliente: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Client',
    required: true 
  },
  productos: [
    {
      producto: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product',
        required: true 
      },
      cantidad: { type: Number, required: true },
      precio: { type: Number, required: true },
    }
  ],
  fecha: { type: Date, default: Date.now },
  total: { type: Number, required: true },
});

const Venta = mongoose.model('Venta', ventaSchema);

module.exports = Venta;