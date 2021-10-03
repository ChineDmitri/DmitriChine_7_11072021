-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3308
-- Generation Time: Oct 03, 2021 at 01:01 PM
-- Server version: 8.0.24
-- PHP Version: 7.1.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `groupomania`
--

-- --------------------------------------------------------

--
-- Table structure for table `account_commentaires`
--

CREATE TABLE `account_commentaires` (
  `user_id` int UNSIGNED NOT NULL,
  `commentaire_id` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `account_commentaires`
--

INSERT INTO `account_commentaires` (`user_id`, `commentaire_id`) VALUES
(262, 255);

-- --------------------------------------------------------

--
-- Table structure for table `account_commentaires_liked`
--

CREATE TABLE `account_commentaires_liked` (
  `user_id` int UNSIGNED NOT NULL,
  `commentaire_id` int UNSIGNED NOT NULL,
  `status` tinyint NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `account_posts`
--

CREATE TABLE `account_posts` (
  `user_id` int UNSIGNED NOT NULL,
  `post_id` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `account_posts`
--

INSERT INTO `account_posts` (`user_id`, `post_id`) VALUES
(262, 409);

-- --------------------------------------------------------

--
-- Table structure for table `account_posts_liked`
--

CREATE TABLE `account_posts_liked` (
  `user_id` int UNSIGNED NOT NULL,
  `post_id` int UNSIGNED NOT NULL,
  `status` tinyint NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `account_posts_liked`
--

INSERT INTO `account_posts_liked` (`user_id`, `post_id`, `status`) VALUES
(262, 409, 0);

-- --------------------------------------------------------

--
-- Table structure for table `post`
--

CREATE TABLE `post` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED DEFAULT NULL,
  `date_publication` datetime NOT NULL,
  `date_modification` datetime DEFAULT NULL,
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `discription` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `likes` smallint DEFAULT NULL,
  `dislikes` smallint DEFAULT NULL,
  `comments` smallint UNSIGNED DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `post`
--

INSERT INTO `post` (`id`, `user_id`, `date_publication`, `date_modification`, `title`, `discription`, `likes`, `dislikes`, `comments`) VALUES
(409, 262, '2021-09-17 21:45:38', '2021-09-24 16:55:40', 'Hello World!', 'First post for Hello World!! 🤑', NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `post_commentaire`
--

CREATE TABLE `post_commentaire` (
  `id` int UNSIGNED NOT NULL,
  `commentaire` mediumtext COLLATE utf8mb4_unicode_ci,
  `date_publication` datetime NOT NULL,
  `date_modification` datetime DEFAULT NULL,
  `likes` smallint DEFAULT NULL,
  `dislikes` smallint DEFAULT NULL,
  `user_id` int UNSIGNED NOT NULL,
  `post_id` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `post_commentaire`
--

INSERT INTO `post_commentaire` (`id`, `commentaire`, `date_publication`, `date_modification`, `likes`, `dislikes`, `user_id`, `post_id`) VALUES
(255, 'Client! 😂😁', '2021-09-24 16:55:56', '2021-09-24 17:07:32', NULL, NULL, 262, 409);

-- --------------------------------------------------------

--
-- Table structure for table `post_photo`
--

CREATE TABLE `post_photo` (
  `id` int UNSIGNED NOT NULL,
  `url_img` varchar(400) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `post_id` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `post_photo`
--

INSERT INTO `post_photo` (`id`, `url_img`, `post_id`) VALUES
(443, 'https://node-server-groupomania.herokuapp.com/images/header_bg.png1631908361249.png', 409);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int UNSIGNED NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '0',
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `pseudo` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `profil_img_url` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT 'https://dcdev-groupomania.herokuapp.com/img/custom_photo_user.png',
  `date_inscription` datetime NOT NULL,
  `profil` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'u'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `active`, `email`, `password`, `pseudo`, `profil_img_url`, `date_inscription`, `profil`) VALUES
(262, 1, '949b74a2b837f99c15b60ede516cce3060ef88b7fd0d611040d4cb9d18b63b4e', '$2b$10$SZWK6JaeikzOeFWUqdGujOUQzo4j68Dypu9COpF5HtyqA3yXPxmFe', 'Admin', 'https://dcdev-groupomania.herokuapp.com/img/custom_photo_user.png', '2021-09-17 21:43:50', 'a'),
(273, 1, '723c418a425b3c0c335e60b59ac5281cf007f132a06e0362862dbf0574798c52', '$2b$10$SZWK6JaeikzOeFWUqdGujOUQzo4j68Dypu9COpF5HtyqA3yXPxmFe', 'Moderator', 'https://dcdev-groupomania.herokuapp.com/img/custom_photo_user.png', '2021-10-03 11:58:35', 'm'),
(274, 1, '1c4e6d37ed43b0f57cd58e08a4ca48b99ed10d259c44b1b25cc22ea8faf94248', '$2b$10$SZWK6JaeikzOeFWUqdGujOUQzo4j68Dypu9COpF5HtyqA3yXPxmFe', 'User1', 'https://dcdev-groupomania.herokuapp.com/img/custom_photo_user.png', '2021-10-03 11:59:08', 'u'),
(275, 1, 'd9bf6bfe7379b098299d076c8ed0ce0b77417596f4c7878a0ed331e4126baf12', '$2b$10$SZWK6JaeikzOeFWUqdGujOUQzo4j68Dypu9COpF5HtyqA3yXPxmFe', 'User2', 'https://dcdev-groupomania.herokuapp.com/img/custom_photo_user.png', '2021-10-03 11:59:44', 'u');

-- --------------------------------------------------------

--
-- Table structure for table `user_deleted`
--

CREATE TABLE `user_deleted` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int DEFAULT NULL,
  `pseudo` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account_commentaires`
--
ALTER TABLE `account_commentaires`
  ADD KEY `account_commentaire_ibfk_1` (`user_id`),
  ADD KEY `account_commentaire_ibfk_2` (`commentaire_id`);

--
-- Indexes for table `account_commentaires_liked`
--
ALTER TABLE `account_commentaires_liked`
  ADD KEY `user_id` (`user_id`),
  ADD KEY `commentaire_id` (`commentaire_id`) USING BTREE;

--
-- Indexes for table `account_posts`
--
ALTER TABLE `account_posts`
  ADD KEY `profil_id` (`user_id`),
  ADD KEY `post_id` (`post_id`);

--
-- Indexes for table `account_posts_liked`
--
ALTER TABLE `account_posts_liked`
  ADD KEY `user_id` (`user_id`),
  ADD KEY `post_id` (`post_id`);

--
-- Indexes for table `post`
--
ALTER TABLE `post`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `post_ibfk_1` (`user_id`);

--
-- Indexes for table `post_commentaire`
--
ALTER TABLE `post_commentaire`
  ADD PRIMARY KEY (`id`),
  ADD KEY `post_id` (`post_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `post_photo`
--
ALTER TABLE `post_photo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `post_id` (`post_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `pseudo` (`pseudo`);

--
-- Indexes for table `user_deleted`
--
ALTER TABLE `user_deleted`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `post`
--
ALTER TABLE `post`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=415;

--
-- AUTO_INCREMENT for table `post_commentaire`
--
ALTER TABLE `post_commentaire`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=256;

--
-- AUTO_INCREMENT for table `post_photo`
--
ALTER TABLE `post_photo`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=449;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=276;

--
-- AUTO_INCREMENT for table `user_deleted`
--
ALTER TABLE `user_deleted`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `account_commentaires`
--
ALTER TABLE `account_commentaires`
  ADD CONSTRAINT `account_commentaire_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `account_commentaire_ibfk_2` FOREIGN KEY (`commentaire_id`) REFERENCES `post_commentaire` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `account_commentaires_liked`
--
ALTER TABLE `account_commentaires_liked`
  ADD CONSTRAINT `account_commentaires_liked_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `account_commentaires_liked_ibfk_2` FOREIGN KEY (`commentaire_id`) REFERENCES `post_commentaire` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `account_posts`
--
ALTER TABLE `account_posts`
  ADD CONSTRAINT `account_posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `account_posts_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`);

--
-- Constraints for table `account_posts_liked`
--
ALTER TABLE `account_posts_liked`
  ADD CONSTRAINT `account_posts_liked_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `account_posts_liked_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`);

--
-- Constraints for table `post`
--
ALTER TABLE `post`
  ADD CONSTRAINT `post_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `post_commentaire`
--
ALTER TABLE `post_commentaire`
  ADD CONSTRAINT `post_commentaire_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`),
  ADD CONSTRAINT `post_commentaire_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `post_photo`
--
ALTER TABLE `post_photo`
  ADD CONSTRAINT `post_photo_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
