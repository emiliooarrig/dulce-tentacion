-- Base de datos: La Dulce Tentación
CREATE DATABASE IF NOT EXISTS dulce_tentacion CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE dulce_tentacion;

CREATE TABLE IF NOT EXISTS categories (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(100) NOT NULL,
  descripcion TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  nombre       VARCHAR(200)   NOT NULL,
  descripcion  TEXT,
  precio       DECIMAL(10, 2) NOT NULL,
  imagen       VARCHAR(500),
  categoria_id INT,
  destacado    BOOLEAN        DEFAULT FALSE,
  activo       BOOLEAN        DEFAULT TRUE,
  created_at   TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (categoria_id) REFERENCES categories (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  nombre     VARCHAR(100) NOT NULL,
  email      VARCHAR(150) UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,
  rol        ENUM('admin', 'superadmin') DEFAULT 'admin',
  activo     BOOLEAN   DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Usuario administrador inicial (contraseña: admin123)
INSERT INTO users (nombre, email, password, rol)
VALUES ('Administrador', 'admin@dulcetentacion.com', '$2b$10$LQLb5WRfAnM/6cL/bbtYQuETFq56Kv9zoQmpasNQ/q3ft6Ltm2isa', 'superadmin');

-- Categorías de ejemplo
INSERT INTO categories (nombre, descripcion) VALUES
  ('Pasteles', 'Pasteles artesanales de todos los sabores'),
  ('Cupcakes', 'Cupcakes decorados con buttercream'),
  ('Galletas', 'Galletas decoradas y tradicionales'),
  ('Postres', 'Postres individuales y para compartir');

-- Productos de ejemplo
INSERT INTO products (nombre, descripcion, precio, categoria_id, destacado) VALUES
  ('Pastel de Chocolate', 'Delicioso pastel de chocolate con betún de ganache', 450.00, 1, TRUE),
  ('Pastel Red Velvet', 'Pastel red velvet con crema de queso', 480.00, 1, TRUE),
  ('Cupcakes de Vainilla', 'Pack de 6 cupcakes de vainilla con betún de colores', 180.00, 2, TRUE),
  ('Cupcakes de Chocolate', 'Pack de 6 cupcakes de chocolate con chispas', 180.00, 2, FALSE),
  ('Galletas Decoradas', 'Caja de 12 galletas decoradas con glasa real', 220.00, 3, TRUE),
  ('Cheesecake de Fresa', 'Cheesecake cremoso con coulis de fresa', 390.00, 4, FALSE);
