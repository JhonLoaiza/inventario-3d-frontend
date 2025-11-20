// src/pages/VentasPage.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '../api.js';
import { Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';

function VentasPage() {
  // --- ESTADOS ---
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Estados del Formulario
  const [productoId, setProductoId] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [precioTotal, setPrecioTotal] = useState(0);

  // --- CARGAR PRODUCTOS ---
  const fetchProductos = async () => {
    try {
      const response = await apiClient.get('/productos');
      // Solo mostramos productos que tengan stock > 0
      const productosConStock = response.data.filter(p => p.stock_actual > 0);
      setProductos(productosConStock);
      
      if (productosConStock.length > 0) {
        setProductoId(productosConStock[0].id);
      }
      setLoading(false);
    } catch (err) {
      setError("Error al cargar productos");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // --- CALCULAR PRECIO TOTAL AUTOMÁTICAMENTE ---
  useEffect(() => {
    const producto = productos.find(p => p.id === parseInt(productoId));
    if (producto) {
      setPrecioTotal(producto.precio_venta * cantidad);
    }
  }, [productoId, cantidad, productos]);

  // --- REGISTRAR LA VENTA ---
  const handleVenta = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    try {
      const ventaData = {
        producto_id: parseInt(productoId),
        cantidad: parseInt(cantidad),
        precio_total: parseInt(precioTotal)
      };

      await apiClient.post('/ventas', ventaData);
      
      setSuccessMsg(`¡Venta registrada! Ingresaron $${precioTotal} CLP a la caja.`);
      
      // Recargamos productos para actualizar el stock disponible
      fetchProductos(); 
      setCantidad(1);

    } catch (err) {
      setError("Error al registrar la venta: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <Alert variant="info">Cargando caja registradora...</Alert>;

  return (
    <div className="d-flex justify-content-center">
      <Card style={{ width: '100%', maxWidth: '600px' }} className="shadow">
        <Card.Header className="bg-success text-white">
          <h3>Registrar Nueva Venta</h3>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {successMsg && <Alert variant="success">{successMsg}</Alert>}

          <Form onSubmit={handleVenta}>
            <Form.Group className="mb-3">
              <Form.Label>Seleccionar Producto (Solo con Stock):</Form.Label>
              <Form.Select 
                value={productoId} 
                onChange={(e) => setProductoId(e.target.value)}
              >
                {productos.length === 0 ? (
                  <option>No hay productos con stock para vender</option>
                ) : (
                  productos.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} (Stock: {p.stock_actual}) - ${p.precio_venta} c/u
                    </option>
                  ))
                )}
              </Form.Select>
            </Form.Group>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Cantidad:</Form.Label>
                  <Form.Control 
                    type="number" 
                    min="1"
                    value={cantidad} 
                    onChange={(e) => setCantidad(e.target.value)} 
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Total a Cobrar (CLP):</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={`$ ${new Intl.NumberFormat('es-CL').format(precioTotal)}`} 
                    readOnly 
                    className="fw-bold text-success"
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-grid gap-2">
              <Button variant="success" size="lg" type="submit" disabled={productos.length === 0}>
                💰 Registrar Ingreso
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default VentasPage;