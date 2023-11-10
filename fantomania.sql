-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:8889
-- Généré le : ven. 10 nov. 2023 à 13:01
-- Version du serveur : 5.7.39
-- Version de PHP : 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `fantomania`
--

-- --------------------------------------------------------

--
-- Structure de la table `ghost`
--

CREATE TABLE `ghost` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `speed` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `ghost`
--

INSERT INTO `ghost` (`id`, `name`, `speed`) VALUES
(1, 'ghost', 30),
(2, 'ghosty', 10),
(3, 'gameOver', 0);

-- --------------------------------------------------------

--
-- Structure de la table `players`
--

CREATE TABLE `players` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `speed` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `players`
--

INSERT INTO `players` (`id`, `name`, `speed`) VALUES
(1, 'player', 480);

-- --------------------------------------------------------

--
-- Structure de la table `scene`
--

CREATE TABLE `scene` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `scale` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `scene`
--

INSERT INTO `scene` (`id`, `name`, `scale`) VALUES
(1, 'fairy', 0.77),
(2, 'fairy-playground', 0.77);

-- --------------------------------------------------------

--
-- Structure de la table `tile`
--

CREATE TABLE `tile` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `tile`
--

INSERT INTO `tile` (`id`, `name`) VALUES
(1, 'coin'),
(2, 'steel'),
(3, 'portal');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `ghost`
--
ALTER TABLE `ghost`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `players`
--
ALTER TABLE `players`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `scene`
--
ALTER TABLE `scene`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `tile`
--
ALTER TABLE `tile`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `ghost`
--
ALTER TABLE `ghost`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `players`
--
ALTER TABLE `players`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `scene`
--
ALTER TABLE `scene`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `tile`
--
ALTER TABLE `tile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
