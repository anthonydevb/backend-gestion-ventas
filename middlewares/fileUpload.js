const multer = require('multer');
const path = require('path');

// Configuración de Multer para guardar archivos en la carpeta 'uploads'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Define la carpeta donde se guardarán los archivos subidos
  },
  filename: function (req, file, cb) {
    // Genera un nombre único para el archivo con la fecha actual y su extensión original
    cb(null, Date.now() + path.extname(file.originalname)); // Utiliza la fecha y la extensión
  }
});

// Define el límite de tamaño para los archivos (por ejemplo, 5MB)
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // Limita el tamaño a 5MB
});

module.exports = upload;
