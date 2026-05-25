-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: good_vision
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ADMINISTRADORES`
--

DROP TABLE IF EXISTS `ADMINISTRADORES`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ADMINISTRADORES` (
  `id_usuario` int NOT NULL,
  `cargo` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nivel_acceso` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_usuario`),
  CONSTRAINT `ADMINISTRADORES_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `USUARIOS` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ADMINISTRADORES`
--

LOCK TABLES `ADMINISTRADORES` WRITE;
/*!40000 ALTER TABLE `ADMINISTRADORES` DISABLE KEYS */;
/*!40000 ALTER TABLE `ADMINISTRADORES` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CATEGORIAS`
--

DROP TABLE IF EXISTS `CATEGORIAS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CATEGORIAS` (
  `id_categoria` int NOT NULL AUTO_INCREMENT,
  `nombre_categoria` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_categoria`),
  UNIQUE KEY `nombre_categoria` (`nombre_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CATEGORIAS`
--

LOCK TABLES `CATEGORIAS` WRITE;
/*!40000 ALTER TABLE `CATEGORIAS` DISABLE KEYS */;
INSERT INTO `CATEGORIAS` VALUES (1,'Lentes');
/*!40000 ALTER TABLE `CATEGORIAS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CLIENTES`
--

DROP TABLE IF EXISTS `CLIENTES`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CLIENTES` (
  `id_cliente` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `documento` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direccion` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `correo` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_cliente`),
  UNIQUE KEY `documento` (`documento`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CLIENTES`
--

LOCK TABLES `CLIENTES` WRITE;
/*!40000 ALTER TABLE `CLIENTES` DISABLE KEYS */;
/*!40000 ALTER TABLE `CLIENTES` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DETALLEMEDIDA_PRODUCTO`
--

DROP TABLE IF EXISTS `DETALLEMEDIDA_PRODUCTO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DETALLEMEDIDA_PRODUCTO` (
  `id_detallemedida` int NOT NULL,
  `id_producto` int NOT NULL,
  PRIMARY KEY (`id_detallemedida`,`id_producto`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `DETALLEMEDIDA_PRODUCTO_ibfk_1` FOREIGN KEY (`id_detallemedida`) REFERENCES `DETALLE_MEDIDA` (`id_detallemedida`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `DETALLEMEDIDA_PRODUCTO_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `PRODUCTOS` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DETALLEMEDIDA_PRODUCTO`
--

LOCK TABLES `DETALLEMEDIDA_PRODUCTO` WRITE;
/*!40000 ALTER TABLE `DETALLEMEDIDA_PRODUCTO` DISABLE KEYS */;
/*!40000 ALTER TABLE `DETALLEMEDIDA_PRODUCTO` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DETALLE_MEDIDA`
--

DROP TABLE IF EXISTS `DETALLE_MEDIDA`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DETALLE_MEDIDA` (
  `id_detallemedida` int NOT NULL AUTO_INCREMENT,
  `id_evaluacion` int NOT NULL,
  `ojo` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `esfera` decimal(5,2) DEFAULT NULL,
  `cilindro` decimal(5,2) DEFAULT NULL,
  `eje` int DEFAULT NULL,
  PRIMARY KEY (`id_detallemedida`),
  KEY `id_evaluacion` (`id_evaluacion`),
  CONSTRAINT `DETALLE_MEDIDA_ibfk_1` FOREIGN KEY (`id_evaluacion`) REFERENCES `EVALUACION_MEDIDA` (`id_evaluacion`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DETALLE_MEDIDA`
--

LOCK TABLES `DETALLE_MEDIDA` WRITE;
/*!40000 ALTER TABLE `DETALLE_MEDIDA` DISABLE KEYS */;
/*!40000 ALTER TABLE `DETALLE_MEDIDA` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DETALLE_VENTAS`
--

DROP TABLE IF EXISTS `DETALLE_VENTAS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DETALLE_VENTAS` (
  `id_detalle_venta` int NOT NULL AUTO_INCREMENT,
  `id_venta` int NOT NULL,
  `id_producto` int NOT NULL,
  `cantidad` int NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_detalle_venta`),
  KEY `id_venta` (`id_venta`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `DETALLE_VENTAS_ibfk_1` FOREIGN KEY (`id_venta`) REFERENCES `VENTAS` (`id_venta`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `DETALLE_VENTAS_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `PRODUCTOS` (`id_producto`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DETALLE_VENTAS`
--

LOCK TABLES `DETALLE_VENTAS` WRITE;
/*!40000 ALTER TABLE `DETALLE_VENTAS` DISABLE KEYS */;
/*!40000 ALTER TABLE `DETALLE_VENTAS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ESPECIALISTAS`
--

DROP TABLE IF EXISTS `ESPECIALISTAS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ESPECIALISTAS` (
  `id_usuario` int NOT NULL,
  `especialidad` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Colegiatura` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Horario_inicio` time NOT NULL,
  `Horario_fin` time NOT NULL,
  PRIMARY KEY (`id_usuario`),
  CONSTRAINT `ESPECIALISTAS_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `USUARIOS` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ESPECIALISTAS`
--

LOCK TABLES `ESPECIALISTAS` WRITE;
/*!40000 ALTER TABLE `ESPECIALISTAS` DISABLE KEYS */;
/*!40000 ALTER TABLE `ESPECIALISTAS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EVALUACION_MEDIDA`
--

DROP TABLE IF EXISTS `EVALUACION_MEDIDA`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `EVALUACION_MEDIDA` (
  `id_evaluacion` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_cliente` int NOT NULL,
  `fecha_evaluacion` date NOT NULL DEFAULT (curdate()),
  `tipo_evaluacion` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `observaciones` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_evaluacion`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_cliente` (`id_cliente`),
  CONSTRAINT `EVALUACION_MEDIDA_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `USUARIOS` (`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `EVALUACION_MEDIDA_ibfk_2` FOREIGN KEY (`id_cliente`) REFERENCES `CLIENTES` (`id_cliente`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EVALUACION_MEDIDA`
--

LOCK TABLES `EVALUACION_MEDIDA` WRITE;
/*!40000 ALTER TABLE `EVALUACION_MEDIDA` DISABLE KEYS */;
/*!40000 ALTER TABLE `EVALUACION_MEDIDA` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `INVENTARIO`
--

DROP TABLE IF EXISTS `INVENTARIO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `INVENTARIO` (
  `id_inventario` int NOT NULL AUTO_INCREMENT,
  `id_producto` int NOT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `stock_minimo` int NOT NULL DEFAULT '5',
  PRIMARY KEY (`id_inventario`),
  UNIQUE KEY `id_producto` (`id_producto`),
  CONSTRAINT `INVENTARIO_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `PRODUCTOS` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `INVENTARIO`
--

LOCK TABLES `INVENTARIO` WRITE;
/*!40000 ALTER TABLE `INVENTARIO` DISABLE KEYS */;
/*!40000 ALTER TABLE `INVENTARIO` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LENTES`
--

DROP TABLE IF EXISTS `LENTES`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `LENTES` (
  `id_producto` int NOT NULL,
  `tipo_lente` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `material` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tratamiento` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_producto`),
  CONSTRAINT `LENTES_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `PRODUCTOS` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LENTES`
--

LOCK TABLES `LENTES` WRITE;
/*!40000 ALTER TABLE `LENTES` DISABLE KEYS */;
/*!40000 ALTER TABLE `LENTES` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MONTURA`
--

DROP TABLE IF EXISTS `MONTURA`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MONTURA` (
  `id_producto` int NOT NULL,
  `marca` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `modelo` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_producto`),
  CONSTRAINT `MONTURA_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `PRODUCTOS` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MONTURA`
--

LOCK TABLES `MONTURA` WRITE;
/*!40000 ALTER TABLE `MONTURA` DISABLE KEYS */;
/*!40000 ALTER TABLE `MONTURA` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PRODUCTOS`
--

DROP TABLE IF EXISTS `PRODUCTOS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PRODUCTOS` (
  `id_producto` int NOT NULL AUTO_INCREMENT,
  `nombre_producto` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `id_categoria` int NOT NULL,
  PRIMARY KEY (`id_producto`),
  KEY `id_categoria` (`id_categoria`),
  CONSTRAINT `PRODUCTOS_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `CATEGORIAS` (`id_categoria`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PRODUCTOS`
--

LOCK TABLES `PRODUCTOS` WRITE;
/*!40000 ALTER TABLE `PRODUCTOS` DISABLE KEYS */;
/*!40000 ALTER TABLE `PRODUCTOS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `USUARIOS`
--

DROP TABLE IF EXISTS `USUARIOS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `USUARIOS` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `correo` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direccion` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_registro` date NOT NULL DEFAULT (curdate()),
  `estado` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'activo',
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ESPECIALISTA',
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `correo` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USUARIOS`
--

LOCK TABLES `USUARIOS` WRITE;
/*!40000 ALTER TABLE `USUARIOS` DISABLE KEYS */;
INSERT INTO `USUARIOS` VALUES (1,'Misael','Challco','misael@gmail.com','999999999','Lima','2026-05-25','ACTIVO','$2a$10$8NNQb4nRA5BHNLw7oLe11u7lSImyAsG1bmqO4kgEF6z4.XClCFVJy','ADMIN');
/*!40000 ALTER TABLE `USUARIOS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `VENTAS`
--

DROP TABLE IF EXISTS `VENTAS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `VENTAS` (
  `id_venta` int NOT NULL AUTO_INCREMENT,
  `id_cliente` int NOT NULL,
  `fecha_venta` date NOT NULL DEFAULT (curdate()),
  `total` decimal(10,2) NOT NULL,
  `metodo_pago` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_venta`),
  KEY `id_cliente` (`id_cliente`),
  CONSTRAINT `VENTAS_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `CLIENTES` (`id_cliente`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `VENTAS`
--

LOCK TABLES `VENTAS` WRITE;
/*!40000 ALTER TABLE `VENTAS` DISABLE KEYS */;
/*!40000 ALTER TABLE `VENTAS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'good_vision'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-25 12:39:06
