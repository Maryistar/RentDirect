-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 05-04-2026 a las 20:33:16
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
-- Base de datos: `rent_direct`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `applications`
--

CREATE TABLE `applications` (
  `id` bigint(20) NOT NULL,
  `property_id` bigint(20) NOT NULL,
  `tenant_id` bigint(20) NOT NULL,
  `status` enum('pending','in_review','agreed','contract_signed','active','rejected') DEFAULT 'pending',
  `message` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `applications`
--

INSERT INTO `applications` (`id`, `property_id`, `tenant_id`, `status`, `message`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 1, 'agreed', 'Estoy interesado en la propiedad', '2026-02-16 03:09:00', '2026-02-27 12:38:36', NULL),
(37, 55, 1, 'agreed', 'Estoy interesado en esta propiedad', '2026-04-02 16:33:33', '2026-04-02 16:35:03', NULL),
(39, 57, 1, 'agreed', 'Estoy interesado en esta propiedad', '2026-04-02 16:59:13', '2026-04-02 16:59:59', NULL),
(41, 59, 1, 'agreed', 'Estoy interesado en esta propiedad', '2026-04-02 18:32:51', '2026-04-02 18:33:58', NULL),
(48, 66, 6, 'agreed', 'Estoy interesado en esta propiedad', '2026-04-02 21:46:23', '2026-04-02 23:10:25', NULL),
(52, 68, 6, 'agreed', 'Estoy interesado en esta propiedad', '2026-04-03 00:26:59', '2026-04-03 00:27:18', NULL),
(53, 69, 6, 'agreed', 'Estoy interesado en esta propiedad', '2026-04-03 00:41:38', '2026-04-03 11:59:43', NULL),
(64, 79, 1, 'agreed', 'Estoy interesado en esta propiedad', '2026-04-04 16:26:15', '2026-04-04 16:27:11', NULL),
(65, 80, 1, 'agreed', 'Estoy interesado en esta propiedad', '2026-04-04 17:04:11', '2026-04-04 17:05:10', NULL),
(66, 81, 1, 'agreed', 'Estoy interesado en esta propiedad', '2026-04-04 17:43:11', '2026-04-04 17:44:31', NULL),
(67, 82, 6, 'in_review', 'Estoy interesado en esta propiedad', '2026-04-04 19:39:56', '2026-04-04 19:40:15', NULL),
(68, 85, 6, 'agreed', 'Estoy interesado en esta propiedad', '2026-04-05 12:45:47', '2026-04-05 12:46:24', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `chats`
--

CREATE TABLE `chats` (
  `id` bigint(20) NOT NULL,
  `property_id` bigint(20) NOT NULL,
  `owner_id` bigint(20) NOT NULL,
  `tenant_id` bigint(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `chats`
--

INSERT INTO `chats` (`id`, `property_id`, `owner_id`, `tenant_id`, `created_at`) VALUES
(27, 55, 2, 1, '2026-04-02 16:34:09'),
(28, 57, 2, 1, '2026-04-02 16:59:35'),
(30, 59, 2, 1, '2026-04-02 18:33:30'),
(32, 66, 2, 6, '2026-04-02 21:46:39'),
(35, 68, 2, 6, '2026-04-03 00:27:11'),
(38, 69, 2, 6, '2026-04-03 11:59:26'),
(44, 79, 2, 1, '2026-04-04 16:26:30'),
(45, 80, 2, 1, '2026-04-04 17:04:19'),
(46, 81, 2, 1, '2026-04-04 17:43:32'),
(47, 82, 2, 6, '2026-04-04 19:40:14'),
(48, 85, 2, 6, '2026-04-05 12:46:08');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `contracts`
--

CREATE TABLE `contracts` (
  `id` int(11) NOT NULL,
  `chat_id` int(11) DEFAULT NULL,
  `property_id` int(11) DEFAULT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `tenant_id` int(11) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `monthly_price` decimal(10,2) DEFAULT NULL,
  `terms` text DEFAULT NULL,
  `status` varchar(20) DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `payment_method` varchar(50) DEFAULT NULL,
  `property_address` varchar(255) DEFAULT NULL,
  `property_description` text DEFAULT NULL,
  `utilities` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`utilities`)),
  `use_clause` text DEFAULT NULL,
  `repairs_clause` text DEFAULT NULL,
  `termination_clause` text DEFAULT NULL,
  `owner_name` varchar(255) DEFAULT NULL,
  `tenant_name` varchar(255) DEFAULT NULL,
  `owner_document` varchar(50) DEFAULT NULL,
  `tenant_document` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `contracts`
--

INSERT INTO `contracts` (`id`, `chat_id`, `property_id`, `owner_id`, `tenant_id`, `start_date`, `end_date`, `monthly_price`, `terms`, `status`, `created_at`, `payment_method`, `property_address`, `property_description`, `utilities`, `use_clause`, `repairs_clause`, `termination_clause`, `owner_name`, `tenant_name`, `owner_document`, `tenant_document`) VALUES
(1, 16, 27, 2, 1, '2026-05-15', '2026-10-15', 1200000.00, 'acordado', 'active', '2026-03-27 01:54:33', 'Transferencia', 'prueba chat, El Poblado', 'prueba chat', '[\"Agua\",\"Luz\",\"Gas\"]', 'bien', 'bien', 'bien', NULL, NULL, NULL, NULL),
(2, 17, 28, 2, 1, '2026-11-15', '2026-12-12', 1000000.00, 'ya', 'active', '2026-03-27 11:43:20', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 17, 28, 2, 1, '2026-11-15', '2026-12-12', 1000000.00, 'ya', 'pending', '2026-03-27 11:44:41', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(10, 20, 39, 2, 1, '2026-10-15', '2026-12-15', 850000.00, 'kxn', 'active', '2026-03-31 19:01:29', 'Transferencia', 'khndckjdkj, Laureles', 'ahdoaicucx', '[\"Agua\",\"Luz\"]', 'siz', 'uxh', 'ihxsu', NULL, NULL, NULL, NULL),
(11, 22, 42, 2, 1, '2026-05-21', '2026-10-21', 7500000.00, 'gjvjgv', 'active', '2026-03-31 19:52:36', 'Transferencia', 'ohoibhdi, Laureles', 'dlmlñfbsmñsflbm', '[\"Agua\",\"Luz\",\"Gas\",\"Administración\"]', 'ghggsd', 'jbjhvh', 'hjgf', NULL, NULL, NULL, NULL),
(12, 24, 45, 2, 1, '2026-10-11', '2026-12-11', 51378787.00, 'hiihih15', 'active', '2026-03-31 23:09:44', 'Transferencia', 'jbkjdcbkdv15, Laureles', 'jhjkhnkj', '[\"Agua\",\"Luz\",\"Gas\"]', 'ooj', 'oihoh', 'oihoi', NULL, NULL, NULL, NULL),
(13, 25, 50, 2, 1, '2026-04-05', '2026-10-05', 55.00, 'oihoh', 'active', '2026-03-31 23:57:40', 'Transferencia', 'sjasjl, El Poblado', 'cdjbdkjbwk', '[\"Agua\",\"Luz\",\"Gas\"]', 'okjoj', 'ioijoi', 'iojoih', NULL, NULL, NULL, NULL),
(14, 27, 55, 2, 1, '2026-04-03', '2026-10-03', 850000.00, 'hola', 'active', '2026-04-02 16:36:01', 'Transferencia', 'ndjcj, Guayabal', 'prueba de flujo', '[\"Agua\",\"Luz\",\"Gas\",\"Administración\"]', 'hola', 'hola', 'hola', NULL, NULL, NULL, NULL),
(15, 28, 57, 2, 1, '2026-11-11', '2026-12-10', 8451513.00, '54\nkjh', 'active', '2026-04-02 17:01:00', 'Transferencia', 'jdnjeb, Laureles', 'cdjknkjdn', '[\"Luz\",\"Gas\"]', 'jhj', 'jhj', 'j', NULL, NULL, NULL, NULL),
(16, 29, 58, 2, 1, '2026-05-01', '2026-06-01', 5454.00, 'jbj', 'active', '2026-04-02 17:07:30', 'Transferencia', 'knkn, El Poblado', 'edopke', '[\"Agua\"]', 'jbsxj', 'jhj', 'jbjkhb', NULL, NULL, NULL, NULL),
(17, 30, 59, 2, 1, '2026-04-01', '2026-10-01', 45454.00, 'jhj', 'active', '2026-04-02 18:34:32', 'Transferencia', 'iojih, Robledo', 'fklmlkrfm', '[\"Agua\"]', 'hguh', 'j', 'ghjg', NULL, NULL, NULL, NULL),
(18, 33, 67, 2, 6, '2026-11-15', '2026-12-15', 99999999.99, 'ghfgd', 'active', '2026-04-02 22:30:32', 'Transferencia', 'njoj, Laureles', 'gujhgvjh', '[\"Agua\",\"Luz\",\"Gas\",\"Administración\"]', 'fgfgf', 'ghfghf', 'hfghf', NULL, NULL, NULL, NULL),
(19, 33, 67, 2, 6, '2026-02-11', '2026-10-11', 99999999.99, 'jaja\n\n\n    El arrendatario se compromete a cuidar el inmueble.\n    No se permite subarrendar sin autorización.\n    El incumplimiento dará lugar a terminación del contrato.\n    Se debe avisar con 30 días de anticipación para terminar el contrato.\n  ', 'pending', '2026-04-02 23:09:09', 'Transferencia', 'njoj, Laureles', 'gujhgvjh', '[]', 'hsdhfdjs', 'kjbjhv', 'hjvjhv', NULL, NULL, NULL, NULL),
(20, 32, 66, 2, 6, '2026-05-11', '2026-10-11', 45153153.00, 'ssgr\n\n\n    El arrendatario se compromete a cuidar el inmueble.\n    No se permite subarrendar sin autorización.\n    El incumplimiento dará lugar a terminación del contrato.\n    Se debe avisar con 30 días de anticipación para terminar el contrato.\n  ', 'active', '2026-04-02 23:11:00', 'Transferencia', '45, Bello', 'deddd', '[\"Agua\",\"Luz\",\"Gas\"]', 'ewfw', 'wf', 'wr', NULL, NULL, NULL, NULL),
(21, 34, 64, 2, 6, '2026-05-11', '2026-08-11', 4151453.00, 'jujuju\n\n\n    El arrendatario se compromete a cuidar el inmueble.\n    No se permite subarrendar sin autorización.\n    El incumplimiento dará lugar a terminación del contrato.\n    Se debe avisar con 30 días de anticipación para terminar el contrato.\n  ', 'active', '2026-04-02 23:22:13', 'Transferencia', 'IHKUIHK, Laureles', 'hiikki', '[\"Agua\",\"Luz\",\"Gas\",\"Administración\"]', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(22, 34, 64, 2, 6, '2026-11-15', '2026-12-15', 4151453.00, 'ok\n\n\n    El arrendatario se compromete a cuidar el inmueble.\n    No se permite subarrendar sin autorización.\n    El incumplimiento dará lugar a terminación del contrato.\n    Se debe avisar con 30 días de anticipación para terminar el contrato.\n  ', 'pending', '2026-04-03 00:24:11', 'Transferencia', 'IHKUIHK, Laureles', 'hiikki', '[\"Agua\",\"Luz\",\"Gas\",\"Administración\"]', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(23, 35, 68, 2, 6, '2026-05-10', '2026-11-11', 1500000.00, 'ok\n\n\n    El arrendatario se compromete a cuidar el inmueble.\n    No se permite subarrendar sin autorización.\n    El incumplimiento dará lugar a terminación del contrato.\n    Se debe avisar con 30 días de anticipación para terminar el contrato.\n  ', 'active', '2026-04-03 00:28:59', 'Efectivo', 'cra 97 ·64-21 SENA, Bello', 'una prueba para demostrar nuestros talento y hasta donde podemos llegar', '[\"Agua\",\"Luz\",\"Gas\"]', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(24, 37, 70, 2, 1, '2026-10-15', '2026-11-15', 145.00, 'ok ya\n\n\n    El arrendatario se compromete a cuidar el inmueble.\n    No se permite subarrendar sin autorización.\n    El incumplimiento dará lugar a terminación del contrato.\n    Se debe avisar con 30 días de anticipación para terminar el contrato.\n  ', 'active', '2026-04-03 00:58:29', 'Transferencia', 'jkojoknj, Laureles', 'ojkioolni', '[\"Gas\",\"Luz\",\"Agua\",\"Administración\"]', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(25, 37, 70, 2, 1, '2026-10-15', '2026-11-15', 145.00, 'ok ya\n\n\n    CLÁUSULAS\n    1. Uso del inmueble: El inmueble será destinado para vivienda.\n    2. Reparaciones: Las reparaciones por uso normal serán asumidas por el arrendador.\n    3. Terminación: Se debe avisar con 45 días de anticipación para terminar el contrato.\n    4.El arrendatario se compromete a cuidar el inmueble.\n    5.No se permite subarrendar sin autorización.\n    6.El incumplimiento dará lugar a terminación del contrato.\n  ', 'pending', '2026-04-03 01:02:06', 'Transferencia', 'jkojoknj, Laureles', 'ojkioolni', '[\"Gas\",\"Luz\",\"Agua\",\"Administración\"]', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(26, 38, 69, 2, 6, '2026-03-11', '2026-11-11', 0.00, 'ya', 'active', '2026-04-03 12:02:56', 'Transferencia', 'uhg, El Poblado', 'gfged', '[\"Gas\",\"Administración\",\"Luz\"]', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(27, 38, 69, 2, 6, '2026-03-11', '2026-11-11', 0.00, 'ya', 'pending', '2026-04-03 12:03:25', 'Transferencia', 'uhg, El Poblado', 'gfged', '[\"Gas\",\"Administración\",\"Luz\"]', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(28, 38, 69, 2, 6, '2026-03-11', '2026-11-11', NULL, 'ya', 'pending', '2026-04-03 12:15:01', 'Transferencia', 'uhg, El Poblado', 'gfged', '[\"Gas\",\"Administración\",\"Luz\"]', NULL, NULL, NULL, 'maryis', 'lucia', NULL, NULL),
(29, 36, 71, 2, 6, '2026-01-15', '2026-03-15', NULL, 'prueba', 'active', '2026-04-03 12:16:26', 'Transferencia', 'dhdjd, Manrique', 'k', '[\"Luz\"]', NULL, NULL, NULL, 'maryis', 'lucia', NULL, NULL),
(30, 39, 72, 2, 6, '2026-10-15', '2026-12-11', NULL, 'ok', 'active', '2026-04-03 12:31:31', 'Transferencia', 'jbkjb, El Poblado', 'hiuhuigiu', '[\"Agua\",\"Luz\",\"Gas\",\"Administración\"]', NULL, NULL, NULL, 'maryis', 'lucia', NULL, NULL),
(31, 40, 73, 2, 1, '2026-01-11', '2026-05-28', NULL, 'ya', 'active', '2026-04-03 12:39:50', 'Transferencia', 'khjkb, Itagüi', 'jdheheuehqki', '[\"Agua\",\"Luz\",\"Gas\"]', NULL, NULL, NULL, 'maryis', 'brayan pedroza', '1007978998', '1143456241'),
(32, 41, 74, 2, 1, '2026-11-15', '2026-12-15', NULL, 'ok', 'active', '2026-04-03 14:42:19', 'Transferencia', 'khjkhjkh, Laureles', 'iojiohoihi', '[\"Luz\",\"Gas\",\"Administración\"]', NULL, NULL, NULL, 'maryis', 'brayan pedroza', '1007978998', '1143456241'),
(33, 42, 77, 2, 1, '2026-12-11', '2026-12-11', NULL, 'ok', 'pending', '2026-04-03 17:49:24', 'Transferencia', '45455, Laureles', 'dhfihfoivubdfvuol', '[\"Luz\",\"Gas\"]', NULL, NULL, NULL, 'maryis', 'brayan pedroza', '1007978998', '1143456241'),
(34, 41, 74, 2, 1, '2026-12-10', '2026-12-11', NULL, 'ok', 'pending', '2026-04-03 17:50:26', 'Transferencia', 'khjkhjkh, Laureles', 'iojiohoihi', '[]', NULL, NULL, NULL, 'maryis', 'brayan pedroza', '1007978998', '1143456241'),
(35, 39, 72, 2, 6, '2026-10-05', '2026-11-10', NULL, 'g', 'pending', '2026-04-04 16:02:12', 'Transferencia', 'jbkjb, El Poblado', 'hiuhuigiu', '[]', NULL, NULL, NULL, 'maryis', 'lucia', '1007978998', '7894758956'),
(36, 44, 79, 2, 1, '2026-03-15', '2026-10-15', NULL, 'ya', 'active', '2026-04-04 16:27:45', 'Efectivo', 'vbhjvjh, Laureles', 'jhuibuib', '[\"Agua\",\"Gas\",\"Administración\"]', NULL, NULL, NULL, 'maryis', 'brayan pedroza', '1007978998', '1143456241'),
(37, 45, 80, 2, 1, '2026-02-10', '2026-11-10', NULL, 'ok', 'active', '2026-04-04 17:05:40', 'Transferencia', 'njkb, El Poblado', 'bhgjhbjh', '[\"Agua\",\"Gas\",\"Administración\"]', NULL, NULL, NULL, 'maryis', 'brayan pedroza', '1007978998', '1143456241'),
(38, 46, 81, 2, 1, '2026-02-01', '2026-03-03', NULL, 'ok', 'active', '2026-04-04 17:44:55', 'Transferencia', '4454, El Poblado', 'frsgwr', '[\"Gas\",\"Luz\"]', NULL, NULL, NULL, 'maryis', 'brayan pedroza', '1007978998', '1143456241'),
(39, 48, 85, 2, 6, '2026-05-10', '2026-12-10', NULL, 'ok', 'active', '2026-04-05 12:46:52', 'Transferencia', 'ç4ç4, Caldas', 'ljljl', '[\"Agua\",\"Luz\",\"Gas\"]', NULL, NULL, NULL, 'maryis', 'lucia', '1007978998', '7894758956'),
(40, 48, 85, 2, 6, '2026-05-10', '2026-12-10', NULL, 'ok', 'pending', '2026-04-05 12:46:53', 'Transferencia', 'ç4ç4, Caldas', 'ljljl', '[\"Agua\",\"Luz\",\"Gas\"]', NULL, NULL, NULL, 'maryis', 'lucia', '1007978998', '7894758956'),
(41, 48, 85, 2, 6, '2026-05-10', '2026-12-10', NULL, 'ok', 'pending', '2026-04-05 12:46:54', 'Transferencia', 'ç4ç4, Caldas', 'ljljl', '[\"Agua\",\"Luz\",\"Gas\"]', NULL, NULL, NULL, 'maryis', 'lucia', '1007978998', '7894758956'),
(42, 48, 85, 2, 6, '2026-05-10', '2026-12-10', NULL, 'ok', 'pending', '2026-04-05 12:46:54', 'Transferencia', 'ç4ç4, Caldas', 'ljljl', '[\"Agua\",\"Luz\",\"Gas\"]', NULL, NULL, NULL, 'maryis', 'lucia', '1007978998', '7894758956'),
(43, 48, 85, 2, 6, '2026-05-10', '2026-12-10', NULL, 'ok', 'pending', '2026-04-05 12:46:54', 'Transferencia', 'ç4ç4, Caldas', 'ljljl', '[\"Agua\",\"Luz\",\"Gas\"]', NULL, NULL, NULL, 'maryis', 'lucia', '1007978998', '7894758956'),
(44, 48, 85, 2, 6, '2026-05-10', '2026-12-10', NULL, 'ok', 'pending', '2026-04-05 12:46:55', 'Transferencia', 'ç4ç4, Caldas', 'ljljl', '[\"Agua\",\"Luz\",\"Gas\"]', NULL, NULL, NULL, 'maryis', 'lucia', '1007978998', '7894758956'),
(45, 48, 85, 2, 6, '2026-05-10', '2026-12-10', NULL, 'ok', 'pending', '2026-04-05 12:46:56', 'Transferencia', 'ç4ç4, Caldas', 'ljljl', '[\"Agua\",\"Luz\",\"Gas\"]', NULL, NULL, NULL, 'maryis', 'lucia', '1007978998', '7894758956'),
(46, 48, 85, 2, 6, '2026-05-10', '2026-12-10', NULL, 'ok', 'pending', '2026-04-05 12:46:56', 'Transferencia', 'ç4ç4, Caldas', 'ljljl', '[\"Agua\",\"Luz\",\"Gas\"]', NULL, NULL, NULL, 'maryis', 'lucia', '1007978998', '7894758956'),
(47, 48, 85, 2, 6, '2026-05-10', '2026-12-10', NULL, 'ok', 'pending', '2026-04-05 12:46:56', 'Transferencia', 'ç4ç4, Caldas', 'ljljl', '[\"Agua\",\"Luz\",\"Gas\"]', NULL, NULL, NULL, 'maryis', 'lucia', '1007978998', '7894758956'),
(48, 48, 85, 2, 6, '2026-05-10', '2026-12-10', NULL, 'ok', 'pending', '2026-04-05 12:47:00', 'Transferencia', 'ç4ç4, Caldas', 'ljljl', '[\"Agua\",\"Luz\",\"Gas\"]', NULL, NULL, NULL, 'maryis', 'lucia', '1007978998', '7894758956'),
(49, 48, 85, 2, 6, '2026-05-10', '2026-12-10', NULL, 'ok', 'pending', '2026-04-05 12:47:00', 'Transferencia', 'ç4ç4, Caldas', 'ljljl', '[\"Agua\",\"Luz\",\"Gas\"]', NULL, NULL, NULL, 'maryis', 'lucia', '1007978998', '7894758956'),
(50, 48, 85, 2, 6, '2026-05-10', '2026-12-10', NULL, 'ok', 'pending', '2026-04-05 12:47:01', 'Transferencia', 'ç4ç4, Caldas', 'ljljl', '[\"Agua\",\"Luz\",\"Gas\"]', NULL, NULL, NULL, 'maryis', 'lucia', '1007978998', '7894758956'),
(51, 48, 85, 2, 6, '2026-05-10', '2026-12-10', NULL, 'ok', 'pending', '2026-04-05 12:47:01', 'Transferencia', 'ç4ç4, Caldas', 'ljljl', '[\"Agua\",\"Luz\",\"Gas\"]', NULL, NULL, NULL, 'maryis', 'lucia', '1007978998', '7894758956'),
(52, 48, 85, 2, 6, '2026-05-10', '2026-12-10', NULL, 'ok', 'pending', '2026-04-05 12:51:32', 'Transferencia', 'ç4ç4, Caldas', 'ljljl', '[\"Agua\",\"Luz\",\"Gas\"]', NULL, NULL, NULL, 'maryis', 'lucia', '1007978998', '7894758956'),
(53, 48, 85, 2, 6, '2026-05-10', '2026-12-10', NULL, 'ok', 'pending', '2026-04-05 12:51:34', 'Transferencia', 'ç4ç4, Caldas', 'ljljl', '[\"Agua\",\"Luz\",\"Gas\"]', NULL, NULL, NULL, 'maryis', 'lucia', '1007978998', '7894758956'),
(54, 48, 85, 2, 6, '2026-05-10', '2026-12-10', NULL, 'ok', 'pending', '2026-04-05 12:52:49', 'Transferencia', 'ç4ç4, Caldas', 'ljljl', '[\"Agua\",\"Luz\",\"Gas\"]', NULL, NULL, NULL, 'maryis', 'lucia', '1007978998', '7894758956'),
(55, 48, 85, 2, 6, '2026-05-10', '2026-12-10', NULL, 'ok', 'pending', '2026-04-05 12:52:51', 'Transferencia', 'ç4ç4, Caldas', 'ljljl', '[\"Agua\",\"Luz\",\"Gas\"]', NULL, NULL, NULL, 'maryis', 'lucia', '1007978998', '7894758956'),
(56, 48, 85, 2, 6, '2026-05-10', '2026-12-10', NULL, 'ok', 'pending', '2026-04-05 12:54:28', 'Transferencia', 'ç4ç4, Caldas', 'ljljl', '[\"Agua\",\"Luz\",\"Gas\"]', NULL, NULL, NULL, 'maryis', 'lucia', '1007978998', '7894758956');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `documents`
--

CREATE TABLE `documents` (
  `id` bigint(20) NOT NULL,
  `contract_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) NOT NULL,
  `type` varchar(100) DEFAULT NULL,
  `url` varchar(500) DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `documents`
--

INSERT INTO `documents` (`id`, `contract_id`, `user_id`, `type`, `url`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 1, 'contract', 'http://localhost:4000/uploads/contracts/contract_1.pdf', '', '2026-03-27 01:56:50', '2026-03-27 01:56:50', NULL),
(2, 1, 1, 'contract', 'http://localhost:4000/uploads/contracts/contract_1.pdf', '', '2026-03-27 02:52:49', '2026-03-27 02:52:49', NULL),
(3, 4, 1, 'contract', 'http://localhost:4000/uploads/contracts/contract_4.pdf', '', '2026-03-27 12:24:49', '2026-03-27 12:24:49', NULL),
(4, 4, 1, 'contract', 'http://localhost:4000/uploads/contracts/contract_4.pdf', '', '2026-03-27 12:40:53', '2026-03-27 12:40:53', NULL),
(5, 4, 1, 'contract', 'http://localhost:4000/uploads/contracts/contract_4.pdf', '', '2026-03-27 12:50:29', '2026-03-27 12:50:29', NULL),
(6, 4, 1, 'contract', 'http://localhost:4000/uploads/contracts/contract_4.pdf', '', '2026-03-27 13:47:11', '2026-03-27 13:47:11', NULL),
(7, 4, 1, 'contract', 'http://localhost:4000/uploads/contracts/contract_4.pdf', '', '2026-03-27 14:21:52', '2026-03-27 14:21:52', NULL),
(8, 4, 1, 'contract', 'http://localhost:4000/uploads/contracts/contract_4.pdf', '', '2026-03-27 14:22:05', '2026-03-27 14:22:05', NULL),
(9, 4, 1, 'contract', 'http://localhost:4000/uploads/contracts/contract_4.pdf', '', '2026-03-27 14:36:15', '2026-03-27 14:36:15', NULL),
(10, 4, 1, 'contract', 'http://localhost:4000/uploads/contracts/contract_4.pdf', '', '2026-03-29 22:52:34', '2026-03-29 22:52:34', NULL),
(11, 9, 1, 'contract', 'http://localhost:4000/uploads/contracts/contract_9.pdf', '', '2026-03-30 00:12:41', '2026-03-30 00:12:41', NULL),
(12, 10, 1, 'contract', 'http://localhost:4000/uploads/contracts/contract_10.pdf', '', '2026-03-31 19:01:55', '2026-03-31 19:01:55', NULL),
(13, 10, 1, 'contract', 'http://localhost:4000/uploads/contracts/contract_10.pdf', '', '2026-03-31 19:11:46', '2026-03-31 19:11:46', NULL),
(14, 10, 1, 'contract', 'http://localhost:4000/uploads/contracts/contract_10.pdf', '', '2026-03-31 19:37:12', '2026-03-31 19:37:12', NULL),
(15, 11, 1, 'contract', 'http://localhost:4000/uploads/contracts/contract_11.pdf', '', '2026-03-31 19:52:45', '2026-03-31 19:52:45', NULL),
(16, 12, 1, 'contract', 'http://localhost:4000/uploads/contracts/contract_12.pdf', '', '2026-03-31 23:10:16', '2026-03-31 23:10:16', NULL),
(17, 12, 1, 'contract', 'http://localhost:4000/uploads/contracts/contract_12.pdf', '', '2026-03-31 23:31:02', '2026-03-31 23:31:02', NULL),
(18, 13, 1, 'contract', 'http://localhost:4000/uploads/contracts/contract_13.pdf', '', '2026-03-31 23:57:51', '2026-03-31 23:57:51', NULL),
(19, 13, 1, 'contract', 'http://localhost:4000/uploads/contracts/contract_13.pdf', '', '2026-03-31 23:58:05', '2026-03-31 23:58:05', NULL),
(20, 14, 1, 'contract', 'http://localhost:4000/uploads/contracts/contract_14.pdf', '', '2026-04-02 16:37:03', '2026-04-02 16:37:03', NULL),
(21, 15, 1, 'contract', 'http://localhost:4000/uploads/contracts/contract_15.pdf', '', '2026-04-02 17:01:25', '2026-04-02 17:01:25', NULL),
(22, 16, 1, 'contract', 'http://localhost:4000/uploads/contracts/contract_16.pdf', '', '2026-04-02 17:07:38', '2026-04-02 17:07:38', NULL),
(23, 17, 1, 'contract', 'http://localhost:4000/uploads/contracts/contract_17.pdf', '', '2026-04-02 18:35:01', '2026-04-02 18:35:01', NULL),
(24, 18, 6, 'contract', 'http://localhost:4000/uploads/contracts/contract_18.pdf', '', '2026-04-02 22:30:44', '2026-04-02 22:30:44', NULL),
(25, 18, 6, 'contract', 'http://localhost:4000/uploads/contracts/contract_18.pdf', '', '2026-04-02 22:32:40', '2026-04-02 22:32:40', NULL),
(26, 18, 6, 'contract', 'http://localhost:4000/uploads/contracts/contract_18.pdf', '', '2026-04-02 23:09:35', '2026-04-02 23:09:35', NULL),
(27, 20, 6, 'contract', 'http://localhost:4000/uploads/contracts/contract_20.pdf', '', '2026-04-02 23:11:17', '2026-04-02 23:11:17', NULL),
(28, 21, 6, 'contract', 'http://localhost:4000/uploads/contracts/contract_21.pdf', '', '2026-04-02 23:22:22', '2026-04-02 23:22:22', NULL),
(29, 21, 6, 'contract', 'http://localhost:4000/uploads/contracts/contract_21.pdf', '', '2026-04-02 23:23:49', '2026-04-02 23:23:49', NULL),
(30, 23, 6, 'contract', 'http://localhost:4000/uploads/contracts/contract_23.pdf', '', '2026-04-03 00:29:15', '2026-04-03 00:29:15', NULL),
(31, 23, 6, 'contract', 'http://localhost:4000/uploads/contracts/contract_23.pdf', '', '2026-04-03 00:54:44', '2026-04-03 00:54:44', NULL),
(32, 24, 1, 'contract', 'http://localhost:4000/uploads/contracts/contract_24.pdf', '', '2026-04-03 00:58:40', '2026-04-03 00:58:40', NULL),
(33, 24, 1, 'contract', 'http://localhost:4000/uploads/contracts/contract_24.pdf', '', '2026-04-03 01:03:34', '2026-04-03 01:03:34', NULL),
(34, 24, 1, 'contract', 'http://localhost:4000/uploads/contracts/contract_24.pdf', '', '2026-04-03 04:08:45', '2026-04-03 04:08:45', NULL),
(35, 26, 6, 'contract', 'http://localhost:4000/uploads/contracts/contract_26.pdf', '', '2026-04-03 12:03:39', '2026-04-03 12:03:39', NULL),
(36, 29, 6, 'contract', 'http://localhost:4000/uploads/contracts/contract_29.pdf', '', '2026-04-03 12:16:48', '2026-04-03 12:16:48', NULL),
(37, 30, 6, 'contract', 'http://localhost:4000/uploads/contracts/contract_30.pdf', '', '2026-04-03 12:31:43', '2026-04-03 12:31:43', NULL),
(38, 31, 1, 'contract', 'http://localhost:4000/uploads/contracts/contract_31.pdf', '', '2026-04-03 12:40:16', '2026-04-03 12:40:16', NULL),
(39, 32, 1, 'contract', 'http://localhost:4000/uploads/contracts/contract_32.pdf', '', '2026-04-03 14:50:25', '2026-04-03 14:50:25', NULL),
(40, 32, 2, 'contract', 'http://localhost:4000/uploads/contracts/contract_32.pdf', '', '2026-04-03 14:50:25', '2026-04-03 14:50:25', NULL),
(41, 32, 1, 'contract', 'http://localhost:4000/uploads/contracts/contract_32.pdf', '', '2026-04-03 17:50:30', '2026-04-03 17:50:30', NULL),
(42, 32, 2, 'contract', 'http://localhost:4000/uploads/contracts/contract_32.pdf', '', '2026-04-03 17:50:30', '2026-04-03 17:50:30', NULL),
(43, 36, 1, 'contract', 'http://localhost:4000/uploads/contracts/contract_36.pdf', '', '2026-04-04 16:27:59', '2026-04-04 16:27:59', NULL),
(44, 36, 2, 'contract', 'http://localhost:4000/uploads/contracts/contract_36.pdf', '', '2026-04-04 16:27:59', '2026-04-04 16:27:59', NULL),
(45, 14, 1, 'contract', 'http://localhost:4000/uploads/contracts/contract_14.pdf', '', '2026-04-04 16:43:54', '2026-04-04 16:43:54', NULL),
(46, 14, 2, 'contract', 'http://localhost:4000/uploads/contracts/contract_14.pdf', '', '2026-04-04 16:43:54', '2026-04-04 16:43:54', NULL),
(47, 37, 1, 'contract', 'http://localhost:4000/uploads/contracts/contract_37.pdf', '', '2026-04-04 17:05:55', '2026-04-04 17:05:55', NULL),
(48, 37, 2, 'contract', 'http://localhost:4000/uploads/contracts/contract_37.pdf', '', '2026-04-04 17:05:55', '2026-04-04 17:05:55', NULL),
(49, 37, 1, 'contract', 'http://localhost:4000/uploads/contracts/contract_37.pdf', '', '2026-04-04 17:06:04', '2026-04-04 17:06:04', NULL),
(50, 37, 2, 'contract', 'http://localhost:4000/uploads/contracts/contract_37.pdf', '', '2026-04-04 17:06:04', '2026-04-04 17:06:04', NULL),
(51, 38, 1, 'contract', 'http://localhost:4000/uploads/contracts/contract_38.pdf', '', '2026-04-04 17:45:20', '2026-04-04 17:45:20', NULL),
(52, 38, 2, 'contract', 'http://localhost:4000/uploads/contracts/contract_38.pdf', '', '2026-04-04 17:45:20', '2026-04-04 17:45:20', NULL),
(53, 38, 1, 'contract', 'http://localhost:4000/uploads/contracts/contract_38.pdf', '', '2026-04-04 17:46:22', '2026-04-04 17:46:22', NULL),
(54, 38, 2, 'contract', 'http://localhost:4000/uploads/contracts/contract_38.pdf', '', '2026-04-04 17:46:22', '2026-04-04 17:46:22', NULL),
(55, 14, 1, 'contract', 'http://localhost:4000/uploads/contracts/contract_14.pdf', '', '2026-04-04 19:03:13', '2026-04-04 19:03:13', NULL),
(56, 14, 2, 'contract', 'http://localhost:4000/uploads/contracts/contract_14.pdf', '', '2026-04-04 19:03:13', '2026-04-04 19:03:13', NULL),
(57, 39, 6, 'contract', 'http://localhost:4000/uploads/contracts/contract_39.pdf', '', '2026-04-05 12:54:46', '2026-04-05 12:54:46', NULL),
(58, 39, 2, 'contract', 'http://localhost:4000/uploads/contracts/contract_39.pdf', '', '2026-04-05 12:54:46', '2026-04-05 12:54:46', NULL),
(59, 39, 6, 'contract', 'http://localhost:4000/uploads/contracts/contract_39.pdf', '', '2026-04-05 12:56:51', '2026-04-05 12:56:51', NULL),
(60, 39, 2, 'contract', 'http://localhost:4000/uploads/contracts/contract_39.pdf', '', '2026-04-05 12:56:51', '2026-04-05 12:56:51', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `messages`
--

CREATE TABLE `messages` (
  `id` bigint(20) NOT NULL,
  `chat_id` bigint(20) NOT NULL,
  `sender_id` bigint(20) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `messages`
--

INSERT INTO `messages` (`id`, `chat_id`, `sender_id`, `message`, `created_at`) VALUES
(243, 27, 1, 'hola', '2026-04-02 16:34:12'),
(244, 27, 1, 'que tal cuentame que mas ', '2026-04-02 16:34:30'),
(245, 27, 2, 'vas a rrendar', '2026-04-02 16:34:43'),
(246, 27, 1, 'si claro', '2026-04-02 16:34:50'),
(247, 28, 2, 'hola', '2026-04-02 16:59:46'),
(248, 28, 1, 'estas ahi', '2026-04-02 16:59:54'),
(254, 28, 2, 'jj', '2026-04-02 17:49:43'),
(255, 28, 2, 'hola', '2026-04-02 17:59:26'),
(256, 28, 2, 'hola', '2026-04-02 18:01:11'),
(258, 28, 1, 'que paso', '2026-04-02 18:04:18'),
(259, 30, 2, 'hola', '2026-04-02 18:33:33'),
(260, 30, 1, 'que quieres', '2026-04-02 18:33:43'),
(261, 30, 2, 'jum', '2026-04-02 18:33:52'),
(267, 32, 2, 'hola lucia', '2026-04-02 21:46:47'),
(268, 32, 6, 'como vas', '2026-04-02 21:46:57'),
(269, 32, 6, 'hola', '2026-04-02 21:49:27'),
(272, 32, 6, 'jajaja', '2026-04-02 23:10:11'),
(274, 35, 2, 'hola lucia otra prueba', '2026-04-03 00:27:16'),
(275, 35, 2, 'si', '2026-04-03 00:28:06'),
(282, 38, 2, 'este es el contrato', '2026-04-03 11:59:31'),
(375, 44, 2, 'otra prueba para comporbar que si sirve', '2026-04-04 16:26:42'),
(376, 44, 1, 'si sirve', '2026-04-04 16:27:01'),
(377, 44, 2, 'Dios gracias', '2026-04-04 16:27:07'),
(378, 44, 1, 'cierto', '2026-04-04 16:43:02'),
(379, 30, 1, 'hola', '2026-04-04 16:43:08'),
(380, 30, 1, 'cierto que si', '2026-04-04 16:44:34'),
(381, 30, 2, 'si claro que si', '2026-04-04 16:44:46'),
(382, 30, 1, 'bueno', '2026-04-04 16:59:07'),
(383, 30, 2, 'se ve cierto', '2026-04-04 17:01:51'),
(384, 30, 2, 'oye eres tu', '2026-04-04 17:02:06'),
(385, 30, 1, 'si soy yo', '2026-04-04 17:02:14'),
(386, 45, 2, 'hola inquilino', '2026-04-04 17:04:26'),
(387, 45, 1, 'no me sdale l chat ', '2026-04-04 17:04:37'),
(388, 45, 2, 'hola', '2026-04-04 17:04:49'),
(389, 45, 1, 'ya se quien etes', '2026-04-04 17:04:57'),
(390, 46, 2, 'otra prueba mas jajaj', '2026-04-04 17:43:39'),
(391, 46, 1, 'ok', '2026-04-04 17:44:05'),
(392, 47, 2, 'hola otra prueba', '2026-04-04 19:40:24'),
(393, 47, 1, 'hay Dios', '2026-04-04 19:40:33'),
(394, 47, 2, 'bueno', '2026-04-04 19:40:49'),
(395, 47, 1, 'por wu se daña', '2026-04-04 19:40:57'),
(396, 47, 1, 'se daña', '2026-04-04 19:48:19'),
(397, 47, 1, 'hola', '2026-04-04 19:48:27'),
(398, 47, 6, 'hola', '2026-04-04 20:14:25'),
(399, 47, 6, 'estas bien', '2026-04-04 20:14:29'),
(400, 38, 6, 'super', '2026-04-04 20:14:39'),
(401, 38, 6, 'super', '2026-04-05 12:41:04'),
(402, 38, 2, 'ok', '2026-04-05 12:41:09'),
(403, 48, 2, 'hola', '2026-04-05 12:46:11'),
(404, 48, 6, 'nuvamnet', '2026-04-05 12:46:21');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `properties`
--

CREATE TABLE `properties` (
  `id` bigint(20) NOT NULL,
  `owner_id` bigint(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `price` decimal(12,2) NOT NULL,
  `status` enum('available','rented') DEFAULT 'available',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `rooms` int(11) DEFAULT NULL,
  `bathrooms` int(11) DEFAULT NULL,
  `tags` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `properties`
--

INSERT INTO `properties` (`id`, `owner_id`, `title`, `description`, `address`, `price`, `status`, `created_at`, `updated_at`, `deleted_at`, `thumbnail`, `type`, `rooms`, `bathrooms`, `tags`) VALUES
(1, 2, 'Apartamento Centro', 'Apartamento amplio 2 habitaciones', 'Centro Medellin', 1200000.00, 'rented', '2026-02-16 03:04:23', '2026-02-16 03:16:17', NULL, NULL, NULL, NULL, NULL, NULL),
(55, 2, 'prueba de flujo', 'prueba de flujo', 'ndjcj, Guayabal', 850000.00, 'rented', '2026-04-02 16:33:23', '2026-04-02 16:37:03', NULL, 'uploads/1775147603437-1765653695728_apto1.jpeg', 'Apartamento', 1, 1, '[\"Parqueadero\",\"Acepto Mascotas\",\"Balcón\"]'),
(57, 2, 'prueba de errores', 'cdjknkjdn', 'jdnjeb, Laureles', 8451513.00, 'rented', '2026-04-02 16:59:04', '2026-04-02 17:01:25', NULL, 'uploads/1775149144039-1765737895433_fabri3.png', 'Apartamento', 1, 1, '[\"Ascensor\",\"Red de gas\"]'),
(59, 2, 'prueba de mi rama', 'fklmlkrfm', 'iojih, Robledo', 45454.00, 'rented', '2026-04-02 18:32:41', '2026-04-02 18:35:01', NULL, NULL, 'Apartamento', 1, 1, '[\"Balcón\",\"Ascensor\"]'),
(66, 2, 'chat con lucia', 'deddd', '45, Bello', 45153153.00, 'rented', '2026-04-02 21:45:33', '2026-04-02 23:11:17', NULL, 'uploads/1775166333856-1765653695732_apto2.jpeg', 'Apartamento', 1, 1, '[]'),
(68, 2, 'prueba para auditoria', 'una prueba para demostrar nuestros talento y hasta donde podemos llegar', 'cra 97 ·64-21 SENA, Bello', 1500000.00, 'rented', '2026-04-03 00:26:29', '2026-04-03 00:29:15', NULL, 'uploads/1775175989679-image_1.jpg', 'Oficina', 1, 1, '[]'),
(69, 2, 'tjyf', 'gfged', 'uhg, El Poblado', 0.00, 'rented', '2026-04-03 00:41:26', '2026-04-03 12:03:39', NULL, NULL, 'Apartamento', 1, 1, '[]'),
(79, 2, 'hola HJVHJVHJ', 'jhuibuib', 'vbhjvjh, Laureles', 88415.00, 'rented', '2026-04-04 16:26:07', '2026-04-04 16:27:59', NULL, 'uploads/1775319967697-Gorila gangster esti.png', 'Apartamento', 1, 1, '[]'),
(80, 2, 'prueba', 'bhgjhbjh', 'njkb, El Poblado', 5152.00, 'rented', '2026-04-04 17:03:32', '2026-04-04 17:05:55', NULL, NULL, 'Apartamento', 1, 1, '[]'),
(81, 2, 'uhusgau', 'frsgwr', '4454, El Poblado', 514535.00, 'rented', '2026-04-04 17:43:01', '2026-04-04 17:45:19', NULL, 'uploads/1775324581682-image_1.jpg', 'Apartamento', 1, 1, '[]'),
(82, 2, 'pruba d fetch', 'dhiudgbi', 'pkomlññ, Laureles', 13546.00, 'available', '2026-04-04 19:39:17', '2026-04-04 19:39:17', NULL, NULL, 'Apartamento', 1, 1, '[]'),
(84, 2, 'daocjiodjio', 'kdzjckns', 'mklnlk, La America', 445.00, 'available', '2026-04-05 12:32:57', '2026-04-05 12:32:57', NULL, NULL, 'Apartamento', 1, 1, '[]'),
(85, 2, 'foto', 'ljljl', 'ç4ç4, Caldas', 451.00, 'rented', '2026-04-05 12:33:20', '2026-04-05 12:54:46', NULL, 'uploads/1775392399991-image_1.jpg', 'Apartamento', 1, 1, '[]'),
(86, 2, 'pruba de gratis', 'ojoiji', '5465, La America', 545143.00, 'available', '2026-04-05 17:07:45', '2026-04-05 17:07:45', NULL, 'uploads/1775408865739-image_1.jpg', 'Apartamento', 1, 1, '[]'),
(87, 2, 'prueba paypal', 'jhihuui', '4545, Popular', 48484648.00, 'available', '2026-04-05 17:56:52', '2026-04-05 17:56:52', NULL, 'uploads/1775411812862-Canguro gangster con.png', 'Apartamento', 1, 1, '[]'),
(88, 2, 'prueba pàypal', 'ojoijhoi', '5465464, La America', 51615.00, 'available', '2026-04-05 18:10:16', '2026-04-05 18:10:16', NULL, 'uploads/1775412616175-Canguro gangster con.png', 'Apartamento', 1, 1, '[]'),
(89, 2, 'ihadihfis', 'jhhioh', '616115, La Candelaria (Centro)', 5.00, 'available', '2026-04-05 18:18:45', '2026-04-05 18:18:45', NULL, 'uploads/1775413125451-Gorila gangster esti.png', 'Apartamento', 1, 1, '[]'),
(90, 2, 'sldkmdapm', 'lksmcsklsc', '541651465, La America', 515313513.00, 'available', '2026-04-05 18:19:33', '2026-04-05 18:19:33', NULL, NULL, 'Apartamento', 1, 1, '[]'),
(91, 2, 'ihdsiuhsdui', 'scohshs', 'knkjnbk, El Poblado', 5455.00, 'available', '2026-04-05 18:25:43', '2026-04-05 18:25:43', NULL, NULL, 'Apartamento', 1, 1, '[]'),
(92, 2, 'cdbjhbajk', 'xjsbhjsb', 'kjbkjbkj, La America', 5151451435.00, 'available', '2026-04-05 18:26:30', '2026-04-05 18:26:30', NULL, NULL, 'Apartamento', 1, 1, '[]');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `property_images`
--

CREATE TABLE `property_images` (
  `id` bigint(20) NOT NULL,
  `property_id` bigint(20) NOT NULL,
  `url` varchar(500) NOT NULL,
  `ord` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `property_images`
--

INSERT INTO `property_images` (`id`, `property_id`, `url`, `ord`) VALUES
(35, 55, 'uploads/1775147603437-1765653695728_apto1.jpeg', 1),
(37, 57, 'uploads/1775149144039-1765737895433_fabri3.png', 1),
(43, 66, 'uploads/1775166333856-1765653695732_apto2.jpeg', 1),
(45, 68, 'uploads/1775175989679-image_1.jpg', 1),
(46, 79, 'uploads/1775319967697-Gorila gangster esti.png', 1),
(47, 81, 'uploads/1775324581682-image_1.jpg', 1),
(48, 85, 'uploads/1775392399991-image_1.jpg', 1),
(49, 86, 'uploads/1775408865739-image_1.jpg', 1),
(50, 87, 'uploads/1775411812862-Canguro gangster con.png', 1),
(51, 87, 'uploads/1775411812893-Gorila gangster esti.png', 2),
(52, 87, 'uploads/1775411812925-image_1.jpg', 3),
(53, 88, 'uploads/1775412616175-Canguro gangster con.png', 1),
(54, 88, 'uploads/1775412616199-Gorila gangster esti.png', 2),
(55, 88, 'uploads/1775412616212-image_1.jpg', 3),
(56, 89, 'uploads/1775413125451-Gorila gangster esti.png', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rental_records`
--

CREATE TABLE `rental_records` (
  `id` bigint(20) NOT NULL,
  `application_id` bigint(20) NOT NULL,
  `property_id` bigint(20) NOT NULL,
  `owner_id` bigint(20) NOT NULL,
  `tenant_id` bigint(20) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `monthly_price` decimal(10,2) NOT NULL,
  `deposit` decimal(10,2) DEFAULT 0.00,
  `duration_months` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rental_records`
--

INSERT INTO `rental_records` (`id`, `application_id`, `property_id`, `owner_id`, `tenant_id`, `start_date`, `end_date`, `monthly_price`, `deposit`, `duration_months`, `created_at`) VALUES
(1, 1, 1, 2, 1, '2026-03-01', '2027-03-01', 1200000.00, 1200000.00, 12, '2026-02-27 12:38:36');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reviews`
--

CREATE TABLE `reviews` (
  `id` bigint(20) NOT NULL,
  `reviewer_id` bigint(20) NOT NULL,
  `reviewed_id` bigint(20) NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `reviews`
--

INSERT INTO `reviews` (`id`, `reviewer_id`, `reviewed_id`, `rating`, `comment`, `created_at`) VALUES
(2, 2, 6, 5, 'buen inquilina', '2026-04-05 13:00:12');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `role` enum('owner','tenant','admin') NOT NULL,
  `email` varchar(255) NOT NULL,
  `cedula` varchar(20) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `is_verified` tinyint(1) DEFAULT 0,
  `verification_code` varchar(10) DEFAULT NULL,
  `verification_expires` datetime DEFAULT NULL,
  `reset_code` varchar(10) DEFAULT NULL,
  `reset_expires` datetime DEFAULT NULL,
  `name` varchar(200) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `score` int(11) DEFAULT 500,
  `status` enum('active','suspended','blocked') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  `plan` enum('free','premium') DEFAULT 'free',
  `free_publications_used` int(11) DEFAULT 0,
  `avatar` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `role`, `email`, `cedula`, `password_hash`, `is_verified`, `verification_code`, `verification_expires`, `reset_code`, `reset_expires`, `name`, `phone`, `score`, `status`, `created_at`, `updated_at`, `deleted_at`, `plan`, `free_publications_used`, `avatar`, `description`, `last_name`) VALUES
(1, 'owner', 'brayanpedroza_1999@hotmail.com', '1143456241', '$2b$10$qNhJ5Zxo23HzL2.F3DCt0eFNaAm3BHjbCIkBWYioRy5H8VWUc18qe', 1, NULL, NULL, NULL, NULL, 'brayan pedroza', '3004874725', 500, 'active', '2026-02-16 02:50:30', '2026-04-05 11:58:22', NULL, 'free', 0, NULL, NULL, NULL),
(2, 'owner', 'marjhoperozo@hotmail.es', '1007978998', '$2b$10$/iZ6zz/3iiX7hTyfyhJ.B..Rc9MNJzmafnjUFCafEP9WhZSgsbVz.', 1, NULL, NULL, '389541', '2026-03-31 12:54:19', 'maryis', NULL, 500, 'active', '2026-02-16 02:55:36', '2026-04-02 21:48:31', NULL, 'free', 1, 'https://res.cloudinary.com/dcuwpov4o/image/upload/v1775166508/rentdirect/avatars/bs3bpjt7rr0vhdgijko4.png', NULL, NULL),
(5, 'tenant', 'evelyn.alvarezg7@gmail.com', '12345678', '$2b$10$wGfGQkhraGdA4e8s6FRluO4FEsiqhC9VEZTP5fy5e.XQNM0dImNvK', 1, NULL, NULL, NULL, NULL, 'yuliana', NULL, 500, 'active', '2026-02-20 13:03:53', '2026-03-31 16:56:51', NULL, 'free', 0, NULL, NULL, NULL),
(6, 'tenant', 'maryisperozo3@gmail.com', '7894758956', '$2b$10$nJ/XCfmMpAncGtqsCJW30efYQuYiyB9aJ3iajtTbWi./Ki2q6yRE2', 1, NULL, NULL, NULL, NULL, 'lucia', NULL, 520, 'active', '2026-02-27 15:15:06', '2026-04-05 13:00:12', NULL, 'free', 0, 'https://res.cloudinary.com/dcuwpov4o/image/upload/v1775166550/rentdirect/avatars/bo8rrvmovty8xgkobhah.png', NULL, NULL),
(13, 'admin', 'markusbrown660@gmail.com', '123569852', '$2b$10$oIoNlcPRj9OGEL3.jrf3mOhJBIqyqlvnXe.0TQCQxG2OPfgeNi9di', 1, NULL, NULL, NULL, NULL, 'brayan pedroza', NULL, 500, 'active', '2026-04-04 20:28:11', '2026-04-04 20:29:05', NULL, 'free', 0, NULL, NULL, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `applications`
--
ALTER TABLE `applications`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `property_id` (`property_id`,`tenant_id`),
  ADD KEY `tenant_id` (`tenant_id`);

--
-- Indices de la tabla `chats`
--
ALTER TABLE `chats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `property_id` (`property_id`),
  ADD KEY `owner_id` (`owner_id`),
  ADD KEY `tenant_id` (`tenant_id`);

--
-- Indices de la tabla `contracts`
--
ALTER TABLE `contracts`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chat_id` (`chat_id`),
  ADD KEY `sender_id` (`sender_id`);

--
-- Indices de la tabla `properties`
--
ALTER TABLE `properties`
  ADD PRIMARY KEY (`id`),
  ADD KEY `owner_id` (`owner_id`);

--
-- Indices de la tabla `property_images`
--
ALTER TABLE `property_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `property_id` (`property_id`);

--
-- Indices de la tabla `rental_records`
--
ALTER TABLE `rental_records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_rr_application` (`application_id`),
  ADD KEY `fk_rr_property` (`property_id`),
  ADD KEY `fk_rr_owner` (`owner_id`),
  ADD KEY `fk_rr_tenant` (`tenant_id`);

--
-- Indices de la tabla `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reviewer_id` (`reviewer_id`),
  ADD KEY `reviewed_id` (`reviewed_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `cedula` (`cedula`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `applications`
--
ALTER TABLE `applications`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT de la tabla `chats`
--
ALTER TABLE `chats`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT de la tabla `contracts`
--
ALTER TABLE `contracts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT de la tabla `documents`
--
ALTER TABLE `documents`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT de la tabla `messages`
--
ALTER TABLE `messages`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=405;

--
-- AUTO_INCREMENT de la tabla `properties`
--
ALTER TABLE `properties`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=93;

--
-- AUTO_INCREMENT de la tabla `property_images`
--
ALTER TABLE `property_images`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT de la tabla `rental_records`
--
ALTER TABLE `rental_records`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `applications`
--
ALTER TABLE `applications`
  ADD CONSTRAINT `applications_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `applications_ibfk_2` FOREIGN KEY (`tenant_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `chats`
--
ALTER TABLE `chats`
  ADD CONSTRAINT `chats_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chats_ibfk_2` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `chats_ibfk_3` FOREIGN KEY (`tenant_id`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `documents`
--
ALTER TABLE `documents`
  ADD CONSTRAINT `documents_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`chat_id`) REFERENCES `chats` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `properties`
--
ALTER TABLE `properties`
  ADD CONSTRAINT `properties_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `property_images`
--
ALTER TABLE `property_images`
  ADD CONSTRAINT `property_images_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `rental_records`
--
ALTER TABLE `rental_records`
  ADD CONSTRAINT `fk_rr_application` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`),
  ADD CONSTRAINT `fk_rr_owner` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `fk_rr_property` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`),
  ADD CONSTRAINT `fk_rr_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`reviewer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`reviewed_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
