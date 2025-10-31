// src/App.jsx

// 1. Importa Link y Outlet (como antes)
import { Link, Outlet } from 'react-router-dom';

// 2. ¡NUEVO! Importa los componentes de Bootstrap
import { Navbar, Nav, Container } from 'react-bootstrap';

function App() {
  return (
    <div>
      {/* 3. Reemplazamos <nav> por <Navbar> */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">Inventario 3D</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">

              {/* 4. ¡LA CLAVE!
                  Usamos <Nav.Link> (el componente de Bootstrap)
                  pero le decimos "as={Link}" para que use el Link de React Router.
                  ¡Esto une Bootstrap con React Router! */}
              <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
              <Nav.Link as={Link} to="/materiales">Materiales</Nav.Link>
              <Nav.Link as={Link} to="/bobinas">Bobinas</Nav.Link>
              <Nav.Link as={Link} to="/productos">Productos</Nav.Link>
              <Nav.Link as={Link} to="/trabajos">Producción</Nav.Link>

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* 5. El <Outlet> y el <main> ahora los envolvemos en un <Container> 
          para que el contenido no se pegue a los bordes de la pantalla. */}
      <Container>
        <main style={{ padding: '20px 0' }}>
          <Outlet />
        </main>
      </Container>
    </div>
  );
}

export default App;