const express = require('express');
const PDFDocument = require('pdfkit');
const Venta = require('../models/venta');
const Client = require('../models/Client');
const Product = require('../models/product');
const router = express.Router();

// Crear una venta
router.post('/', async (req, res) => {
  try {
    const { cliente, productos, total, fecha } = req.body;

    // Verificar que el cliente exista
    const clienteExistente = await Client.findById(cliente);
    if (!clienteExistente) {
      return res.status(400).json({ message: 'Cliente no encontrado' });
    }

    const productosConStock = [];
    for (let i = 0; i < productos.length; i++) {
      const producto = await Product.findById(productos[i].producto);
      if (!producto) {
        return res.status(400).json({ message: `Producto con ID ${productos[i].producto} no encontrado` });
      }

      // Verificar si hay suficiente stock
      if (producto.stock < productos[i].cantidad) {
        return res.status(400).json({ message: `No hay suficiente stock para el producto ${producto.nombre}` });
      }

      // Reducir el stock de los productos vendidos
      producto.stock -= productos[i].cantidad;
      await producto.save();

      // Añadir a la lista de productos vendidos
      productosConStock.push({
        producto: producto._id,
        cantidad: productos[i].cantidad,
        precio: producto.precio,
      });
    }

    // Crear una nueva venta
    const nuevaVenta = new Venta({
      cliente: clienteExistente._id,
      productos: productosConStock,
      total,
      fecha,
    });

    // Guardar la venta
    const ventaGuardada = await nuevaVenta.save();
    res.status(201).json(ventaGuardada);
  } catch (error) {
    console.error('Error al registrar la venta:', error);
    res.status(500).json({ message: 'Hubo un error al registrar la venta', error });
  }
});

// Obtener todas las ventas y calcular los productos más vendidos
router.get('/', async (req, res) => {
  try {
    const ventas = await Venta.find()
      .populate('cliente', 'name email phone tipoDocumento documento') // Obtener más información del cliente
      .populate('productos.producto', 'nombre precio cantidad'); // Asegurarse de incluir la cantidad de productos vendidos

    // Calcular el total de ventas
    const totalVentas = ventas.reduce((sum, venta) => sum + venta.total, 0);

    // Calcular los productos más vendidos
    const productosVendidos = {};

    ventas.forEach(venta => {
      venta.productos.forEach(item => {
        // Validar si el producto está correctamente poblado
        if (item.producto && item.producto.nombre) {
          const producto = item.producto.nombre;
          const cantidad = item.cantidad;

          if (!productosVendidos[producto]) {
            productosVendidos[producto] = 0;
          }

          productosVendidos[producto] += cantidad;
        } else {
          console.warn('Producto no encontrado o no está correctamente poblado:', item);
        }
      });
    });

    // Convertir el objeto productosVendidos en un array ordenado de mayor a menor cantidad vendida
    const productosMasVendidos = Object.entries(productosVendidos)
      .map(([nombre, cantidad]) => ({ nombre, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad);

    res.status(200).json({ ventas, totalVentas, productosMasVendidos });
  } catch (error) {
    console.error('Error al obtener las ventas:', error);
    res.status(500).json({ message: 'Error al obtener las ventas', error });
  }
});


// Generar la boleta en PDF
router.get('/boleta/:ventaId', async (req, res) => {
  try {
    const venta = await Venta.findById(req.params.ventaId)
      .populate('cliente', 'name email phone tipoDocumento documento') // Obtener toda la info del cliente
      .populate('productos.producto', 'nombre precio');

    if (!venta) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=boleta.pdf');

    doc.pipe(res);

    // Título de la boleta
    doc.fontSize(20).font('Helvetica-Bold').text('BOLETA DE VENTA', { align: 'center' }).moveDown();
    
    // Datos del cliente
    doc.fontSize(12).font('Helvetica').text(`Cliente: ${venta.cliente.name}`).moveDown();
    doc.text(`Email: ${venta.cliente.email}`).moveDown();
    doc.text(`Teléfono: ${venta.cliente.phone}`).moveDown();
    doc.text(`Tipo de Documento: ${venta.cliente.tipoDocumento}`).moveDown();
    doc.text(`Número de Documento: ${venta.cliente.documento}`).moveDown();

    // Información de los productos
    doc.text('Productos:', { underline: true }).moveDown();

    venta.productos.forEach(item => {
      const producto = item.producto;
      const subtotal = (producto.precio * item.cantidad).toFixed(2);
      doc.text(`${producto.nombre} - S/. ${producto.precio} x ${item.cantidad} = S/. ${subtotal}`).moveDown();
    });

    // Total
    doc.fontSize(14).font('Helvetica-Bold').text(`Total: S/. ${venta.total}`, { align: 'right' }).moveDown();

    // Fecha
    doc.fontSize(10).font('Helvetica').text(`Fecha: ${new Date(venta.fecha).toLocaleString()}`).moveDown();

    // Pie de página
    doc.moveTo(0, doc.y)
      .lineTo(600, doc.y)
      .strokeColor('#000')
      .lineWidth(0.5)
      .stroke();

    doc.text('Gracias por su compra!', 250, doc.y + 10).moveDown();
    doc.text('Dirección de tu tienda | Teléfono: 123-456-7890', { align: 'center' }).moveDown();
    
    doc.end();
  } catch (error) {
    console.error('Error generando la boleta:', error);
    res.status(500).json({ message: 'Error generando la boleta', error });
  }
});

module.exports = router;
