/*
SQLyog Community Edition- MySQL GUI v5.32
Host - 11.4.2-MariaDB : Database - proyecto
*********************************************************************
Server version : 11.4.2-MariaDB
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

create database if not exists `proyecto`;

USE `proyecto`;

/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

/*Table structure for table `tareas` */

DROP TABLE IF EXISTS `tareas`;

CREATE TABLE `tareas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `fecha_entrega` date NOT NULL,
  `grupo` varchar(50) NOT NULL,
  `estado` enum('Pendiente','Entregado','Vencido') DEFAULT 'Pendiente',
  `profesor_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `profesor_id` (`profesor_id`),
  CONSTRAINT `tareas_ibfk_1` FOREIGN KEY (`profesor_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

/*Data for the table `tareas` */

insert  into `tareas`(`id`,`titulo`,`descripcion`,`fecha_entrega`,`grupo`,`estado`,`profesor_id`) values (13,'3','3','2025-02-28','Grupo A','Entregado',8),(14,'1','2','2025-02-28','Grupo A','Entregado',8),(15,'34','432','2025-02-28','Grupo A','Entregado',8),(16,'53','3232','2025-02-27','Grupo A','Entregado',8),(17,'1','2','2025-02-28','Grupo B','Entregado',8),(18,'4','3','2025-02-28','Grupo B','Entregado',8);

/*Table structure for table `usuarios` */

DROP TABLE IF EXISTS `usuarios`;

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('Estudiante','Profesor') NOT NULL,
  `curso` enum('Grupo A','Grupo B') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

/*Data for the table `usuarios` */

insert  into `usuarios`(`id`,`username`,`password`,`role`,`curso`) values (1,'Diego','Abuela77','Estudiante','Grupo A'),(3,'Diego F','scrypt:32768:8:1$EsXREjBpiANaVYCZ$931d58e21316d9ef72d7b7b082b40af256f5463c5b5f3c58b7232c2f599a3dbb8bd74a9cb291e987e55a7ca28ca835b6c74c1d038fc413b8c01decbda17880db','Estudiante','Grupo A'),(4,'Fulanito','scrypt:32768:8:1$rv3ji5rRVLpFqoW0$b52a548e0578a9e341492bbc2eeec9e4cffcc6e4b01c6f338273b191227841e7540d2979e2f8c1ff1c95c9113b8fb2cee85bd1378f986032e45e45073b6e6e69','Estudiante','Grupo A'),(5,'Diomedez','scrypt:32768:8:1$LkI5x12IzEiNwXd2$f64edb9ea7a55a009a9a64c171c5a19095c2891c5003fa824f60d795c6e026341faf1d05c1d92d28ebce558528f3a2e6846e67d46baffbfe641a6ec4bda2777b','Estudiante','Grupo A'),(7,'menganito','scrypt:32768:8:1$ezXf57PJP8L2ROXC$37103005c914d1433e87ed779d72ca1ba58e9760fd06a230b4b39b72f938ed6549b545f5d1098080ae1cfb3ed9f41db9122aa6e8796cda64d5f8d17fe573bb4c','Estudiante','Grupo B'),(8,'jirafales','scrypt:32768:8:1$N0A2R1EZDPx83MtS$6a88f67b76b7e2e35308e19c78d80d8627a75a183a8a0e3698b33ee997ca8c7bb6c999a1c70b7c529c5429c75d28f5294a91bcf654fce6fa5f1c17a697f939d9','Profesor','Grupo B'),(9,'777','scrypt:32768:8:1$0Gh9GmTrcbiDc1P6$5032446f3bc7ffce93d1f01f672ca9bf082195982f709ea46e5d075d05dc913a32409cb48dc2318af0443e495c11244ea10b04cc8c05b00ad748750175ffa998','Profesor','Grupo A'),(10,'99','scrypt:32768:8:1$aaGFU3UiVwUOBS3U$d6d76f1661a737767b2d0880fe823334a825c5bb5fa430eb00ea9d19b7f512b7f7b050bd0899b04cea786cbf53c6a0dc4ea0c60ba0837ed772892ef195c40859','Estudiante','Grupo B'),(14,'12324','scrypt:32768:8:1$mx2uEgcuAtxZGlp1$c77f57f02b78b09aaec7d761847015f275501bdd704c44ce6f3357605c41c2dafd727e771cff18cfd03e2439a472ce71a70f29eb77297ed1ade86453b7819a32','Estudiante','Grupo A'),(15,'999','scrypt:32768:8:1$9boozErUNd2FA2Ib$0e9eed3318b825ff34f3210dcb0b9a007ba6b6f4937dd7e803cd960aa21025bf6e49218cdfc0e0d6b3ba4d69c5cdccc0be5498edbb88655692539152d4935b26','Estudiante','Grupo B');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
