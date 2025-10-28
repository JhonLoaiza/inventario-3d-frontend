// src/pages/BobinasPage.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '../api.js';

// ¡NUEVO! Importamos los componentes de Bootstrap
import { Table, Button, Form, Alert, Row, Col } from 'react-bootstrap';

function BobinasPage() {
  // --- ESTADOS --- (Sin cambios)
  const [bobinas, setBobinas] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [materialId, setMaterialId] = useState('');
  const [pesoInicial, setPesoInicial] = useState(1000);
  const [costoBobina, setCostoBobina] = useState(0);
  const [fechaCompra, setFechaCompra] = useState(new Date().toISOString().split('T')[0]);
  const [formError, setFormError] = useState(null);

  // --- FUNCIONES DE API --- (Sin cambios)

  // Carga AMBAS listas al inicio
  const fetchData = async () => {
    try {
      setLoading(true);
      const [bobinasRes, materialesRes] = await Promise.all([
        apiClient.get('/bobinas'),
        apiClient.get('/materiales')
      ]);
      setBobinas(bobinasRes.data);
      setMateriales(materialesRes.data);
      if (materialesRes.data.length > 0) {
        setMaterialId(materialesRes.data[0].id);
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

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro?")) return;
    try {
      await apiClient.delete(`/bobinas/${id}`);
      setBobinas(bobinas.filter((bobina) => bobina.id !== id));
    } catch (err) {
      setError("Error al eliminar la bobina: " + err.message);
      console.error("Error al eliminar bobina:", err);
    }
  };

  // CREATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!materialId || costoBobina <= 0 || pesoInicial <= 0) {
      setFormError('Todos los campos son obligatorios y los valores deben ser positivos.');
      return;
    }
    try {
      const nuevaBobina = { 
        material_id: parseInt(materialId),
        peso_inicial_g: parseFloat(pesoInicial),
        costo_bobina: parseInt(costoBobina),
        fecha_compra: fechaCompra
      };
      await apiClient.post('/bobinas', nuevaBobina);
      fetchData(); // Recargamos todo
      setCostoBobina(0);
    } catch (err) {
      setFormError('Error al crear la bobina: ' + err.message);
      console.error("Error al crear bobina:", err);
    }
  };

  // --- RENDERIZADO (JSX) CON BOOTSTRAP ---

  if (loading) return <Alert variant="info">Cargando datos... ⏳</Alert>;
  if (error) return <Alert variant="danger">Error: {error} ❌</Alert>;

  return (
    <div>
      <h2>Gestión de Bobinas (Inventario Físico)</h2>

      {/* --- FORMULARIO CON BOOTSTRAP --- */}
      <Form onSubmit={handleSubmit} className="mb-4 p-3 border rounded">
        <h3>Registrar Nueva Bobina</h3>
        
        <Row>
          <Col md={6}>
            {/* ¡NUEVO! Reemplazamos <select> por <Form.Select> */}
            <Form.Group className="mb-3" controlId="formMaterial">
              <Form.Label>Material:</Form.Label>
              <Form.Select value={materialId} onChange={(e) => setMaterialId(e.target.value)}>
                {materiales.length === 0 ? (
                  <option disabled>Crea un material primero</option>
                ) : (
                  materiales.map((material) => (
                    <option key={material.id} value={material.id}>
                      {material.tipo} {material.color} ({material.marca})
                    </option>
                  ))
                )}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formPesoInicial">
              <Form.Label>Peso Inicial (g):</Form.Label>
              <Form.Control 
                type="number" 
                value={pesoInicial} 
                onChange={(e) => setPesoInicial(e.target.value)} 
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formCostoBobina">
              <Form.Label>Costo Bobina (CLP):</Form.Label>
              <Form.Control 
                type="number" 
                value={costoBobina} 
                onChange={(e) => setCostoBobina(e.target.value)} 
                placeholder="Ej: 28000"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formFechaCompra">
              <Form.Label>Fecha Compra:</Form.Label>
              <Form.Control 
                type="date" 
                value={fechaCompra} 
                onChange={(e) => setFechaCompra(e.target.value)} 
              />
            </Form.Group>
          </Col>
        </Row>
        
        <Button variant="primary" type="submit">Guardar Bobina</Button>
        {formError && <Alert variant="danger" className="mt-3">{formError}</Alert>}
      </Form>

      {/* --- TABLA CON BOOTSTRAP --- */}
      <h3>Bobinas en Stock</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Material (Tipo/Color)</th>
            <th>Marca</th>
            <th>Peso Actual</th>
            <th>Peso Inicial</th>
            <th>Costo (CLP)</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {bobinas.map((bobina) => (
            <tr key={bobina.id}>
              <td>{bobina.tipo} {bobina.color}</td>
              <td>{bobina.marca}</td>
              <td>{bobina.peso_actual_g} g</td>
              <td>{bobina.peso_inicial_g} g</td>
              <td>${new Intl.NumberFormat('es-CL').format(bobina.costo_bobina)}</td>
              <td>
                <Button variant="warning" size="sm" disabled className="me-2">
                  Editar
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(bobina.id)}>
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

export default BobinasPage;