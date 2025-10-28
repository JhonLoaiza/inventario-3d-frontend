// src/pages/TrabajosPage.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '../api.js';

// ¡NUEVO! Importamos los componentes de Bootstrap
import { Table, Button, Form, Alert, Row, Col } from 'react-bootstrap';

function TrabajosPage() {
  // --- ESTADOS --- (Sin cambios)
  const [trabajos, setTrabajos] = useState([]);
  const [bobinas, setBobinas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [formBobinaId, setFormBobinaId] = useState('');
  const [formProductoId, setFormProductoId] = useState('');
  const [formNombreTrabajo, setFormNombreTrabajo] = useState('');
  const [formGramos, setFormGramos] = useState(0);
  const [formCantidad, setFormCantidad] = useState(1);

  // --- FUNCIONES DE API --- (Sin cambios)
  // (Aquí van tus 3 funciones: fetchData, handleSubmit, handleComplete)
  // ...
  const fetchData = async () => {
    try {
      setLoading(true);
      const [trabajosRes, bobinasRes, productosRes] = await Promise.all([
        apiClient.get('/trabajos'),
        apiClient.get('/bobinas'),
        apiClient.get('/productos')
      ]);
      setTrabajos(trabajosRes.data.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion)));
      setBobinas(bobinasRes.data);
      setProductos(productosRes.data);
      if (bobinasRes.data.length > 0) {
        setFormBobinaId(bobinasRes.data[0].id);
      }
      if (productosRes.data.length > 0) {
        setFormProductoId(productosRes.data[0].id);
      }
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error al obtener datos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!formBobinaId || !formProductoId || formGramos <= 0 || formCantidad <= 0) {
      setFormError('Todos los campos son obligatorios y los valores deben ser positivos.');
      return;
    }
    try {
      const nuevoTrabajo = { 
        bobina_id: parseInt(formBobinaId),
        producto_id: parseInt(formProductoId),
        nombre_trabajo: formNombreTrabajo || 'Producción de Lote',
        gramos_consumidos: parseFloat(formGramos),
        cantidad_producida: parseInt(formCantidad)
      };
      await apiClient.post('/trabajos', nuevoTrabajo);
      fetchData(); 
      setFormGramos(0);
      setFormNombreTrabajo('');
    } catch (err) {
      setFormError('Error al crear el trabajo: ' + err.message);
      console.error("Error al crear trabajo:", err);
    }
  };

  const handleComplete = async (trabajoId) => {
    if (!window.confirm("¿Seguro que quieres marcar este trabajo como 'Completado'? Esta acción descontará el inventario.")) {
      return;
    }
    try {
      await apiClient.put(`/trabajos/${trabajoId}/completar`);
      fetchData();
    } catch (err) {
      setError("Error al completar el trabajo: " + err.message);
      console.error("Error al completar trabajo:", err);
    }
  };
  // --- FIN DE FUNCIONES ---

  // --- RENDERIZADO (JSX) CON BOOTSTRAP ---

  if (loading) return <Alert variant="info">Cargando fábrica... ⏳</Alert>;
  if (error) return <Alert variant="danger">Error: {error} ❌</Alert>;

  return (
    <div>
      <h2>Gestión de Producción</h2>

      {/* --- FORMULARIO CON BOOTSTRAP --- */}
      <Form onSubmit={handleSubmit} className="mb-4 p-3 border rounded">
        <h3>Agendar Nuevo Trabajo</h3>
        
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formBobina">
              <Form.Label>Usar Bobina:</Form.Label>
              <Form.Select value={formBobinaId} onChange={(e) => setFormBobinaId(e.target.value)}>
                {bobinas.map((b) => (
                  <option key={b.id} value={b.id}>
                    ID:{b.id} - {b.tipo} {b.color} (Quedan: {b.peso_actual_g}g)
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formProducto">
              <Form.Label>Para Fabricar:</Form.Label>
              <Form.Select value={formProductoId} onChange={(e) => setFormProductoId(e.target.value)}>
                {productos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} (Stock: {p.stock_actual})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3" controlId="formNombreTrabajo">
              <Form.Label>Nombre Trabajo (Opcional):</Form.Label>
              <Form.Control type="text" value={formNombreTrabajo} onChange={(e) => setFormNombreTrabajo(e.target.value)} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3" controlId="formGramos">
              <Form.Label>Gramos a Consumir:</Form.Label>
              <Form.Control type="number" step="0.1" value={formGramos} onChange={(e) => setFormGramos(e.target.value)} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3" controlId="formCantidad">
              <Form.Label>Cantidad a Producir:</Form.Label>
              <Form.Control type="number" value={formCantidad} onChange={(e) => setFormCantidad(e.target.value)} />
            </Form.Group>
          </Col>
        </Row>
        
        <Button variant="primary" type="submit">Agendar Trabajo</Button>
        {formError && <Alert variant="danger" className="mt-3">{formError}</Alert>}
      </Form>

      {/* --- TABLA CON BOOTSTRAP --- */}
      <h3>Historial de Trabajos</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Estado</th>
            <th>Producto Fabricado</th>
            <th>Material Usado</th>
            <th>Cantidad</th>
            <th>Gramos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {trabajos.map((trabajo) => (
            <tr key={trabajo.id} className={trabajo.estado === 'Pendiente' ? 'table-warning' : ''}>
              <td>
                <span className={`badge bg-${trabajo.estado === 'Pendiente' ? 'warning' : 'success'}`}>
                  {trabajo.estado}
                </span>
              </td>
              <td>{trabajo.producto_nombre}</td>
              <td>{trabajo.material_tipo} {trabajo.material_color}</td>
              <td>{trabajo.cantidad_producida} uds.</td>
              <td>{trabajo.gramos_consumidos} g</td>
              <td>
                {trabajo.estado === 'Pendiente' && (
                  <Button variant="success" size="sm" onClick={() => handleComplete(trabajo.id)}>
                    Marcar como Completado
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default TrabajosPage;