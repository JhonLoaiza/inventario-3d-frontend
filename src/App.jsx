// src/App.jsx

import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Button, Nav, Offcanvas, Container, Navbar } from 'react-bootstrap';
import { useAuth } from './context/AuthContext';

// Iconos
import { 
  FaTachometerAlt, FaLayerGroup, FaCompactDisc, 
  FaTags, FaTools, FaShoppingCart, FaSignOutAlt, FaBars 
} from 'react-icons/fa';

// --- COMPONENTE INTERNO: EL CONTENIDO DEL MENÚ ---
// Ahora recibe la prop 'user' para mostrar el nombre
const SidebarContent = ({ logout, isActive, closeMenu, user }) => {
    
  // Estilos de los links
  const linkStyle = (path) => `
    d-flex align-items-center p-3 text-decoration-none 
    ${isActive(path) ? 'bg-primary text-white' : 'text-light'} 
    rounded mb-2
  `;

  const handleClick = () => {
    if (closeMenu) closeMenu();
  };

  return (
    <div className="d-flex flex-column h-100 text-white bg-dark">
      {/* LOGO */}
      <Link to="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none px-3 pt-3" onClick={handleClick}>
        {/* Asegúrate de que la ruta de tu logo sea correcta */}
        <img alt="Logo" src="/m3d-logo.svg" width="40" height="40" className="me-3" />
        <span className="fs-4 fw-bold">M3D Admin</span>
      </Link>
      <hr className="mx-3" />
      
      {/* LINKS */}
      <Nav className="flex-column mb-auto px-3">
        <Link to="/" className={linkStyle('/')} onClick={handleClick}>
          <FaTachometerAlt className="me-3" size={20} /> Dashboard
        </Link>
        <Link to="/ventas" className={linkStyle('/ventas')} onClick={handleClick}>
          <FaShoppingCart className="me-3" size={20} /> Ventas
        </Link>
        <Link to="/trabajos" className={linkStyle('/trabajos')} onClick={handleClick}>
          <FaTools className="me-3" size={20} /> Producción
        </Link>

        <hr className="text-secondary" />
        <div className="text-uppercase small text-muted mb-2 fw-bold px-2">Inventarios</div>

        <Link to="/productos" className={linkStyle('/productos')} onClick={handleClick}>
          <FaTags className="me-3" size={20} /> Productos
        </Link>
        <Link to="/bobinas" className={linkStyle('/bobinas')} onClick={handleClick}>
          <FaCompactDisc className="me-3" size={20} /> Bobinas
        </Link>
        <Link to="/materiales" className={linkStyle('/materiales')} onClick={handleClick}>
          <FaLayerGroup className="me-3" size={20} /> Materiales
        </Link>
      </Nav>
      
      {/* FOOTER DEL SIDEBAR (Aquí mostramos el usuario) */}
      <div className="p-3 mt-auto border-top border-secondary">
          <div className="d-flex align-items-center justify-content-between">
            <div className="small text-white">
                {/* ¡AQUÍ ESTÁ EL CAMBIO! Mostramos el nombre */}
                <div className="fw-bold">
                    Hola, {user?.username || 'Usuario'}
                </div>
                <div className="text-muted" style={{fontSize: '0.8em'}}>v3.0</div>
            </div>
            <Button variant="outline-danger" size="sm" onClick={logout} title="Cerrar Sesión">
                <FaSignOutAlt />
            </Button>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL APP ---
function App() {
  // 1. Obtenemos el usuario del contexto
  const { logout, user } = useAuth();
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const isActive = (path) => location.pathname === path;
  const handleClose = () => setShowMobileMenu(false);
  const handleShow = () => setShowMobileMenu(true);

  return (
    <div className="d-flex" style={{ minHeight: '100vh', overflow: 'hidden' }}>
      
      {/* 1. SIDEBAR DE ESCRITORIO */}
      <div 
        className="d-none d-md-flex flex-column flex-shrink-0 bg-dark" 
        style={{ width: '280px', minHeight: '100vh' }}
      >
        {/* Pasamos el 'user' al componente */}
        <SidebarContent logout={logout} isActive={isActive} user={user} />
      </div>

      {/* 2. BARRA SUPERIOR MÓVIL */}
      <div className="w-100 d-flex flex-column">
        <Navbar bg="dark" variant="dark" className="d-md-none shadow-sm p-2">
            <Container fluid>
                <Button variant="outline-light" onClick={handleShow}>
                    <FaBars />
                </Button>
                <Navbar.Brand href="#" className="ms-2">
                    M3D Admin
                </Navbar.Brand>
            </Container>
        </Navbar>

        {/* 3. MENÚ DESLIZANTE MÓVIL */}
        <Offcanvas show={showMobileMenu} onHide={handleClose} className="bg-dark text-white" style={{ width: '280px' }}>
            <Offcanvas.Header closeButton closeVariant="white" />
            <Offcanvas.Body className="p-0">
                {/* También pasamos el 'user' aquí */}
                <SidebarContent logout={logout} isActive={isActive} closeMenu={handleClose} user={user} />
            </Offcanvas.Body>
        </Offcanvas>

        {/* 4. CONTENIDO PRINCIPAL */}
        <div className="flex-grow-1" style={{ maxHeight: '100vh', overflowY: 'auto', backgroundColor: '#222' }}>
            <div className="d-none d-md-flex bg-dark shadow-sm p-3 mb-4 justify-content-end align-items-center border-bottom border-secondary">
                <span className="text-light small">Sistema de Gestión M3D &copy; 2025</span>
            </div>

            <div className="container-fluid px-4 py-3">
                <Outlet />
            </div>
        </div>
      </div>
      
    </div>
  );
}

export default App;