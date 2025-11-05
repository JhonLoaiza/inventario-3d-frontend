// src/App.jsx

import { Link, Outlet } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';

// 1. Importa el hook (esto está bien)
import { useAuth } from './context/AuthContext';

// 2. BORRA la línea "const { logout } = useAuth();" de aquí afuera

function App() {
  // 3. ¡MUEVE LA LÍNEA AQUÍ!
  //    Los Hooks siempre se llaman DENTRO de la función del componente
  const { logout } = useAuth();

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">Inventario M3D</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">

              <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
              <Nav.Link as={Link} to="/materiales">Materiales</Nav.Link>
              <Nav.Link as={Link} to="/bobinas">Bobinas</Nav.Link>
              <Nav.Link as={Link} to="/productos">Productos</Nav.Link>
              <Nav.Link as={Link} to="/trabajos">Producción</Nav.Link>

            </Nav> {/* <-- ¡OJO! También corregí tu HTML aquí, tenías un <Nav> dentro de otro <Nav> */}

            <Navbar.Text className="text-muted me-3">
              v2.0.0-beta
            </Navbar.Text>

            <Nav className="ms-auto"> {/* 'ms-auto' lo empuja a la derecha */}
              <Button variant="outline-light" onClick={logout}>
                Cerrar Sesión
              </Button>
            </Nav>

          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <main style={{ padding: '20px 0' }}>
          <Outlet />
        </main>
      </Container>
    </div>
  );
}

export default App;