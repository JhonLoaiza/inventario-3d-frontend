// src/pages/DashboardPage.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '../api.js';

// ¡NUEVO! Importamos los componentes de Bootstrap
import { Row, Col, Card, Alert } from 'react-bootstrap';

function DashboardPage() {
  // --- ESTADOS --- (Sin cambios)
  const [stats, setStats] = useState({
    valorProductos: 0,
    valorMateriales: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- FUNCIÓN DE API --- (Sin cambios)
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [productosRes, materialesRes] = await Promise.all([
        apiClient.get('/dashboard/valorizado-productos'),
        apiClient.get('/dashboard/valorizado-materiales')
      ]);
      setStats({
        valorProductos: productosRes.data.valor_total_inventario,
        valorMateriales: materialesRes.data.valor_total_materiales
      });
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error al obtener datos del dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // --- RENDERIZADO (JSX) CON BOOTSTRAP ---
  
  if (loading) return <Alert variant="info">Calculando estadísticas... ⏳</Alert>;
  if (error) return <Alert variant="danger">Error: {error} ❌</Alert>;

  return (
    <div>
      <h2>Dashboard Principal</h2>
      <p>Este es el resumen en tiempo real de tu emprendimiento.</p>
      
      {/* Usamos <Row> y <Col> para que las tarjetas 
        se pongan una al lado de la otra en pantallas medianas (md) y 
        se apilen en pantallas pequeñas (celulares).
      */}
      <Row className="mt-4">
        
        {/* --- TARJETA 1: PRODUCTOS TERMINADOS --- */}
        <Col md={6} className="mb-3">
          {/* Reemplazamos <StatCard> por <Card> de Bootstrap */}
          <Card border="primary" className="text-center">
            <Card.Header as="h5">Valor Total (Productos Terminados)</Card.Header>
            <Card.Body>
              <Card.Text as="div">
                {/* Usamos "clases de utilidad" de Bootstrap para el estilo:
                  - fs-1: Font-size 1 (la más grande)
                  - fw-bold: Font-weight bold (negrita)
                  - text-primary: Color de texto azul
                */}
                <div className="fs-1 fw-bold text-primary">
                  ${new Intl.NumberFormat('es-CL').format(stats.valorProductos)}
                </div>
                <div className="text-muted">CLP</div>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        {/* --- TARJETA 2: MATERIA PRIMA --- */}
        <Col md={6} className="mb-3">
          <Card border="success" className="text-center">
            <Card.Header as="h5">Valor Total (Materia Prima)</Card.Header>
            <Card.Body>
              <Card.Text as="div">
                <div className="fs-1 fw-bold text-success">
                  ${new Intl.NumberFormat('es-CL').format(stats.valorMateriales)}
                </div>
                <div className="text-muted">CLP</div>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
      </Row>
    </div>
  );
}

export default DashboardPage;