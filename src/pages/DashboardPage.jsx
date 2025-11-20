// src/pages/DashboardPage.jsx

// src/pages/DashboardPage.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '../api.js';
import { Row, Col, Card, Alert, Container } from 'react-bootstrap';

function DashboardPage() {
  // --- ESTADOS ---
  const [stats, setStats] = useState({
    valorProductos: 0,
    valorMateriales: 0,
    saldoCaja: 0 // ¡NUEVO ESTADO!
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- FUNCIÓN DE API ---
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // ¡Ahora hacemos 3 peticiones!
      const [productosRes, materialesRes, saldoRes] = await Promise.all([
        apiClient.get('/dashboard/valorizado-productos'),
        apiClient.get('/dashboard/valorizado-materiales'),
        apiClient.get('/dashboard/saldo') // ¡NUEVA PETICIÓN!
      ]);

      console.log("Respuesta Saldo COMPLETA:", saldoRes);
      console.log("Data de Saldo:", saldoRes.data);
      
      setStats({
        valorProductos: productosRes.data.valor_total_inventario,
        valorMateriales: materialesRes.data.valor_total_materiales,
        saldoCaja: saldoRes.data.saldo // Guardamos el saldo
      });
      
      setError(null);
    } catch (err) {
      console.error("Error al obtener datos:", err);
      // No bloqueamos la app si falla el dashboard, solo mostramos error
      setError("No se pudieron cargar algunos datos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // --- RENDERIZADO ---
  
  if (loading) return <Alert variant="info">Calculando finanzas... ⏳</Alert>;
  
  return (
    <div>
      <h2 className="mb-4">Tablero de Control M3D</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Row>
        {/* --- TARJETA 1: SALDO EN CAJA (¡LA NUEVA!) --- */}
        <Col md={4} className="mb-4">
          <Card border="warning" className="text-center h-100 shadow-sm">
            <Card.Header as="h5" className="bg-warning text-dark">Saldo Actual (Caja)</Card.Header>
            <Card.Body className="d-flex align-items-center justify-content-center">
              <div>
                <div className="fs-1 fw-bold text-warning">
                  ${new Intl.NumberFormat('es-CL').format(stats.saldoCaja)}
                </div>
                <div className="text-muted">CLP Disponible</div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* --- TARJETA 2: PRODUCTOS TERMINADOS --- */}
        <Col md={4} className="mb-4">
          <Card border="primary" className="text-center h-100 shadow-sm">
            <Card.Header as="h5" className="bg-primary text-white">Inventario (Venta)</Card.Header>
            <Card.Body className="d-flex align-items-center justify-content-center">
              <div>
                <div className="fs-1 fw-bold text-primary">
                  ${new Intl.NumberFormat('es-CL').format(stats.valorProductos)}
                </div>
                <div className="text-muted">Valorizado en Stock</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        {/* --- TARJETA 3: MATERIA PRIMA --- */}
        <Col md={4} className="mb-4">
          <Card border="success" className="text-center h-100 shadow-sm">
            <Card.Header as="h5" className="bg-success text-white">Materia Prima</Card.Header>
            <Card.Body className="d-flex align-items-center justify-content-center">
              <div>
                <div className="fs-1 fw-bold text-success">
                  ${new Intl.NumberFormat('es-CL').format(stats.valorMateriales)}
                </div>
                <div className="text-muted">Filamento Restante</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
      </Row>
    </div>
  );
}

export default DashboardPage;