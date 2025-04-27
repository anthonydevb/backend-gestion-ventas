// models/client.js
const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  tipoDocumento: { type: String, required: true }, // Tipo de documento (DNI, RUC)
  documento: { type: String, required: true }, // Número de documento
});

module.exports = mongoose.model('Client', clientSchema);
