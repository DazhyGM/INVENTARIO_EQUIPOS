-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 15-08-2025 a las 00:55:17
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bdhost`
--
CREATE DATABASE IF NOT EXISTS `bdhost` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `bdhost`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `campaña`
--

CREATE TABLE IF NOT EXISTS `campaña` (
  `id_campaña` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_campaña` varchar(50) NOT NULL,
  PRIMARY KEY (`id_campaña`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `campaña`
--

TRUNCATE TABLE `campaña`;
--
-- Volcado de datos para la tabla `campaña`
--

INSERT INTO `campaña` (`id_campaña`, `nombre_campaña`) VALUES
(1, 'T-Mobile'),
(2, 'Capital One'),
(3, 'Disney'),
(4, 'Credit One'),
(5, 'McAfee'),
(6, 'GoDaddy');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `equipo`
--

CREATE TABLE IF NOT EXISTS `equipo` (
  `id_equipo` int(11) NOT NULL AUTO_INCREMENT,
  `hostname` varchar(50) NOT NULL,
  `fecha_registro` date NOT NULL,
  `fecha_finalizacion` date NOT NULL,
  `estado_fk` int(11) NOT NULL,
  `id_campaña` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_equipo`),
  KEY `fk_equipo_estado` (`estado_fk`),
  KEY `fk_equipo_campaña` (`id_campaña`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `equipo`
--

TRUNCATE TABLE `equipo`;
--
-- Volcado de datos para la tabla `equipo`
--

INSERT INTO `equipo` (`id_equipo`, `hostname`, `fecha_registro`, `fecha_finalizacion`, `estado_fk`, `id_campaña`) VALUES
(1, 'DESKTOP-DB7ZHP', '2025-08-13', '2025-08-14', 2, 1),
(6, 'DESKTOP-HB7ZHP', '2025-08-14', '0000-00-00', 1, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `equipo_tarea`
--

CREATE TABLE IF NOT EXISTS `equipo_tarea` (
  `id_equipo_tarea` int(11) NOT NULL AUTO_INCREMENT,
  `id_equipo` int(11) NOT NULL,
  `id_tarea` int(11) NOT NULL,
  `comentario` text DEFAULT NULL,
  `fecha_asignacion` date DEFAULT curdate(),
  `estado_tarea_fk` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_equipo_tarea`),
  KEY `id_equipo` (`id_equipo`),
  KEY `id_tarea` (`id_tarea`),
  KEY `estado_tarea_fk` (`estado_tarea_fk`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `equipo_tarea`
--

TRUNCATE TABLE `equipo_tarea`;
--
-- Volcado de datos para la tabla `equipo_tarea`
--

INSERT INTO `equipo_tarea` (`id_equipo_tarea`, `id_equipo`, `id_tarea`, `comentario`, `fecha_asignacion`, `estado_tarea_fk`) VALUES
(1, 1, 1, 'Holaaaaa', '2025-08-13', 1),
(2, 1, 2, NULL, '2025-08-13', 1),
(3, 1, 3, NULL, '2025-08-13', 1),
(4, 1, 4, NULL, '2025-08-13', 1),
(5, 1, 5, NULL, '2025-08-13', 1),
(26, 6, 1, NULL, '2025-08-14', 1),
(27, 6, 2, NULL, '2025-08-14', 1),
(28, 6, 3, NULL, '2025-08-14', 2),
(29, 6, 4, NULL, '2025-08-14', 1),
(30, 6, 5, NULL, '2025-08-14', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado_equipo`
--

CREATE TABLE IF NOT EXISTS `estado_equipo` (
  `id_estado` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  PRIMARY KEY (`id_estado`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `estado_equipo`
--

TRUNCATE TABLE `estado_equipo`;
--
-- Volcado de datos para la tabla `estado_equipo`
--

INSERT INTO `estado_equipo` (`id_estado`, `nombre`) VALUES
(1, 'En preparacion'),
(2, 'Completado'),
(3, 'Sin asignar');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado_tarea`
--

CREATE TABLE IF NOT EXISTS `estado_tarea` (
  `id_estado` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  PRIMARY KEY (`id_estado`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `estado_tarea`
--

TRUNCATE TABLE `estado_tarea`;
--
-- Volcado de datos para la tabla `estado_tarea`
--

INSERT INTO `estado_tarea` (`id_estado`, `nombre`) VALUES
(1, 'Completado'),
(2, 'Sin realizar');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol_user`
--

CREATE TABLE IF NOT EXISTS `rol_user` (
  `id_rol` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_rol` varchar(255) NOT NULL,
  PRIMARY KEY (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `rol_user`
--

TRUNCATE TABLE `rol_user`;
--
-- Volcado de datos para la tabla `rol_user`
--

INSERT INTO `rol_user` (`id_rol`, `nombre_rol`) VALUES
(1, 'Admin');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tareas`
--

CREATE TABLE IF NOT EXISTS `tareas` (
  `id_tarea` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_tarea` varchar(255) NOT NULL,
  PRIMARY KEY (`id_tarea`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `tareas`
--

TRUNCATE TABLE `tareas`;
--
-- Volcado de datos para la tabla `tareas`
--

INSERT INTO `tareas` (`id_tarea`, `nombre_tarea`) VALUES
(1, 'Validacion estado actual'),
(2, 'Montar imagen'),
(3, 'Validacion aplicaciones instaladas'),
(4, 'Verificacion reporte consolas (S1, SCCM, AD)'),
(5, 'Logueo usuario');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id_user` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `rol_fk` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id_user`),
  KEY `fk_user_rol` (`rol_fk`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `user`
--

TRUNCATE TABLE `user`;
--
-- Volcado de datos para la tabla `user`
--

INSERT INTO `user` (`id_user`, `nombre`, `rol_fk`, `email`, `password`) VALUES
(1, 'Kevincito', 1, 'kevinsabogal24@gmail.com', '$2b$10$D0ryL21Uw2f0MLnm4545gORmFCsYGDFDG17OlgZj5rD/ZpGcaJaEO'),
(2, 'Maicol Lara', 1, 'maicol.lara@uniminuto.edu.co', '$2b$10$UMSQBnOfs0Q3c0IdeFTHz.jaMzj/BIqkhlzTJeyQupgKEEreJym8C');

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `equipo`
--
ALTER TABLE `equipo`
  ADD CONSTRAINT `fk_equipo_campaña` FOREIGN KEY (`id_campaña`) REFERENCES `campaña` (`id_campaña`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_equipo_estado` FOREIGN KEY (`estado_fk`) REFERENCES `estado_equipo` (`id_estado`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `equipo_tarea`
--
ALTER TABLE `equipo_tarea`
  ADD CONSTRAINT `equipo_tarea_ibfk_1` FOREIGN KEY (`id_equipo`) REFERENCES `equipo` (`id_equipo`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `equipo_tarea_ibfk_2` FOREIGN KEY (`id_tarea`) REFERENCES `tareas` (`id_tarea`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `equipo_tarea_ibfk_3` FOREIGN KEY (`estado_tarea_fk`) REFERENCES `estado_tarea` (`id_estado`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `fk_user_rol` FOREIGN KEY (`rol_fk`) REFERENCES `rol_user` (`id_rol`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
