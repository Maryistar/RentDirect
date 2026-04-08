-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 08-04-2026 a las 16:03:34
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
  `utilities` longtext DEFAULT NULL,
  `use_clause` text DEFAULT NULL,
  `repairs_clause` text DEFAULT NULL,
  `termination_clause` text DEFAULT NULL,
  `owner_name` varchar(255) DEFAULT NULL,
  `tenant_name` varchar(255) DEFAULT NULL,
  `owner_document` varchar(50) DEFAULT NULL,
  `tenant_document` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `documents`
--

CREATE TABLE `documents` (
  `id` bigint(20) NOT NULL,
  `contract_id` int(11) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `type` varchar(100) DEFAULT NULL,
  `url` varchar(500) DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `invoices`
--

CREATE TABLE `invoices` (
  `id` int(11) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `property_data` longtext NOT NULL,
  `status` varchar(20) DEFAULT 'pending',
  `paypal_order_id` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `total` decimal(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `tags` text DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `properties`
--

INSERT INTO `properties` (`id`, `owner_id`, `title`, `description`, `address`, `price`, `status`, `created_at`, `updated_at`, `deleted_at`, `thumbnail`, `type`, `rooms`, `bathrooms`, `tags`, `expires_at`) VALUES
(48, 2, 'Apartamento moderno en zona céntrica con excelente vista', 'Hermoso apartamento ubicado en zona céntrica, cuenta con 2 habitaciones, 2 baños, sala-comedor amplia, cocina integral y balcón con vista panorámica. Cerca de transporte público, supermercados y zonas comerciales. Ideal para familias o profesionales', 'Calle 45 #12-34, La Candelaria (Centro)', 950000.00, 'available', '2026-04-08 13:41:45', '2026-04-08 13:41:45', NULL, 'uploads/1775655705586-1765739493513_lau4.jpg', 'Apartamento', 1, 1, '[]', NULL),
(49, 2, 'Apartamento moderno en zona céntrica con excelente vista', 'Hermoso apartamento ubicado en el centro de Medellín, cuenta con 2 habitaciones, 2 baños, sala-comedor amplia, cocina integral y balcón con vista panorámica. Cerca de estaciones de metro, supermercados y zonas comerciales. Ideal para familias o profesionales.', 'Calle 50 #45-30,  La Candelaria (Centro)', 850000.00, 'available', '2026-04-08 13:43:56', '2026-04-08 13:57:05', NULL, 'uploads/1775655836622-1774975389166-1765726790020_lof3.jpg', 'Apartaestudio', 3, 1, '[]', NULL),
(50, 2, 'Apartamento acogedor cerca a estación de metro', 'casa cómodo y bien distribuido con 2 habitaciones, 1 baño, sala-comedor, cocina semi integral y zona de ropas. Ubicado en un sector estratégico, a pocos minutos de la estación del metro, con fácil acceso a transporte público, tiendas, supermercados y zonas comerciales. Ideal para parejas o inversión en arriendo.', 'Calle 48 #65-20,   El Poblado', 3500000.00, 'available', '2026-04-08 13:45:08', '2026-04-08 13:56:53', NULL, 'uploads/1775655908576-1774973259952-1765653695728_apto1.jpeg', 'Casa', 2, 1, '[\"Acepto Mascotas\",\"Parqueadero\",\"Ascensor\",\"Red de gas\",\"Calentador de agua\",\"Balcón\"]', NULL),
(51, 2, 'Apartaestudio moderno ideal para una persona o pareja', 'Apartaestudio tipo loft con excelente iluminación natural, cuenta con espacio abierto para habitación y sala, 1 baño, cocina integral y zona de ropas. Ubicado en una zona estratégica cerca de restaurantes, supermercados y transporte público. Ideal para estudiantes o profesionales que buscan comodidad y buena ubicación.', 'Calle 10 #43-15, Envigado', 1200000.00, 'available', '2026-04-08 13:46:56', '2026-04-08 13:46:56', NULL, 'uploads/1775656016819-1774973259953-1765655122724_estudio1.jpg', 'Apartamento', 1, 1, '[\"Acepto Mascotas\",\"Parqueadero\",\"Red de gas\",\"Calentador de agua\"]', NULL),
(52, 2, 'Local comercial en zona de alto flujo peatonal', 'Local comercial con excelente ubicación, cuenta con amplio espacio abierto, 1 baño y vitrina frontal ideal para exhibición. Ubicado en zona de alto tráfico peatonal y vehicular, perfecto para negocios como tiendas, cafeterías o servicios. Fácil acceso a transporte público y rodeado de comercio activo.', 'Carrera 52 #50-20,  La Estrella', 1500000.00, 'available', '2026-04-08 13:51:23', '2026-04-08 13:56:25', NULL, 'uploads/1775656283765-WhatsApp Image 2026-04-08 at 8.45.20 AM.jpeg', 'Apartamento', 0, 1, '[\"Parqueadero\"]', NULL),
(53, 2, 'Finca campestre con amplias zonas verdes y vista natural', 'Hermosa finca campestre ideal para descanso o inversión, cuenta con 4 habitaciones, 3 baños, sala amplia, cocina equipada y corredores con vista a la naturaleza. Dispone de amplias zonas verdes, árboles frutales, parqueadero y espacio para reuniones o eventos. Ubicada en un entorno tranquilo, con aire puro y fácil acceso desde la ciudad.', 'Vereda San Antonio,  vía Santa Elena', 4200000.00, 'available', '2026-04-08 13:54:21', '2026-04-08 13:56:15', NULL, 'uploads/1775656461939-WhatsApp Image 2026-04-08 at 8.48.12 AM.jpeg', 'Apartamento', 4, 1, '[\"Parqueadero\",\"Amoblado\",\"Ascensor\",\"Red de gas\",\"Calentador de agua\",\"Acepto Mascotas\"]', NULL),
(54, 2, 'Habitación amoblada en excelente ubicación', 'Habitación cómoda y amoblada, cuenta con cama, clóset y buena iluminación natural. Incluye acceso a baño compartido, cocina equipada, zona de ropas y servicios públicos. Ubicada en un sector seguro y tranquilo, cerca de transporte público, supermercados y zonas comerciales. Ideal para estudiantes o profesionales.baño', 'Carrera 43 #8-25,, Sabaneta', 980000.00, 'available', '2026-04-08 13:56:00', '2026-04-08 13:56:00', NULL, 'uploads/1775656560491-baÃ±o_habitacion.jpeg', 'Apartamento', 1, 1, '[\"Calentador de agua\",\"Red de gas\",\"Amoblado\",\"Parqueadero\"]', NULL),
(55, 2, 'Oficina moderna en zona empresarial', 'Oficina ideal para empresas o profesionales, cuenta con espacio abierto, excelente iluminación, 1 baño y área para recepción. Ubicada en zona empresarial con fácil acceso a transporte público, cerca de bancos, restaurantes y centros de negocios. Edificio con seguridad y ambiente profesional.', 'Carrera 43A #1-50, Belén', 1800000.00, 'available', '2026-04-08 13:58:45', '2026-04-08 13:58:45', NULL, 'uploads/1775656725641-ofi.jpeg', 'Apartamento', 0, 1, '[\"Calentador de agua\",\"Parqueadero\"]', NULL);

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
(49, 17, 'uploads/1775553321397-Canguro gangster con.png', 1),
(50, 18, 'uploads/1775554684586-Canguro gangster con.png', 1),
(51, 19, 'uploads/1775555022084-Canguro gangster con.png', 1),
(52, 20, 'uploads/1775555106772-Gorila gangster esti.png', 1),
(53, 21, 'uploads/1775555560954-Gorila gangster esti.png', 1),
(54, 22, 'uploads/1775562306507-Gorila gangster esti.png', 1),
(55, 23, 'uploads/1775562426253-Gorila gangster esti.png', 1),
(56, 24, 'uploads/1775562973392-Canguro gangster con.png', 1),
(57, 25, 'uploads/1775563223907-Gorila gangster esti.png', 1),
(58, 26, 'uploads/1775564020460-Gorila gangster esti.png', 1),
(59, 27, 'uploads/1775565906224-Canguro gangster con.png', 1),
(60, 28, 'uploads/1775566211320-Gorila gangster esti.png', 1),
(61, 29, 'uploads/1775566513230-Gorila gangster esti.png', 1),
(62, 30, 'uploads/1775569089428-Canguro gangster con.png', 1),
(63, 31, 'uploads/1775572622741-Gorila gangster esti.png', 1),
(64, 32, 'uploads/1775572705075-Canguro gangster con.png', 1),
(65, 33, 'uploads/1775572829847-image_1.jpg', 1),
(66, 34, 'uploads/1775629479120-Canguro gangster con.png', 1),
(67, 35, 'uploads/1775630079278-Gorila gangster esti.png', 1),
(68, 36, 'uploads/1775634476975-image_1.jpg', 1),
(69, 37, 'uploads/1775646987095-133961450110532692.jpg', 1),
(70, 37, 'uploads/1775646987122-Gorila gangster esti.png', 2),
(71, 38, 'uploads/1775647132610-Canguro gangster con.png', 1),
(72, 39, 'uploads/1775647902128-Canguro gangster con.png', 1),
(73, 40, 'uploads/1775648023224-Gorila gangster esti.png', 1),
(74, 41, 'uploads/1775648250178-image_1.jpg', 1),
(75, 42, 'uploads/1775648908615-image_1.jpg', 1),
(76, 43, 'uploads/1775648957785-image_1.jpg', 1),
(77, 44, 'uploads/1775649091968-image_1.jpg', 1),
(78, 45, 'uploads/1775649191821-image_1.jpg', 1),
(79, 46, 'uploads/1775654007376-1772634937586-1765653695728_apto1.jpeg', 1),
(80, 46, 'uploads/1775654007376-1772634944932-1765655122730_estudio2.jpeg', 2),
(81, 47, 'uploads/1775655149862-1774624674288-logo.png', 1),
(82, 48, 'uploads/1775655705586-1765739493513_lau4.jpg', 1),
(83, 48, 'uploads/1775655705587-1765739493524_lau3.jpg', 2),
(84, 49, 'uploads/1775655836622-1774975389166-1765726790020_lof3.jpg', 1),
(85, 49, 'uploads/1775655836622-1774975418028-1765653695732_apto2.jpeg', 2),
(86, 49, 'uploads/1775655836623-1774975467373-1765655122724_estudio1.jpg', 3),
(87, 49, 'uploads/1775655836625-1774967424800-1765655122724_estudio1.jpg', 4),
(88, 50, 'uploads/1775655908576-1774973259952-1765653695728_apto1.jpeg', 1),
(89, 50, 'uploads/1775655908576-1774975389166-1765726790020_lof3.jpg', 2),
(90, 51, 'uploads/1775656016819-1774973259953-1765655122724_estudio1.jpg', 1),
(91, 51, 'uploads/1775656016819-1774973294660-1765653695732_apto2.jpeg', 2),
(92, 52, 'uploads/1775656283765-WhatsApp Image 2026-04-08 at 8.45.20 AM.jpeg', 1),
(93, 53, 'uploads/1775656461939-WhatsApp Image 2026-04-08 at 8.48.12 AM.jpeg', 1),
(94, 53, 'uploads/1775656461939-WhatsApp Image 2026-04-08 at 8.47.36 AM (1).jpeg', 2),
(95, 53, 'uploads/1775656461944-WhatsApp Image 2026-04-08 at 8.48.21 AM.jpeg', 3),
(96, 54, 'uploads/1775656560491-baÃ±o_habitacion.jpeg', 1),
(97, 54, 'uploads/1775656560491-habitacio.jpeg', 2),
(98, 55, 'uploads/1775656725641-ofi.jpeg', 1);

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
  `last_name` varchar(100) DEFAULT NULL,
  `is_premium` tinyint(1) DEFAULT 0,
  `premium_until` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `role`, `email`, `cedula`, `password_hash`, `is_verified`, `verification_code`, `verification_expires`, `reset_code`, `reset_expires`, `name`, `phone`, `score`, `status`, `created_at`, `updated_at`, `deleted_at`, `plan`, `free_publications_used`, `avatar`, `description`, `last_name`, `is_premium`, `premium_until`) VALUES
(1, 'owner', 'brayanpedroza_1999@hotmail.com', '1143456241', '$2b$10$Ja7uQZi51edAXVuNkofMLOB9cF7T93MtSIdLNuh0GTaBGmRclCYze', 1, NULL, NULL, NULL, NULL, 'esposo maryis ', '', 510, 'active', '2026-02-16 02:50:30', '2026-04-08 06:56:30', NULL, 'free', 1, 'https://res.cloudinary.com/dcuwpov4o/image/upload/v1772833225/rentdirect/avatars/szmc0mp0cnqbnopkm6hf.jpg', NULL, NULL, 0, NULL),
(2, 'owner', 'marjhoperozo@hotmail.es', '1007978998', '$2b$10$/iZ6zz/3iiX7hTyfyhJ.B..Rc9MNJzmafnjUFCafEP9WhZSgsbVz.', 1, NULL, NULL, NULL, NULL, 'maryis', '', 500, 'active', '2026-02-16 02:55:36', '2026-04-08 11:37:28', NULL, 'free', 1, 'https://res.cloudinary.com/dcuwpov4o/image/upload/v1775529622/rentdirect/avatars/n0yfb9trlcejlnegrr8u.png', NULL, NULL, 1, '2026-05-08 06:37:28'),
(5, 'owner', 'evelyn.alvarezg7@gmail.com', '12345678', '$2b$10$wGfGQkhraGdA4e8s6FRluO4FEsiqhC9VEZTP5fy5e.XQNM0dImNvK', 1, NULL, NULL, NULL, NULL, 'evelyn', '', 500, 'active', '2026-02-20 13:03:53', '2026-04-06 23:22:46', NULL, 'free', 1, NULL, NULL, NULL, 0, NULL),
(6, 'tenant', 'maryisperozo3@gmail.com', '7894758956', '$2b$10$nJ/XCfmMpAncGtqsCJW30efYQuYiyB9aJ3iajtTbWi./Ki2q6yRE2', 1, NULL, NULL, NULL, NULL, 'kelly', NULL, 520, 'active', '2026-02-27 15:15:06', '2026-04-08 11:19:53', NULL, 'free', 0, 'https://res.cloudinary.com/dcuwpov4o/image/upload/v1775634228/rentdirect/avatars/syxavad88rjtqq47molh.jpg', NULL, NULL, 0, NULL),
(7, 'tenant', 'brayanandrespedroza1999@gmail.com', '97884512', '$2b$10$oeqq9ukKo16d2Kzs6z6Eb.PGaPVCmh0Dj2JJnmtTtgg1kWK/zx6Wy', 0, '681529', '2026-02-27 10:47:48', NULL, NULL, 'eve', NULL, 500, 'suspended', '2026-02-27 15:37:48', '2026-04-06 21:00:57', NULL, 'free', 0, NULL, NULL, NULL, 0, NULL),
(11, 'owner', 'angelamariaguzmanchica@gmail.com', '43844722', '$2b$10$918xRZrbSJcXOCi/hxcXtODi0ZsbbemJQqb1.8aMp/w9FzPFvm3mi', 1, NULL, NULL, NULL, NULL, 'angela guzman ', '', 510, 'active', '2026-03-20 12:28:37', '2026-04-08 06:56:52', NULL, 'free', 1, 'https://res.cloudinary.com/dcuwpov4o/image/upload/v1775257234/rentdirect/avatars/dg6zkj5tofyxgzeimtxg.jpg', NULL, NULL, 0, NULL),
(12, 'tenant', 'yulianaguzman821@gmail.com', '1020106248', '$2b$10$n9ePeH2BvS/fQ/dLq913veDjy1.Zs32DI3xKhGWsxXNhLmRwbS.tC', 0, '222635', '2026-04-01 15:11:01', NULL, NULL, 'Yuliana Guzman', NULL, 500, 'active', '2026-04-01 20:01:01', '2026-04-01 20:01:01', NULL, 'free', 0, NULL, NULL, NULL, 0, NULL),
(13, 'admin', 'hhh.kakaka1995@gmail.com', '1020106277', '$2b$10$Ka6LWF7.PGFYIaSl.1XczOx57NsYoqCJhHi83RJHCJBRYuP9Q6Bzi', 1, NULL, NULL, NULL, NULL, 'Yuliana', NULL, 500, 'active', '2026-04-05 13:42:22', '2026-04-05 13:43:27', NULL, 'free', 0, NULL, NULL, NULL, 0, NULL),
(14, 'admin', 'markusbrown660@gmail.com', '1125659854', '$2b$10$6.AWg7P/5qkfO7OgQDJqHu74H5oWtcFU1H/oY3346TKdSabr53DFW', 1, NULL, NULL, NULL, NULL, 'administrador', NULL, 500, 'active', '2026-04-07 09:03:50', '2026-04-07 09:05:07', NULL, 'free', 0, NULL, NULL, NULL, 0, NULL);

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
  ADD KEY `user_id` (`user_id`),
  ADD KEY `fk_contract` (`contract_id`);

--
-- Indices de la tabla `invoices`
--
ALTER TABLE `invoices`
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
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `chats`
--
ALTER TABLE `chats`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT de la tabla `contracts`
--
ALTER TABLE `contracts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `documents`
--
ALTER TABLE `documents`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT de la tabla `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `messages`
--
ALTER TABLE `messages`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=552;

--
-- AUTO_INCREMENT de la tabla `properties`
--
ALTER TABLE `properties`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT de la tabla `property_images`
--
ALTER TABLE `property_images`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=99;

--
-- AUTO_INCREMENT de la tabla `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

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
  ADD CONSTRAINT `chats_ibfk_2` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `chats_ibfk_3` FOREIGN KEY (`tenant_id`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `documents`
--
ALTER TABLE `documents`
  ADD CONSTRAINT `documents_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_contract` FOREIGN KEY (`contract_id`) REFERENCES `contracts` (`id`);

--
-- Filtros para la tabla `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
