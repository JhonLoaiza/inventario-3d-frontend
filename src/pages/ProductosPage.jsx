// src/pages/ProductosPage.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '../api.js';

// ¡NUEVO! Importamos los componentes de Bootstrap
import { Table, Button, Form, Alert, Row, Col } from 'react-bootstrap';

function ProductosPage() {
  // --- ESTADOS --- (Sin cambios)
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nombre, setNombre] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [precioVenta, setPrecioVenta] = useState(0);
  const [gramosEstimados, setGramosEstimados] = useState(0);
  const [formError, setFormError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // --- FUNCIONES DE API --- (Sin cambios)
  // (Aquí van tus 5 funciones: fetchProductos, handleDelete, 
  // handleSubmit, handleSelectEdit, limpiarFormulario)
  // ...
  const fetchProductos = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/productos');
      setProductos(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error al obtener productos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;
    try {
      await apiClient.delete(`/productos/${id}`);
      setProductos(productos.filter((p) => p.id !== id));
    } catch (err) {
      setError("Error al eliminar el producto: " + err.message);
      console.error("Error al eliminar producto:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!nombre || precioVenta <= 0 || gramosEstimados <= 0) {
      setFormError('Nombre, Precio y Gramos son obligatorios y positivos.');
      return;
    }
    const productoData = { 
      nombre, 
      foto_url: fotoUrl, 
      precio_venta: parseInt(precioVenta), 
      gramos_estimados: parseFloat(gramosEstimados)
    };
    try {
      if (editingId) {
        const response = await apiClient.put(`/productos/${editingId}`, productoData);
        setProductos(productos.map((p) => (p.id === editingId ? response.data : p)));
      } else {
        const response = await apiClient.post('/productos', productoData);
        setProductos([...productos, response.data]);
      }
      limpiarFormulario();
    } catch (err) {
      setFormError(`Error: ` + err.message);
      console.error("Error en handleSubmit:", err);
    }
  };

  const handleSelectEdit = (producto) => {
    setEditingId(producto.id);
    setNombre(producto.nombre);
    setFotoUrl(producto.foto_url || '');
    setPrecioVenta(producto.precio_venta);
    setGramosEstimados(producto.gramos_estimados);
    setFormError(null);
  };

  const limpiarFormulario = () => {
    setEditingId(null);
    setNombre('');
    setFotoUrl('');
    setPrecioVenta(0);
    setGramosEstimados(0);
    setFormError(null);
  };

  useEffect(() => {
    fetchProductos();
  }, []);
  // --- FIN DE FUNCIONES ---

  // --- RENDERIZADO (JSX) CON BOOTSTRAP ---

  if (loading) return <Alert variant="info">Cargando productos... ⏳</Alert>;
  if (error) return <Alert variant="danger">Error: {error} ❌</Alert>;

  return (
    <div>
      <h2>Gestión de Productos (Catálogo)</h2>

      {/* --- FORMULARIO CON BOOTSTRAP --- */}
      <Form onSubmit={handleSubmit} className="mb-4 p-3 border rounded">
        <h3>{editingId ? 'Actualizar Producto' : 'Crear Nuevo Producto'}</h3>
        
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formNombre">
              <Form.Label>Nombre Producto:</Form.Label>
              <Form.Control 
                type="text" 
                value={nombre} 
                onChange={(e) => setNombre(e.target.value)} 
                placeholder="Ej: Llavero Batman"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formPrecio">
              <Form.Label>Precio Venta (CLP):</Form.Label>
              <Form.Control 
                type="number" 
                value={precioVenta} 
                onChange={(e) => setPrecioVenta(e.target.value)} 
                placeholder="Ej: 3000"
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formGramos">
              <Form.Label>Gramos Estimados:</Form.Label>
              <Form.Control 
                type="number" 
                step="0.1" 
                value={gramosEstimados} 
                onChange={(e) => setGramosEstimados(e.target.value)} 
                placeholder="Ej: 15.5"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formFotoUrl">
              <Form.Label>URL de Foto (Opcional):</Form.Label>
              <Form.Control 
                type="text" 
                value={fotoUrl} 
                onChange={(e) => setFotoUrl(e.target.value)} 
                placeholder="Ej: http://..."
              />
            </Form.Group>
          </Col>
        </Row>
        
        <Button variant="primary" type="submit">
          {editingId ? 'Actualizar' : 'Guardar Producto'}
        </Button>
        {editingId && (
          <Button variant="secondary" onClick={limpiarFormulario} className="ms-2">
            Cancelar Edición
          </Button>
        )}
        
        {formError && <Alert variant="danger" className="mt-3">{formError}</Alert>}
      </Form>

      {/* --- TABLA CON BOOTSTRAP --- */}
      <h3>Catálogo Actual</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Stock Actual</th>
            <th>Precio Venta (CLP)</th>
            <th>Gramos Estimados</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.nombre}</td>
              <td>{producto.stock_actual} uds.</td>
              <td>${new Intl.NumberFormat('es-CL').format(producto.precio_venta)}</td>
              <td>{producto.gramos_estimados} g</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleSelectEdit(producto)} className="me-2">
                  Editar
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(producto.id)}>
Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default ProductosPage;