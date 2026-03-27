-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 27-03-2026 a las 12:05:28
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
(23, 27, 1, 'agreed', 'Estoy interesado en esta propiedad', '2026-03-20 12:07:10', '2026-03-27 01:36:58', NULL);

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
(16, 27, 2, 1, '2026-03-20 12:07:22');

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
  `termination_clause` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `contracts`
--

INSERT INTO `contracts` (`id`, `chat_id`, `property_id`, `owner_id`, `tenant_id`, `start_date`, `end_date`, `monthly_price`, `terms`, `status`, `created_at`, `payment_method`, `property_address`, `property_description`, `utilities`, `use_clause`, `repairs_clause`, `termination_clause`) VALUES
(1, 16, 27, 2, 1, '2026-05-15', '2026-10-15', 1200000.00, 'acordado', 'active', '2026-03-27 01:54:33', 'Transferencia', 'prueba chat, El Poblado', 'prueba chat', '[\"Agua\",\"Luz\",\"Gas\"]', 'bien', 'bien', 'bien');

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
(2, 1, 1, 'contract', 'http://localhost:4000/uploads/contracts/contract_1.pdf', '', '2026-03-27 02:52:49', '2026-03-27 02:52:49', NULL);

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
(151, 16, 2, 'estoy probando chat', '2026-03-20 12:07:32'),
(152, 16, 6, 'estoy probando chat tambien ', '2026-03-20 12:07:54');

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
(27, 2, 'prueba chat', 'prueba chat', 'prueba chat, El Poblado', 1200000.00, 'rented', '2026-03-20 12:06:38', '2026-03-27 01:55:10', NULL, NULL, 'Apartamento', 1, 1, '[\"Parqueadero\",\"Mascotas\",\"Balcón\"]');

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
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `role`, `email`, `cedula`, `password_hash`, `is_verified`, `verification_code`, `verification_expires`, `reset_code`, `reset_expires`, `name`, `phone`, `score`, `status`, `created_at`, `updated_at`, `deleted_at`, `plan`, `free_publications_used`, `avatar`, `description`) VALUES
(1, 'tenant', 'brayanpedroza_1999@hotmail.com', '1143456241', '$2b$10$Ja7uQZi51edAXVuNkofMLOB9cF7T93MtSIdLNuh0GTaBGmRclCYze', 1, NULL, NULL, NULL, NULL, 'markus', NULL, 500, 'active', '2026-02-16 02:50:30', '2026-03-06 21:40:26', NULL, 'free', 0, 'https://res.cloudinary.com/dcuwpov4o/image/upload/v1772833225/rentdirect/avatars/szmc0mp0cnqbnopkm6hf.jpg', NULL),
(2, 'owner', 'marjhoperozo@hotmail.es', '1007978998', '$2b$10$/iZ6zz/3iiX7hTyfyhJ.B..Rc9MNJzmafnjUFCafEP9WhZSgsbVz.', 1, NULL, NULL, NULL, NULL, 'maryis', NULL, 500, 'active', '2026-02-16 02:55:36', '2026-02-27 15:35:50', NULL, 'free', 1, NULL, NULL),
(5, 'owner', 'evelyn.alvarezg7@gmail.com', '12345678', '$2b$10$wGfGQkhraGdA4e8s6FRluO4FEsiqhC9VEZTP5fy5e.XQNM0dImNvK', 1, NULL, NULL, NULL, NULL, 'evelyn', NULL, 500, 'active', '2026-02-20 13:03:53', '2026-02-20 13:08:26', NULL, 'free', 0, NULL, NULL),
(6, 'tenant', 'maryisperozo3@gmail.com', '7894758956', '$2b$10$nJ/XCfmMpAncGtqsCJW30efYQuYiyB9aJ3iajtTbWi./Ki2q6yRE2', 1, NULL, NULL, NULL, NULL, 'maryis', NULL, 500, 'active', '2026-02-27 15:15:06', '2026-02-27 15:18:54', NULL, 'free', 0, NULL, NULL),
(7, 'tenant', 'brayanandrespedroza1999@gmail.com', '97884512', '$2b$10$oeqq9ukKo16d2Kzs6z6Eb.PGaPVCmh0Dj2JJnmtTtgg1kWK/zx6Wy', 0, '681529', '2026-02-27 10:47:48', NULL, NULL, 'eve', NULL, 500, 'active', '2026-02-27 15:37:48', '2026-02-27 15:37:48', NULL, 'free', 0, NULL, NULL);

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
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `chats`
--
ALTER TABLE `chats`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `contracts`
--
ALTER TABLE `contracts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `documents`
--
ALTER TABLE `documents`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `messages`
--
ALTER TABLE `messages`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=153;

--
-- AUTO_INCREMENT de la tabla `properties`
--
ALTER TABLE `properties`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT de la tabla `property_images`
--
ALTER TABLE `property_images`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `rental_records`
--
ALTER TABLE `rental_records`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

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
  ADD CONSTRAINT `chats_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`),
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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
