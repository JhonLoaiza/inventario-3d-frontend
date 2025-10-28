// src/pages/MaterialesPage.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '../api.js';

// ¡NUEVO! Importamos todos los componentes de Bootstrap que usaremos
import { Table, Button, Form, Alert, Row, Col } from 'react-bootstrap';

function MaterialesPage() {
  // --- ESTADOS --- (Sin cambios)
  const [materiales, setMateriales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tipo, setTipo] = useState('');
  const [marca, setMarca] = useState('');
  const [color, setColor] = useState('');
  const [formError, setFormError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // --- FUNCIONES DE API --- (Sin cambios)
  useEffect(() => { fetchMateriales(); }, []);

  // --- Lógica de la API (copia y pega tus funciones sin cambios) ---
  // (fetchMateriales, handleDelete, handleSubmit, handleSelectEdit, limpiarFormulario)
  const fetchMateriales = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/materiales');
      setMateriales(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro?")) return;
    try {
      await apiClient.delete(`/materiales/${id}`);
      setMateriales(materiales.filter((m) => m.id !== id));
    } catch (err) {
      setError("Error al eliminar: " + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!tipo || !color) {
      setFormError('Tipo y Color son obligatorios.');
      return;
    }
    const materialData = { tipo, marca, color };
    try {
      if (editingId) {
        const response = await apiClient.put(`/materiales/${editingId}`, materialData);
        setMateriales(materiales.map((m) => (m.id === editingId ? response.data : m)));
      } else {
        const response = await apiClient.post('/materiales', materialData);
        setMateriales([...materiales, response.data]);
      }
      limpiarFormulario();
    } catch (err) {
      setFormError(`Error: ` + err.message);
    }
  };

  const handleSelectEdit = (material) => {
    setEditingId(material.id);
    setTipo(material.tipo);
    setMarca(material.marca);
    setColor(material.color);
    setFormError(null);
  };

  const limpiarFormulario = () => {
    setEditingId(null);
    setTipo('');
    setMarca('');
    setColor('');
    setFormError(null);
  };
  // -----------------------------------------------------------------


  // --- RENDERIZADO (JSX) ---

  // ¡NUEVO! Usamos un componente <Alert> de Bootstrap para el loading/error
  if (loading) return <Alert variant="info">Cargando materiales... ⏳</Alert>;
  if (error) return <Alert variant="danger">Error: {error} ❌</Alert>;

  return (
    <div>
      <h2>Gestión de Materiales</h2>

      {/* --- FORMULARIO "INTELIGENTE" CON BOOTSTRAP --- */}
      {/* Reemplazamos <form> por <Form> */}
      <Form onSubmit={handleSubmit} className="mb-4 p-3 border rounded">
        <h3>{editingId ? 'Actualizar Material' : 'Crear Nuevo Material'}</h3>

        {/* Usamos <Row> y <Col> para poner campos uno al lado del otro */}
        <Row>
          <Col md={4}>
            {/* <Form.Group> agrupa <Form.Label> y <Form.Control> */}
            <Form.Group className="mb-3" controlId="formTipo">
              <Form.Label>Tipo:</Form.Label>
              <Form.Control 
                type="text" 
                value={tipo} 
                onChange={(e) => setTipo(e.target.value)} 
                placeholder="Ej: PLA" 
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3" controlId="formMarca">
              <Form.Label>Marca:</Form.Label>
              <Form.Control 
                type="text" 
                value={marca} 
                onChange={(e) => setMarca(e.target.value)} 
                placeholder="Ej: Grilon3" 
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3" controlId="formColor">
              <Form.Label>Color:</Form.Label>
              <Form.Control 
                type="text" 
                value={color} 
                onChange={(e) => setColor(e.target.value)} 
                placeholder="Ej: Rojo Fuego" 
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Reemplazamos <button> por <Button> */}
        <Button variant="primary" type="submit">
          {editingId ? 'Actualizar' : 'Guardar Material'}
        </Button>

        {editingId && (
          <Button variant="secondary" onClick={limpiarFormulario} className="ms-2">
            Cancelar Edición
          </Button>
        )}

        {/* Usamos <Alert> para el error del formulario */}
        {formError && <Alert variant="danger" className="mt-3">{formError}</Alert>}
      </Form>

      {/* --- TABLA DE MATERIALES CON BOOTSTRAP --- */}
      {/* Reemplazamos <table> por <Table> */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tipo</th>
            <th>Marca</th>
            <th>Color</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {materiales.map((material) => (
            <tr key={material.id}>
              <td>{material.id}</td>
              <td>{material.tipo}</td>
              <td>{material.marca}</td>
              <td>{material.color}</td>
              <td>
                {/* Botones de Bootstrap con variantes de color y tamaño */}
                <Button variant="warning" size="sm" onClick={() => handleSelectEdit(material)} className="me-2">
                  Editar
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(material.id)}>
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

export default MaterialesPage;