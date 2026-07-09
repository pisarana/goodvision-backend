-- ============================================================
-- GoodVision - Seed Data (MySQL)
-- Ejecutar DESPUÉS del script de creación de tablas
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

-- Limpiar datos existentes (orden inverso por FK)
TRUNCATE TABLE DETALLE_MEDIDA;
TRUNCATE TABLE EVALUACION_MEDIDA;
TRUNCATE TABLE DETALLE_VENTA;
TRUNCATE TABLE VENTAS;
TRUNCATE TABLE INVENTARIO;
TRUNCATE TABLE PRODUCTOS;
TRUNCATE TABLE CATEGORIAS;
TRUNCATE TABLE CLIENTES;
-- No truncamos USUARIOS para no perder el admin creado al arrancar

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- USUARIOS (password = BCrypt de 'admin1234' y 'espec1234')
-- ============================================================
INSERT INTO USUARIOS (nombre, apellido, correo, password, role) VALUES
  ('Admin', 'GoodVision', 'admin@goodvision.pe',
   '$2a$10$7EqJtq98hPqEX7fNZaFWoOe2LIt5nGEOBhZ8G.5Y5FkIFfHjRq3Zy', 'ADMIN'),
  ('Dr. Roberto', 'Salinas', 'especialista@goodvision.pe',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p690uTbNqZ9S2PbM.vbWNS', 'ESPECIALISTA')
ON DUPLICATE KEY UPDATE correo = VALUES(correo);

-- ============================================================
-- CATEGORIAS
-- ============================================================
INSERT INTO CATEGORIAS (nombre_categoria) VALUES
  ('Lentes Oftalmicos'),
  ('Lentes de Contacto'),
  ('Armazones'),
  ('Lentes de Sol'),
  ('Accesorios'),
  ('Soluciones y Cuidado');

-- ============================================================
-- PRODUCTOS
-- ============================================================
INSERT INTO PRODUCTOS (nombre_producto, precio, id_categoria) VALUES
  ('Lente Monofocal CR-39',          85.00,  1),
  ('Lente Bifocal Essilor',          160.00, 1),
  ('Lente Progresivo Varilux',       380.00, 1),
  ('Lente Blue Cut Anti-Luz Azul',   120.00, 1),
  ('Lente Fotocromatico Transitions', 220.00, 1),
  ('Lente Contacto Diario Acuvue',   95.00,  2),
  ('Lente Contacto Mensual Air Optix', 75.00, 2),
  ('Lente Contacto Torico',          130.00, 2),
  ('Armazon Acetato Premium',        180.00, 3),
  ('Armazon Metal Titanio',          250.00, 3),
  ('Armazon Nylon Flexible',         120.00, 3),
  ('Armazon Infantil Silicona',      95.00,  3),
  ('Lente Sol Polarizado UV400',     195.00, 4),
  ('Lente Sol Ray-Ban Clasico',      320.00, 4),
  ('Estuche Rigido Premium',         25.00,  5),
  ('Cadena Porta Lentes',            15.00,  5),
  ('Kit Limpieza Optica',            18.00,  5),
  ('Solucion Multiusos Renu 355ml',  32.00,  6),
  ('Solucion Saline Bausch 250ml',   20.00,  6),
  ('Gotas Lubricantes Refresh',      28.00,  6);

-- ============================================================
-- INVENTARIO
-- ============================================================
INSERT INTO INVENTARIO (id_producto, stock, stock_minimo) VALUES
  (1, 30, 5),
  (2, 12, 3),
  (3,  8, 2),
  (4, 25, 5),
  (5, 15, 5),
  (6, 40, 10),
  (7, 20, 5),
  (8, 10, 3),
  (9, 18, 5),
  (10, 14, 3),
  (11, 35, 8),
  (12,  7, 2),
  (13, 50, 10),
  (14, 45, 10),
  (15, 60, 15),
  (16, 80, 20),
  (17, 55, 10),
  (18, 70, 15),
  (19, 45, 10),
  (20, 30, 5);

-- ============================================================
-- CLIENTES
-- ============================================================
INSERT INTO CLIENTES (nombre, apellido, documento, telefono, direccion, correo) VALUES
  ('Maria',  'Torres',  '45781230', '987654321', 'Av. Arequipa 456, Lima',         'maria.torres@gmail.com'),
  ('Carlos', 'Quispe',  '32156789', '976543210', 'Jr. Ucayali 123, Lima',          'cquispe@hotmail.com'),
  ('Ana',    'Flores',  '28976543', '965432109', 'Calle Los Pinos 789, Miraflores', NULL),
  ('Luis',   'Mamani',  '71234560', '954321098', 'Av. Tupac Amaru 1120, SJL',      'lmamani@gmail.com'),
  ('Rosa',   'Huanca',  '60234518', '943210987', 'Psje. Santa Rosa 45, Surco',     'rosa.huanca@yahoo.com'),
  ('Juan',   'Ccopa',   '80123456', '932109876', NULL,                              NULL),
  ('Sofia',  'Mendoza', '55678901', '921098765', 'Av. Brasil 234, Pueblo Libre',   'sofia.mendoza@gmail.com');

-- ============================================================
-- VENTAS + DETALLES
-- id_usuario = 1 (admin), clientes 1-7, productos con precio real
-- ============================================================

-- Venta 1: Maria Torres — monofocal + armazón + estuche — EFECTIVO
INSERT INTO VENTAS (id_cliente, id_usuario, metodo_pago, total, fecha_venta) VALUES
  (1, 1, 'EFECTIVO', 290.00, NOW() - INTERVAL 6 DAY);
SET @v1 = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
  (@v1, 1, 1, 85.00, 85.00),
  (@v1, 9, 1, 180.00, 180.00),
  (@v1, 15, 1, 25.00, 25.00);

-- Venta 2: Carlos Quispe — progresivo + titanio — TARJETA
INSERT INTO VENTAS (id_cliente, id_usuario, metodo_pago, total, fecha_venta) VALUES
  (2, 1, 'TARJETA', 630.00, NOW() - INTERVAL 5 DAY);
SET @v2 = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
  (@v2, 3, 1, 380.00, 380.00),
  (@v2, 10, 1, 250.00, 250.00);

-- Venta 3: Ana Flores — contacto mensual x2 + solución — YAPE
INSERT INTO VENTAS (id_cliente, id_usuario, metodo_pago, total, fecha_venta) VALUES
  (3, 1, 'YAPE', 182.00, NOW() - INTERVAL 4 DAY);
SET @v3 = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
  (@v3, 7, 2, 75.00, 150.00),
  (@v3, 18, 1, 32.00, 32.00);

-- Venta 4: Luis Mamani — Ray-Ban + cadena — EFECTIVO
INSERT INTO VENTAS (id_cliente, id_usuario, metodo_pago, total, fecha_venta) VALUES
  (4, 1, 'EFECTIVO', 335.00, NOW() - INTERVAL 3 DAY);
SET @v4 = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
  (@v4, 14, 1, 320.00, 320.00),
  (@v4, 16, 1, 15.00, 15.00);

-- Venta 5: Rosa Huanca — blue cut + nylon + kit — TRANSFERENCIA
INSERT INTO VENTAS (id_cliente, id_usuario, metodo_pago, total, fecha_venta) VALUES
  (5, 1, 'TRANSFERENCIA', 258.00, NOW() - INTERVAL 2 DAY);
SET @v5 = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
  (@v5, 4, 1, 120.00, 120.00),
  (@v5, 11, 1, 120.00, 120.00),
  (@v5, 17, 1, 18.00, 18.00);

-- Venta 6: Sofia Mendoza — bifocal + armazón infantil — YAPE
INSERT INTO VENTAS (id_cliente, id_usuario, metodo_pago, total, fecha_venta) VALUES
  (7, 1, 'YAPE', 255.00, NOW() - INTERVAL 1 DAY);
SET @v6 = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
  (@v6, 2, 1, 160.00, 160.00),
  (@v6, 12, 1, 95.00, 95.00);

-- ============================================================
-- EVALUACIONES MEDIDA (OD = ojo derecho, OI = ojo izquierdo)
-- ============================================================

-- Eval 1: Maria Torres — miopía bilateral
INSERT INTO EVALUACION_MEDIDA (id_cliente, id_usuario, tipo_evaluacion, observaciones, fecha_evaluacion) VALUES
  (1, 1, 'CONTROL', 'Miopia moderada, uso permanente de lentes', NOW() - INTERVAL 6 DAY);
SET @e1 = LAST_INSERT_ID();
INSERT INTO DETALLE_MEDIDA (id_evaluacion, ojo, esfera, cilindro, eje) VALUES
  (@e1, 'OD', -2.50, -0.75, 180),
  (@e1, 'OI', -2.25, -0.50, 175);

-- Eval 2: Carlos Quispe — presbicia + astigmatismo
INSERT INTO EVALUACION_MEDIDA (id_cliente, id_usuario, tipo_evaluacion, observaciones, fecha_evaluacion) VALUES
  (2, 1, 'PRIMERA_VEZ', 'Presbicia y astigmatismo, receta para lentes progresivos', NOW() - INTERVAL 5 DAY);
SET @e2 = LAST_INSERT_ID();
INSERT INTO DETALLE_MEDIDA (id_evaluacion, ojo, esfera, cilindro, eje) VALUES
  (@e2, 'OD', 1.75, -1.00, 90),
  (@e2, 'OI', 2.00, -0.75, 85);

-- Eval 3: Ana Flores — control lentes de contacto
INSERT INTO EVALUACION_MEDIDA (id_cliente, id_usuario, tipo_evaluacion, observaciones, fecha_evaluacion) VALUES
  (3, 1, 'CONTROL', 'Buen porte de lentes de contacto, continua misma graduacion', NOW() - INTERVAL 4 DAY);
SET @e3 = LAST_INSERT_ID();
INSERT INTO DETALLE_MEDIDA (id_evaluacion, ojo, esfera, cilindro, eje) VALUES
  (@e3, 'OD', -1.75, 0.00, 0),
  (@e3, 'OI', -1.50, 0.00, 0);

-- Eval 4: Luis Mamani — hipermetropía leve
INSERT INTO EVALUACION_MEDIDA (id_cliente, id_usuario, tipo_evaluacion, observaciones, fecha_evaluacion) VALUES
  (4, 1, 'PRIMERA_VEZ', 'Hipermetropia leve, lentes de lectura recomendados', NOW() - INTERVAL 3 DAY);
SET @e4 = LAST_INSERT_ID();
INSERT INTO DETALLE_MEDIDA (id_evaluacion, ojo, esfera, cilindro, eje) VALUES
  (@e4, 'OD', 1.25, -0.25, 170),
  (@e4, 'OI', 1.00, -0.25, 165);

-- Eval 5: Rosa Huanca — control anual, miopía progresando
INSERT INTO EVALUACION_MEDIDA (id_cliente, id_usuario, tipo_evaluacion, observaciones, fecha_evaluacion) VALUES
  (5, 1, 'CONTROL', 'Miopia progresando, aumentar graduacion OD', NOW() - INTERVAL 2 DAY);
SET @e5 = LAST_INSERT_ID();
INSERT INTO DETALLE_MEDIDA (id_evaluacion, ojo, esfera, cilindro, eje) VALUES
  (@e5, 'OD', -3.00, -1.25, 15),
  (@e5, 'OI', -2.50, -1.00, 10);

-- ============================================================
SELECT 'Seed completado correctamente' AS resultado;
SELECT COUNT(*) AS categorias  FROM CATEGORIAS;
SELECT COUNT(*) AS productos   FROM PRODUCTOS;
SELECT COUNT(*) AS inventario  FROM INVENTARIO;
SELECT COUNT(*) AS clientes    FROM CLIENTES;
SELECT COUNT(*) AS ventas      FROM VENTAS;
SELECT COUNT(*) AS medidas     FROM EVALUACION_MEDIDA;
