-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: company_management_db
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
-- Table structure for table `attendances`
--

DROP TABLE IF EXISTS `attendances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendances` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `date` date NOT NULL,
  `check_in` datetime DEFAULT NULL,
  `check_out` datetime DEFAULT NULL,
  `working_hours` decimal(4,2) NOT NULL DEFAULT '0.00',
  `status` enum('PRESENT','ABSENT','HALF_DAY','ON_LEAVE','HOLIDAY') NOT NULL DEFAULT 'PRESENT',
  `notes` varchar(255) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `is_manual_override` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `is_late` tinyint(1) NOT NULL DEFAULT '0',
  `is_on_break` tinyint(1) NOT NULL DEFAULT '0',
  `break_start` datetime DEFAULT NULL,
  `break_end` datetime DEFAULT NULL,
  `total_break_minutes` int NOT NULL DEFAULT '0',
  `current_work_status` varchar(50) NOT NULL DEFAULT 'NOT_CHECKED_IN',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_employee_attendance_date` (`employee_id`,`date`),
  KEY `attendances_date` (`date`),
  KEY `attendances_status` (`status`),
  CONSTRAINT `attendances_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendances`
--

LOCK TABLES `attendances` WRITE;
/*!40000 ALTER TABLE `attendances` DISABLE KEYS */;
INSERT INTO `attendances` VALUES (17,10,'2026-09-16','2026-09-16 10:33:23',NULL,8.00,'PRESENT','Verified by HR: On-duty client morning meeting','::1',1,'2026-09-16 10:33:23','2026-09-16 10:34:38',0,0,NULL,NULL,0,'NOT_CHECKED_IN'),(19,12,'2026-09-16','2026-09-16 05:47:00',NULL,0.00,'PRESENT','Late login at 10 am','::1',1,'2026-09-16 11:17:35','2026-09-16 11:32:11',0,0,NULL,NULL,0,'NOT_CHECKED_IN'),(20,13,'2026-09-16','2026-09-16 11:17:35',NULL,0.00,'PRESENT','Late login at 4:47 PM','::1',0,'2026-09-16 11:17:35','2026-09-16 11:17:35',1,0,NULL,NULL,0,'NOT_CHECKED_IN'),(22,13,'2026-09-17','2026-09-17 07:16:46',NULL,0.00,'PRESENT','Late login at 12:46 PM','::1',0,'2026-09-17 07:16:46','2026-09-17 08:22:40',1,0,'2026-09-17 08:22:40','2026-09-17 08:22:40',1,'CHECKED_IN'),(23,12,'2026-09-17','2026-09-17 08:09:48','2026-09-17 08:22:07',0.19,'HALF_DAY','Late login at 1:39 PM','::1',0,'2026-09-17 08:09:48','2026-09-17 08:22:07',1,0,'2026-09-17 08:22:06','2026-09-17 08:22:07',1,'CHECKED_OUT'),(24,1,'2026-09-19','2026-09-19 10:58:05',NULL,0.00,'PRESENT','Late login at 4:28 PM','::1',0,'2026-09-19 10:58:05','2026-09-19 10:58:05',1,0,NULL,NULL,0,'CHECKED_IN'),(25,9,'2026-09-19','2026-09-19 11:08:43',NULL,0.00,'PRESENT','Late login at 4:38 PM','::1',0,'2026-09-19 11:08:43','2026-09-19 11:08:43',1,0,NULL,NULL,0,'CHECKED_IN'),(26,12,'2026-09-19','2026-09-19 11:08:43',NULL,0.00,'PRESENT','Late login at 4:38 PM','::1',0,'2026-09-19 11:08:43','2026-09-19 11:08:43',1,0,NULL,NULL,0,'CHECKED_IN'),(27,20,'2026-09-19','2026-09-19 11:37:01',NULL,0.00,'PRESENT','Late login at 5:07 PM','::1',0,'2026-09-19 11:37:01','2026-09-19 11:37:01',1,0,NULL,NULL,0,'CHECKED_IN'),(28,21,'2026-09-19','2026-09-19 12:00:32',NULL,0.00,'PRESENT','Late login at 5:30 PM','::1',0,'2026-09-19 12:00:32','2026-09-19 12:00:32',1,0,NULL,NULL,0,'CHECKED_IN'),(29,10,'2026-09-19','2026-09-19 12:00:32',NULL,0.00,'PRESENT','Late login at 5:30 PM','::1',0,'2026-09-19 12:00:32','2026-09-19 12:00:32',1,0,NULL,NULL,0,'CHECKED_IN'),(30,22,'2026-09-19','2026-09-19 12:00:32',NULL,0.00,'PRESENT','Late login at 5:30 PM','::1',0,'2026-09-19 12:00:32','2026-09-19 12:00:32',1,0,NULL,NULL,0,'CHECKED_IN'),(31,1,'2026-09-21','2026-09-21 10:49:00',NULL,0.00,'PRESENT','Late login at 4:19 PM','::1',0,'2026-09-21 10:49:00','2026-09-21 10:49:00',1,0,NULL,NULL,0,'CHECKED_IN'),(32,12,'2026-09-21','2026-09-21 10:54:49',NULL,0.00,'PRESENT','Late login at 4:24 PM','::1',0,'2026-09-21 10:54:49','2026-09-21 10:54:49',1,0,NULL,NULL,0,'CHECKED_IN'),(33,1,'2026-10-08','2026-10-08 06:06:30',NULL,0.00,'PRESENT','Late login at 11:36 AM','::1',0,'2026-10-08 06:06:30','2026-10-08 06:06:30',1,0,NULL,NULL,0,'CHECKED_IN'),(34,1,'2026-10-10','2026-10-10 06:50:17',NULL,0.00,'PRESENT','Late login at 12:20 PM','::1',0,'2026-10-10 06:50:17','2026-10-10 06:50:17',1,0,NULL,NULL,0,'CHECKED_IN'),(35,24,'2026-10-10','2026-10-10 06:54:35',NULL,0.00,'PRESENT','Late login at 12:24 PM','::1',0,'2026-10-10 06:54:35','2026-10-10 06:54:35',1,0,NULL,NULL,0,'CHECKED_IN'),(36,1,'2026-10-21','2026-10-21 09:21:37',NULL,0.00,'PRESENT','Late login at 2:51 PM','::1',0,'2026-10-21 09:21:37','2026-10-21 09:21:37',1,0,NULL,NULL,0,'CHECKED_IN'),(37,25,'2026-10-21','2026-10-21 09:50:08',NULL,0.00,'PRESENT','Late login at 3:20 PM','::1',0,'2026-10-21 09:50:08','2026-10-21 09:50:08',1,0,NULL,NULL,0,'CHECKED_IN');
/*!40000 ALTER TABLE `attendances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `branches`
--

DROP TABLE IF EXISTS `branches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branches` (
  `id` int NOT NULL AUTO_INCREMENT,
  `branch_code` varchar(50) NOT NULL,
  `branch_name` varchar(191) NOT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) DEFAULT NULL,
  `address` text,
  `phone` varchar(30) DEFAULT NULL,
  `email` varchar(191) DEFAULT NULL,
  `branch_head_id` int DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `branches_branch_code_unique` (`branch_code`),
  KEY `branch_head_id` (`branch_head_id`),
  CONSTRAINT `branches_ibfk_1` FOREIGN KEY (`branch_head_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branches`
--

LOCK TABLES `branches` WRITE;
/*!40000 ALTER TABLE `branches` DISABLE KEYS */;
INSERT INTO `branches` VALUES (1,'BR-VNS','Vaidimi Corporate HQ & Main Office (Varanasi)','Varanasi','Uttar Pradesh','Vaidimi Tech Center, Sigra / Cantt, Varanasi, Uttar Pradesh - 221002','+91 542 2500 123','info@vaidimiconsulting.in',9,1,'2026-09-19 11:26:07','2026-09-19 11:45:38'),(2,'BR-NOI','Noida Tech Development Hub','Noida','Uttar Pradesh','Plot 14, Electronic City, Sector 62, Noida','+91 120 4567 890','noida.hub@vaidimi.com',NULL,0,'2026-09-19 11:26:07','2026-09-19 11:43:08'),(3,'BR-LKO','Lucknow Operations Hub','Lucknow','Uttar Pradesh','Vibhuti Khand, Gomti Nagar, Lucknow','+91 522 4567 890','lucknow.hub@vaidimi.com',NULL,1,'2026-09-19 11:26:07','2026-09-19 11:26:07'),(5,'BR-DEL','Delhi Regional Center (Future Expansion)','Delhi NCR','Delhi','Connaught Place, New Delhi','+91 11 4567 8900','delhi.office@vaidimi.com',NULL,1,'2026-09-19 11:45:38','2026-09-19 11:45:38');
/*!40000 ALTER TABLE `branches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_conversations`
--

DROP TABLE IF EXISTS `chat_conversations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_conversations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` enum('DIRECT','GROUP') NOT NULL DEFAULT 'DIRECT',
  `title` varchar(191) DEFAULT NULL,
  `description` text,
  `category` enum('PROJECT','INTERN','DEPARTMENT','GENERAL','DIRECT') NOT NULL DEFAULT 'GENERAL',
  `project_id` int DEFAULT NULL,
  `created_by` int NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `last_message_text` text,
  `last_message_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `chat_conversations_ibfk_123` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `chat_conversations_ibfk_124` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_conversations`
--

LOCK TABLES `chat_conversations` WRITE;
/*!40000 ALTER TABLE `chat_conversations` DISABLE KEYS */;
INSERT INTO `chat_conversations` VALUES (1,'GROUP','🏢 Vaidimi All-Hands & Announcements','Company-wide corporate discussions, updates, and workplace collaboration.','GENERAL',NULL,1,NULL,'Welcome team to our official Vaidimi workplace collaboration hub!','2026-09-19 10:57:53','2026-09-19 10:57:53','2026-09-19 10:57:53'),(2,'GROUP','💼 garima Construction — Project Squad','Delivering milestones, sprint tasks, and client requirements for undefined.','PROJECT',4,1,NULL,'Shift policy confirmed: 10:30 AM to 5:30 PM (6 hours net work). Happy working!','2026-09-19 10:57:53','2026-09-19 10:57:53','2026-09-19 11:05:46'),(3,'GROUP','🎓 Internship Program 2026 — Cohort Hub','Mentorship guidance, daily intern standups, assignments, and learning resources.','INTERN',NULL,9,NULL,'Standup update: Interns please share your daily task summary by 4:30 PM.','2026-09-19 10:57:53','2026-09-19 10:57:53','2026-09-19 10:57:53'),(4,'DIRECT',NULL,NULL,'DIRECT',NULL,12,NULL,'Started conversation','2026-09-19 11:10:19','2026-09-19 11:10:19','2026-09-19 11:10:19'),(5,'DIRECT',NULL,NULL,'DIRECT',NULL,12,NULL,'Started conversation','2026-09-21 10:56:09','2026-09-21 10:56:09','2026-09-21 10:56:09'),(6,'DIRECT',NULL,NULL,'DIRECT',NULL,12,NULL,'Started conversation','2026-09-21 10:56:23','2026-09-21 10:56:23','2026-09-21 10:56:23');
/*!40000 ALTER TABLE `chat_conversations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_messages`
--

DROP TABLE IF EXISTS `chat_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `conversation_id` int NOT NULL,
  `sender_id` int NOT NULL,
  `message` text NOT NULL,
  `message_type` enum('TEXT','SYSTEM','ATTACHMENT') DEFAULT 'TEXT',
  `attachment_url` varchar(500) DEFAULT NULL,
  `attachment_name` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `conversation_id` (`conversation_id`),
  KEY `sender_id` (`sender_id`),
  CONSTRAINT `chat_messages_ibfk_123` FOREIGN KEY (`conversation_id`) REFERENCES `chat_conversations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chat_messages_ibfk_124` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_messages`
--

LOCK TABLES `chat_messages` WRITE;
/*!40000 ALTER TABLE `chat_messages` DISABLE KEYS */;
INSERT INTO `chat_messages` VALUES (1,1,1,'👋 Welcome team to our official Vaidimi workplace collaboration hub! Let’s keep high momentum for our deliverables.','TEXT',NULL,NULL,'2026-09-19 10:57:53','2026-09-19 10:57:53'),(2,1,9,'Great initiative! Reminder: Shift timings are 10:30 AM to 5:30 PM with 1-2 PM lunch break. Please maintain on-time logins.','TEXT',NULL,NULL,'2026-09-19 10:57:53','2026-09-19 10:57:53'),(3,2,1,'Project channel initialized for \"undefined\". Let\'s track sprint deliverables here.','SYSTEM',NULL,NULL,'2026-09-19 10:57:53','2026-09-19 10:57:53'),(4,2,10,'Sprint sync: All API endpoints are ready for integration and testing.','TEXT',NULL,NULL,'2026-09-19 10:57:53','2026-09-19 10:57:53'),(5,3,9,'🎓 Welcome to the 2026 Internship Cohort Hub! Mentors will post guidance here.','TEXT',NULL,NULL,'2026-09-19 10:57:53','2026-09-19 10:57:53'),(6,3,9,'Standup update: Interns please share your daily task summary by 4:30 PM.','TEXT',NULL,NULL,'2026-09-19 10:57:53','2026-09-19 10:57:53'),(7,2,1,'Live presence & chat test verified!','TEXT',NULL,NULL,'2026-09-19 10:59:13','2026-09-19 10:59:13'),(8,2,1,'Shift policy confirmed: 10:30 AM to 5:30 PM (6 hours net work). Happy working!','TEXT',NULL,NULL,'2026-09-19 11:05:46','2026-09-19 11:05:46');
/*!40000 ALTER TABLE `chat_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_participants`
--

DROP TABLE IF EXISTS `chat_participants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_participants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `conversation_id` int NOT NULL,
  `user_id` int NOT NULL,
  `role` enum('ADMIN','MEMBER') DEFAULT 'MEMBER',
  `last_read_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `chat_participants_conversation_id_user_id` (`conversation_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `chat_participants_ibfk_123` FOREIGN KEY (`conversation_id`) REFERENCES `chat_conversations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chat_participants_ibfk_124` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_participants`
--

LOCK TABLES `chat_participants` WRITE;
/*!40000 ALTER TABLE `chat_participants` DISABLE KEYS */;
INSERT INTO `chat_participants` VALUES (1,1,1,'ADMIN','2026-09-19 10:57:53','2026-09-19 10:57:53','2026-09-19 10:57:53'),(2,1,9,'MEMBER','2026-09-19 10:57:53','2026-09-19 10:57:53','2026-09-19 10:57:53'),(3,1,10,'MEMBER','2026-09-19 10:57:53','2026-09-19 10:57:53','2026-09-19 10:57:53'),(4,1,12,'MEMBER','2026-09-21 10:55:58','2026-09-19 10:57:53','2026-09-21 10:55:58'),(5,1,13,'MEMBER','2026-09-19 10:57:53','2026-09-19 10:57:53','2026-09-19 10:57:53'),(6,1,14,'MEMBER','2026-09-19 10:57:53','2026-09-19 10:57:53','2026-09-19 10:57:53'),(7,2,1,'ADMIN','2026-09-21 10:51:03','2026-09-19 10:57:53','2026-09-21 10:51:03'),(8,2,9,'MEMBER','2026-09-19 10:57:53','2026-09-19 10:57:53','2026-09-19 10:57:53'),(9,2,10,'MEMBER','2026-09-19 10:57:53','2026-09-19 10:57:53','2026-09-19 10:57:53'),(10,2,12,'MEMBER','2026-09-19 11:10:17','2026-09-19 10:57:53','2026-09-19 11:10:17'),(11,2,13,'MEMBER','2026-09-19 10:57:53','2026-09-19 10:57:53','2026-09-19 10:57:53'),(12,3,1,'MEMBER','2026-09-19 10:57:53','2026-09-19 10:57:53','2026-09-19 10:57:53'),(13,3,9,'ADMIN','2026-09-19 10:57:53','2026-09-19 10:57:53','2026-09-19 10:57:53'),(14,3,10,'MEMBER','2026-09-19 10:57:53','2026-09-19 10:57:53','2026-09-19 10:57:53'),(15,3,12,'MEMBER','2026-09-21 10:55:56','2026-09-19 10:57:53','2026-09-21 10:55:56'),(16,4,12,'MEMBER','2026-09-21 11:10:49','2026-09-19 11:10:19','2026-09-21 11:10:49'),(17,4,9,'MEMBER',NULL,'2026-09-19 11:10:19','2026-09-19 11:10:19'),(18,5,12,'MEMBER','2026-09-21 10:56:17','2026-09-21 10:56:09','2026-09-21 10:56:17'),(19,5,1,'MEMBER',NULL,'2026-09-21 10:56:09','2026-09-21 10:56:09'),(20,6,12,'MEMBER','2026-09-21 12:03:22','2026-09-21 10:56:23','2026-09-21 12:03:22'),(21,6,10,'MEMBER',NULL,'2026-09-21 10:56:23','2026-09-21 10:56:23');
/*!40000 ALTER TABLE `chat_participants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company_events`
--

DROP TABLE IF EXISTS `company_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company_events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) NOT NULL,
  `description` text,
  `event_type` enum('EVENT','MEETING','HOLIDAY','TRAINING','ANNOUNCEMENT') NOT NULL DEFAULT 'EVENT',
  `start_date` datetime NOT NULL,
  `end_date` datetime DEFAULT NULL,
  `is_all_day` tinyint(1) NOT NULL DEFAULT '1',
  `location` varchar(191) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `company_events_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_events`
--

LOCK TABLES `company_events` WRITE;
/*!40000 ALTER TABLE `company_events` DISABLE KEYS */;
INSERT INTO `company_events` VALUES (1,'Corporate Q3 Strategic Business Review & All-Hands','Review of enterprise portfolio performance, client achievements, and Q4 organizational roadmaps.','MEETING','2026-09-22 04:30:00','2026-09-22 07:30:00',0,'Corporate HQ Main Boardroom & Virtual Stream',1,'2026-09-16 04:39:46','2026-09-16 04:39:46'),(2,'Corporate Innovation & Cloud Architecture Workshop','Hands-on technical upskilling on microservices scalability and security compliance.','TRAINING','2026-09-28 08:30:00','2026-09-28 12:00:00',0,'Tech Training Lab A, Corporate Office',1,'2026-09-16 04:39:46','2026-09-16 04:39:46'),(3,'Corporate Townhall & Monthly Star Performer Awards','Monthly recognition of outstanding contributors across Engineering, HR, and Operations.','ANNOUNCEMENT','2026-09-30 10:30:00','2026-09-30 12:30:00',0,'Corporate Office Amphitheater',1,'2026-09-16 04:39:46','2026-09-16 04:39:46'),(4,'Vaidimi Client Showcase & Networking Gala','Hosting key strategic enterprise partners and executive stakeholders.','EVENT','2026-10-14 11:30:00','2026-10-14 15:30:00',0,'Taj Corporate Banquet Hall',1,'2026-09-16 04:39:46','2026-09-16 04:39:46'),(5,'Corporate Annual Gala & Vaidimi Excellence Awards 2026','Annual corporate celebration honoring company growth, team milestones, and leadership success.','EVENT','2026-12-18 12:30:00','2026-12-18 17:30:00',0,'Grand Ballroom, Corporate Convention Center',1,'2026-09-16 04:39:46','2026-09-16 04:39:46');
/*!40000 ALTER TABLE `company_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company_settings`
--

DROP TABLE IF EXISTS `company_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company_settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `key` varchar(100) NOT NULL,
  `value` text NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key` (`key`),
  UNIQUE KEY `key_2` (`key`),
  UNIQUE KEY `key_3` (`key`),
  UNIQUE KEY `key_4` (`key`),
  UNIQUE KEY `key_5` (`key`),
  UNIQUE KEY `key_6` (`key`),
  UNIQUE KEY `key_7` (`key`),
  UNIQUE KEY `key_8` (`key`),
  UNIQUE KEY `key_9` (`key`),
  UNIQUE KEY `key_10` (`key`),
  UNIQUE KEY `key_11` (`key`),
  UNIQUE KEY `key_12` (`key`),
  UNIQUE KEY `key_13` (`key`),
  UNIQUE KEY `key_14` (`key`),
  UNIQUE KEY `key_15` (`key`),
  UNIQUE KEY `key_16` (`key`),
  UNIQUE KEY `key_17` (`key`),
  UNIQUE KEY `key_18` (`key`),
  UNIQUE KEY `key_19` (`key`),
  UNIQUE KEY `key_20` (`key`),
  UNIQUE KEY `key_21` (`key`),
  UNIQUE KEY `key_22` (`key`),
  UNIQUE KEY `key_23` (`key`),
  UNIQUE KEY `key_24` (`key`),
  UNIQUE KEY `key_25` (`key`),
  UNIQUE KEY `key_26` (`key`),
  UNIQUE KEY `key_27` (`key`),
  UNIQUE KEY `key_28` (`key`),
  UNIQUE KEY `key_29` (`key`),
  UNIQUE KEY `key_30` (`key`),
  UNIQUE KEY `key_31` (`key`),
  UNIQUE KEY `key_32` (`key`),
  UNIQUE KEY `key_33` (`key`),
  UNIQUE KEY `key_34` (`key`),
  UNIQUE KEY `key_35` (`key`),
  UNIQUE KEY `key_36` (`key`),
  UNIQUE KEY `key_37` (`key`),
  UNIQUE KEY `key_38` (`key`),
  UNIQUE KEY `key_39` (`key`),
  UNIQUE KEY `key_40` (`key`),
  UNIQUE KEY `key_41` (`key`),
  UNIQUE KEY `key_42` (`key`),
  UNIQUE KEY `key_43` (`key`),
  UNIQUE KEY `key_44` (`key`),
  UNIQUE KEY `key_45` (`key`),
  UNIQUE KEY `key_46` (`key`),
  UNIQUE KEY `key_47` (`key`),
  UNIQUE KEY `key_48` (`key`),
  UNIQUE KEY `key_49` (`key`),
  UNIQUE KEY `key_50` (`key`),
  UNIQUE KEY `key_51` (`key`),
  UNIQUE KEY `key_52` (`key`),
  UNIQUE KEY `key_53` (`key`),
  UNIQUE KEY `key_54` (`key`),
  UNIQUE KEY `key_55` (`key`),
  UNIQUE KEY `key_56` (`key`),
  UNIQUE KEY `key_57` (`key`),
  UNIQUE KEY `key_58` (`key`),
  UNIQUE KEY `key_59` (`key`),
  UNIQUE KEY `key_60` (`key`),
  UNIQUE KEY `key_61` (`key`),
  UNIQUE KEY `key_62` (`key`),
  UNIQUE KEY `key_63` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_settings`
--

LOCK TABLES `company_settings` WRITE;
/*!40000 ALTER TABLE `company_settings` DISABLE KEYS */;
INSERT INTO `company_settings` VALUES (1,'office_start_time','10:00','Office shift official start time (10:00 AM)','2026-09-16 10:27:54','2026-09-21 11:32:59'),(2,'office_grace_end_time','11:00','On-time login window end time (Late after this)','2026-09-16 10:27:54','2026-09-19 10:46:53'),(5,'office_end_time','17:30','Office shift official end time','2026-09-19 10:46:53','2026-09-19 10:46:53'),(6,'break_start_time','13:00','Break start time','2026-09-19 10:46:53','2026-09-19 10:46:53'),(7,'break_end_time','14:00','Break end time','2026-09-19 10:46:53','2026-09-19 10:46:53'),(8,'work_hours_standard','6.0','Standard net work hours per day','2026-09-19 10:46:53','2026-09-19 10:46:53');
/*!40000 ALTER TABLE `company_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `department_name` varchar(100) NOT NULL,
  `description` text,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `departments_department_name_unique` (`department_name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,'Engineering & Development','Software architecture, backend, frontend, and DevOps.','2026-09-15 13:03:20','2026-09-15 13:03:20'),(2,'Quality Assurance','Testing, automation, performance, and bug tracking.','2026-09-15 13:03:20','2026-09-15 13:03:20'),(3,'Human Resources','Talent recruitment, company culture, and employee welfare.','2026-09-15 13:03:20','2026-09-15 13:03:20'),(4,'UI/UX Design','User interface design, branding, and design systems.','2026-09-15 13:03:20','2026-09-15 13:03:20'),(5,'Sales & Marketing','Client partnerships, growth, and brand communication.','2026-09-15 13:03:20','2026-09-15 13:03:20'),(6,'Customer Care & Operations','Customer support, client care, and operations executive team','2026-09-19 11:59:49','2026-09-19 11:59:49');
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `employee_code` varchar(50) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(191) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `profile_photo` longtext,
  `gender` enum('MALE','FEMALE','OTHER','PREFER_NOT_TO_SAY') DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `designation` varchar(100) NOT NULL DEFAULT 'Associate',
  `department_id` int DEFAULT NULL,
  `employment_type` enum('EMPLOYEE','INTERN') NOT NULL DEFAULT 'EMPLOYEE',
  `joining_date` date NOT NULL,
  `internship_start_date` date DEFAULT NULL,
  `internship_end_date` date DEFAULT NULL,
  `reporting_manager_id` int DEFAULT NULL,
  `skills` text,
  `status` enum('ACTIVE','ON_LEAVE','INACTIVE','RESIGNED','COMPLETED_INTERNSHIP') NOT NULL DEFAULT 'ACTIVE',
  `address` text,
  `emergency_contact` varchar(100) DEFAULT NULL,
  `college` varchar(191) DEFAULT NULL,
  `course` varchar(191) DEFAULT NULL,
  `mentor_id` int DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `base_salary` decimal(10,2) NOT NULL DEFAULT '30000.00',
  `father_name` varchar(150) DEFAULT NULL,
  `mother_name` varchar(150) DEFAULT NULL,
  `blood_group` varchar(10) DEFAULT NULL,
  `aadhar_number` varchar(20) DEFAULT NULL,
  `permanent_address` text,
  `religion` varchar(50) DEFAULT NULL,
  `marital_status` varchar(50) DEFAULT NULL,
  `medical_conditions` text,
  `allergies` varchar(255) DEFAULT NULL,
  `insurance_policy_number` varchar(100) DEFAULT NULL,
  `insurance_provider` varchar(100) DEFAULT NULL,
  `emergency_doctor_name` varchar(150) DEFAULT NULL,
  `emergency_doctor_phone` varchar(50) DEFAULT NULL,
  `health_status` varchar(50) DEFAULT 'FIT_FOR_DUTY',
  `highest_qualification` varchar(100) DEFAULT NULL,
  `education_field` varchar(100) DEFAULT NULL,
  `passing_year` varchar(20) DEFAULT NULL,
  `percentage_cgpa` varchar(50) DEFAULT NULL,
  `education_details` text,
  `branch_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `employees_employee_code_unique` (`employee_code`),
  UNIQUE KEY `employees_email_unique` (`email`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `department_id` (`department_id`),
  KEY `reporting_manager_id` (`reporting_manager_id`),
  KEY `mentor_id` (`mentor_id`),
  KEY `branch_id` (`branch_id`),
  CONSTRAINT `employees_ibfk_952` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `employees_ibfk_953` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `employees_ibfk_954` FOREIGN KEY (`reporting_manager_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `employees_ibfk_955` FOREIGN KEY (`mentor_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `employees_ibfk_956` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (1,1,'EMP-001','Gargi','Singh','gargi@vidimiconsulting.com','9876543210','https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80','FEMALE','1988-04-12','Director & Head of Operations (Admin)',3,'EMPLOYEE','2021-01-15',NULL,NULL,NULL,'Updated skills','ACTIVE','',NULL,'','',NULL,'2026-09-15 13:03:20','2026-10-21 10:57:51',30000.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'','',NULL,NULL,NULL,NULL,'FIT_FOR_DUTY','Graduation (B.Tech, BCA, B.Sc, B.Com, BBA)','Computer Applications & IT','','','',1),(9,9,'VC2202','Vineet','Kumar','vineet.kumar@vaidimi.com','+91 9876543210',NULL,'MALE','1992-08-20','Relationship Manager',3,'EMPLOYEE','2022-03-01',NULL,NULL,NULL,'HR Operations, Talent Acquisition, Employee Welfare, Performance Management','ACTIVE',NULL,NULL,NULL,NULL,NULL,'2026-09-16 10:27:54','2026-09-19 11:59:50',30000.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'FIT_FOR_DUTY',NULL,NULL,NULL,NULL,NULL,1),(10,13,'VC2203','Madhu','Prajapati','madhu.prajapati@vaidimi.com','9876543299',NULL,'FEMALE',NULL,'Software Developer',1,'EMPLOYEE','2026-09-16',NULL,NULL,NULL,NULL,'ACTIVE',NULL,NULL,NULL,NULL,NULL,'2026-09-16 10:33:23','2026-09-19 11:59:50',32000.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'FIT_FOR_DUTY',NULL,NULL,NULL,NULL,NULL,1),(12,12,'VC2204','Varsha','Srivastav','varsha.srivastav@vaidimi.com','9876543210',NULL,'FEMALE',NULL,'Software Developer',1,'EMPLOYEE','2026-09-16',NULL,NULL,NULL,'Full Stack, React, Node.js','ACTIVE',NULL,'9876543211',NULL,NULL,NULL,'2026-09-16 11:16:03','2026-09-19 11:59:50',35000.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'FIT_FOR_DUTY',NULL,NULL,NULL,NULL,NULL,1),(13,14,'EMP-004','Aryan','Tiwari','aryan.tiwari@vaidimi.com',NULL,NULL,'MALE',NULL,'Frontend Developer',3,'EMPLOYEE','2026-09-16',NULL,NULL,NULL,NULL,'ACTIVE',NULL,NULL,NULL,NULL,NULL,'2026-09-16 11:16:03','2026-09-19 11:26:07',62000.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'FIT_FOR_DUTY',NULL,NULL,NULL,NULL,NULL,1),(20,21,'EMP-006','Pooja','Verma','pooja.verma@vaidimi.com','9876543299',NULL,NULL,NULL,'HR',NULL,'EMPLOYEE','2026-09-19',NULL,NULL,NULL,NULL,'ACTIVE',NULL,NULL,NULL,NULL,NULL,'2026-09-19 11:37:01','2026-09-19 11:37:01',30000.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'FIT_FOR_DUTY',NULL,NULL,NULL,NULL,NULL,2),(21,22,'VC2201','Mayank','Pandey','mayank.pandey@vaidimi.com','9876500001',NULL,'MALE',NULL,'Marketing Head',5,'EMPLOYEE','2025-01-01',NULL,NULL,NULL,NULL,'ACTIVE',NULL,NULL,NULL,NULL,NULL,'2026-09-19 11:59:50','2026-09-19 11:59:50',30000.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'FIT_FOR_DUTY',NULL,NULL,NULL,NULL,NULL,1),(22,23,'VC2205','Himanshu','Kannaujiya','himanshu.kannaujiya@vaidimi.com','9876500005',NULL,'MALE',NULL,'Care Executive',6,'EMPLOYEE','2025-01-01',NULL,NULL,NULL,NULL,'ACTIVE',NULL,NULL,NULL,NULL,NULL,'2026-09-19 11:59:50','2026-09-19 11:59:50',30000.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'FIT_FOR_DUTY',NULL,NULL,NULL,NULL,NULL,1),(24,25,'EMP-009','Muskan','Singh','muskan@gmail.com','8783982610',NULL,'FEMALE','2003-07-10','Junior Software Developer',1,'EMPLOYEE','2026-10-10',NULL,NULL,NULL,'Full stack ','ACTIVE','Sudhipur Varansi','9876543223',NULL,'Computer Application',NULL,'2026-10-10 06:53:23','2026-10-10 06:53:23',10500.00,'Siddharth','Katrina','O+','987654322345','Varansi ','Hindu','SINGLE',NULL,NULL,NULL,NULL,NULL,NULL,'FIT_FOR_DUTY','Graduation','Engineering & Technology',NULL,NULL,NULL,1),(25,26,'ADM-001','Admin','Vaidimi','admin@vaidimiconsulting.in','9876543210',NULL,NULL,NULL,'System Administrator (Super Admin)',NULL,'EMPLOYEE','2021-01-01',NULL,NULL,NULL,NULL,'ACTIVE',NULL,NULL,NULL,NULL,NULL,'2026-10-21 09:49:20','2026-10-21 09:49:20',50000.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'FIT_FOR_DUTY',NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `holidays`
--

DROP TABLE IF EXISTS `holidays`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `holidays` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,
  `date` date NOT NULL,
  `is_paid` tinyint(1) NOT NULL DEFAULT '1',
  `applicable_to` varchar(50) NOT NULL DEFAULT 'ALL',
  `description` text,
  `year` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `holidays_date` (`date`),
  KEY `holidays_year` (`year`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `holidays`
--

LOCK TABLES `holidays` WRITE;
/*!40000 ALTER TABLE `holidays` DISABLE KEYS */;
INSERT INTO `holidays` VALUES (2,'New Year\'s Day','2026-01-01',1,'ALL','Verified holiday edit.',2026,'2026-09-16 04:39:46','2026-09-17 07:55:10'),(3,'Republic Day','2026-01-26',1,'ALL','National Republic Day Celebration',2026,'2026-09-16 04:39:46','2026-09-16 04:39:46'),(4,'Maha Shivratri','2026-02-15',1,'ALL','Festival of Lord Shiva',2026,'2026-09-16 04:39:46','2026-09-16 04:39:46'),(5,'Holi (Festival of Colors)','2026-03-04',1,'ALL','Spring Festival Celebration',2026,'2026-09-16 04:39:46','2026-09-16 04:39:46'),(6,'Eid-ul-Fitr','2026-03-20',1,'ALL','Islamic Festival of Celebration',2026,'2026-09-16 04:39:46','2026-09-16 04:39:46'),(7,'Good Friday','2026-04-03',1,'ALL','Christian Observance Day',2026,'2026-09-16 04:39:46','2026-09-16 04:39:46'),(8,'Independence Day','2026-08-15',1,'ALL','National Independence Day Observance',2026,'2026-09-16 04:39:46','2026-09-16 04:39:46'),(9,'Raksha Bandhan','2026-08-28',1,'ALL','Festival of Sibling Bonds',2026,'2026-09-16 04:39:46','2026-09-16 04:39:46'),(10,'Janmashtami','2026-09-04',1,'ALL','Lord Krishna Janmotsav',2026,'2026-09-16 04:39:46','2026-09-16 04:39:46'),(11,'Gandhi Jayanti','2026-10-02',1,'ALL','Father of the Nation Birthday',2026,'2026-09-16 04:39:46','2026-09-16 04:39:46'),(12,'Dussehra (Vijayadashami)','2026-10-20',1,'ALL','Triumph of Light over Darkness',2026,'2026-09-16 04:39:46','2026-09-16 04:39:46'),(13,'Diwali (Deepavali)','2026-11-08',1,'ALL','Corporate Festival of Lights Celebration',2026,'2026-09-16 04:39:46','2026-09-16 04:39:46'),(14,'Govardhan Puja','2026-11-09',1,'ALL','Post-Diwali Festivity',2026,'2026-09-16 04:39:46','2026-09-16 04:39:46'),(15,'Guru Nanak Jayanti','2026-11-24',1,'ALL','Sikh Guru Observance Day',2026,'2026-09-16 04:39:46','2026-09-16 04:39:46'),(16,'Christmas Day','2026-12-25',1,'ALL','Corporate Winter Christmas Holiday',2026,'2026-09-16 04:39:46','2026-09-16 04:39:46');
/*!40000 ALTER TABLE `holidays` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leave_balances`
--

DROP TABLE IF EXISTS `leave_balances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leave_balances` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `leave_type` varchar(50) NOT NULL,
  `year` int NOT NULL,
  `total_days` decimal(4,1) NOT NULL,
  `used_days` decimal(4,1) NOT NULL DEFAULT '0.0',
  `pending_days` decimal(4,1) NOT NULL DEFAULT '0.0',
  `remaining_days` decimal(4,1) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_employee_leave_type_year` (`employee_id`,`leave_type`,`year`),
  CONSTRAINT `leave_balances_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leave_balances`
--

LOCK TABLES `leave_balances` WRITE;
/*!40000 ALTER TABLE `leave_balances` DISABLE KEYS */;
INSERT INTO `leave_balances` VALUES (7,1,'PAID_LEAVE',2026,14.0,0.0,0.0,14.0,'2026-09-15 15:35:27','2026-09-19 11:45:38'),(8,1,'SICK_LEAVE',2026,24.0,0.0,0.0,24.0,'2026-09-15 15:35:27','2026-09-19 11:45:38'),(9,1,'CASUAL_LEAVE',2026,6.0,0.0,0.0,6.0,'2026-09-15 15:35:27','2026-09-16 11:57:28'),(10,1,'FESTIVAL_LEAVE',2026,3.0,0.0,0.0,3.0,'2026-09-15 15:35:27','2026-09-16 11:57:28'),(11,1,'MENSTRUAL_LEAVE',2026,12.0,0.0,0.0,12.0,'2026-09-15 15:35:27','2026-09-19 11:45:38'),(12,1,'UNPAID_LEAVE',2026,999.0,0.0,0.0,999.0,'2026-09-15 15:35:27','2026-09-16 11:57:28'),(25,10,'PAID_LEAVE',2026,14.0,0.0,0.0,14.0,'2026-09-16 11:10:22','2026-09-19 11:59:50'),(26,10,'SICK_LEAVE',2026,24.0,0.0,0.0,24.0,'2026-09-16 11:10:22','2026-09-19 11:59:50'),(27,10,'CASUAL_LEAVE',2026,7.0,0.0,0.0,7.0,'2026-09-16 11:10:22','2026-09-19 11:59:50'),(28,10,'FESTIVAL_LEAVE',2026,5.0,0.0,0.0,5.0,'2026-09-16 11:10:22','2026-09-19 11:59:50'),(29,10,'MENSTRUAL_LEAVE',2026,12.0,0.0,0.0,12.0,'2026-09-16 11:10:22','2026-09-19 11:59:50'),(30,10,'UNPAID_LEAVE',2026,999.0,0.0,0.0,999.0,'2026-09-16 11:10:22','2026-09-16 11:57:28'),(31,12,'PAID_LEAVE',2026,14.0,0.0,0.0,14.0,'2026-09-16 11:45:31','2026-09-19 11:59:50'),(32,12,'SICK_LEAVE',2026,24.0,0.0,0.0,24.0,'2026-09-16 11:45:31','2026-09-19 11:59:50'),(33,12,'CASUAL_LEAVE',2026,7.0,0.0,0.0,7.0,'2026-09-16 11:45:31','2026-09-19 11:59:50'),(34,12,'FESTIVAL_LEAVE',2026,5.0,0.0,0.0,5.0,'2026-09-16 11:45:31','2026-09-19 11:59:50'),(35,12,'MENSTRUAL_LEAVE',2026,12.0,0.0,0.0,12.0,'2026-09-16 11:45:31','2026-09-19 11:59:50'),(36,12,'UNPAID_LEAVE',2026,999.0,0.0,0.0,999.0,'2026-09-16 11:45:31','2026-09-16 11:57:28'),(37,13,'PAID_LEAVE',2026,14.0,0.0,0.0,14.0,'2026-09-16 11:57:18','2026-09-19 11:45:38'),(38,13,'SICK_LEAVE',2026,24.0,0.0,0.0,24.0,'2026-09-16 11:57:18','2026-09-19 11:45:38'),(39,13,'CASUAL_LEAVE',2026,6.0,0.0,0.0,6.0,'2026-09-16 11:57:18','2026-09-16 11:57:28'),(40,13,'FESTIVAL_LEAVE',2026,3.0,0.0,0.0,3.0,'2026-09-16 11:57:18','2026-09-16 11:57:28'),(41,13,'UNPAID_LEAVE',2026,999.0,0.0,0.0,999.0,'2026-09-16 11:57:18','2026-09-16 11:57:28'),(42,9,'PAID_LEAVE',2026,14.0,0.0,0.0,14.0,'2026-09-19 11:45:38','2026-09-19 11:59:50'),(43,9,'SICK_LEAVE',2026,24.0,0.0,0.0,24.0,'2026-09-19 11:45:38','2026-09-19 11:59:50'),(44,20,'PAID_LEAVE',2026,14.0,0.0,0.0,14.0,'2026-09-19 11:45:38','2026-09-19 11:45:38'),(45,20,'SICK_LEAVE',2026,24.0,0.0,0.0,24.0,'2026-09-19 11:45:38','2026-09-19 11:45:38'),(46,21,'PAID_LEAVE',2026,14.0,0.0,0.0,14.0,'2026-09-19 11:59:50','2026-09-19 11:59:50'),(47,21,'SICK_LEAVE',2026,24.0,0.0,0.0,24.0,'2026-09-19 11:59:50','2026-09-19 11:59:50'),(48,21,'CASUAL_LEAVE',2026,7.0,0.0,0.0,7.0,'2026-09-19 11:59:50','2026-09-19 11:59:50'),(49,21,'FESTIVAL_LEAVE',2026,5.0,0.0,0.0,5.0,'2026-09-19 11:59:50','2026-09-19 11:59:50'),(50,9,'CASUAL_LEAVE',2026,7.0,0.0,0.0,7.0,'2026-09-19 11:59:50','2026-09-19 11:59:50'),(51,9,'FESTIVAL_LEAVE',2026,5.0,0.0,0.0,5.0,'2026-09-19 11:59:50','2026-09-19 11:59:50'),(52,22,'PAID_LEAVE',2026,14.0,0.0,0.0,14.0,'2026-09-19 11:59:50','2026-09-19 11:59:50'),(53,22,'SICK_LEAVE',2026,24.0,0.0,0.0,24.0,'2026-09-19 11:59:50','2026-09-19 11:59:50'),(54,22,'CASUAL_LEAVE',2026,7.0,0.0,0.0,7.0,'2026-09-19 11:59:50','2026-09-19 11:59:50'),(55,22,'FESTIVAL_LEAVE',2026,5.0,0.0,0.0,5.0,'2026-09-19 11:59:50','2026-09-19 11:59:50');
/*!40000 ALTER TABLE `leave_balances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leave_requests`
--

DROP TABLE IF EXISTS `leave_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leave_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `leave_type` enum('PAID_LEAVE','UNPAID_LEAVE','SICK_LEAVE','CASUAL_LEAVE','FESTIVAL_LEAVE','MENSTRUAL_LEAVE') NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `total_days` decimal(4,1) NOT NULL,
  `is_half_day` tinyint(1) NOT NULL DEFAULT '0',
  `reason` text NOT NULL,
  `status` enum('PENDING','APPROVED','REJECTED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  `reviewed_by` int DEFAULT NULL,
  `reviewed_at` datetime DEFAULT NULL,
  `admin_remarks` text,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `leave_requests_employee_id` (`employee_id`),
  KEY `leave_requests_status` (`status`),
  KEY `leave_requests_start_date_end_date` (`start_date`,`end_date`),
  KEY `reviewed_by` (`reviewed_by`),
  CONSTRAINT `leave_requests_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `leave_requests_ibfk_2` FOREIGN KEY (`reviewed_by`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leave_requests`
--

LOCK TABLES `leave_requests` WRITE;
/*!40000 ALTER TABLE `leave_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `leave_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leave_types`
--

DROP TABLE IF EXISTS `leave_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leave_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `default_days` decimal(4,1) NOT NULL DEFAULT '12.0',
  `is_paid` tinyint(1) NOT NULL DEFAULT '1',
  `is_sensitive` tinyint(1) NOT NULL DEFAULT '0',
  `description` text,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `code_2` (`code`),
  UNIQUE KEY `code_3` (`code`),
  UNIQUE KEY `code_4` (`code`),
  UNIQUE KEY `code_5` (`code`),
  UNIQUE KEY `code_6` (`code`),
  UNIQUE KEY `code_7` (`code`),
  UNIQUE KEY `code_8` (`code`),
  UNIQUE KEY `code_9` (`code`),
  UNIQUE KEY `code_10` (`code`),
  UNIQUE KEY `code_11` (`code`),
  UNIQUE KEY `code_12` (`code`),
  UNIQUE KEY `code_13` (`code`),
  UNIQUE KEY `code_14` (`code`),
  UNIQUE KEY `code_15` (`code`),
  UNIQUE KEY `code_16` (`code`),
  UNIQUE KEY `code_17` (`code`),
  UNIQUE KEY `code_18` (`code`),
  UNIQUE KEY `code_19` (`code`),
  UNIQUE KEY `code_20` (`code`),
  UNIQUE KEY `code_21` (`code`),
  UNIQUE KEY `code_22` (`code`),
  UNIQUE KEY `code_23` (`code`),
  UNIQUE KEY `code_24` (`code`),
  UNIQUE KEY `code_25` (`code`),
  UNIQUE KEY `code_26` (`code`),
  UNIQUE KEY `code_27` (`code`),
  UNIQUE KEY `code_28` (`code`),
  UNIQUE KEY `code_29` (`code`),
  UNIQUE KEY `code_30` (`code`),
  UNIQUE KEY `code_31` (`code`),
  UNIQUE KEY `code_32` (`code`),
  UNIQUE KEY `code_33` (`code`),
  UNIQUE KEY `code_34` (`code`),
  UNIQUE KEY `code_35` (`code`),
  UNIQUE KEY `code_36` (`code`),
  UNIQUE KEY `code_37` (`code`),
  UNIQUE KEY `code_38` (`code`),
  UNIQUE KEY `code_39` (`code`),
  UNIQUE KEY `code_40` (`code`),
  UNIQUE KEY `code_41` (`code`),
  UNIQUE KEY `code_42` (`code`),
  UNIQUE KEY `code_43` (`code`),
  UNIQUE KEY `code_44` (`code`),
  UNIQUE KEY `code_45` (`code`),
  UNIQUE KEY `code_46` (`code`),
  UNIQUE KEY `code_47` (`code`),
  UNIQUE KEY `code_48` (`code`),
  UNIQUE KEY `code_49` (`code`),
  UNIQUE KEY `code_50` (`code`),
  UNIQUE KEY `code_51` (`code`),
  UNIQUE KEY `code_52` (`code`),
  UNIQUE KEY `code_53` (`code`),
  UNIQUE KEY `code_54` (`code`),
  UNIQUE KEY `code_55` (`code`),
  UNIQUE KEY `code_56` (`code`),
  UNIQUE KEY `code_57` (`code`),
  UNIQUE KEY `code_58` (`code`),
  UNIQUE KEY `code_59` (`code`),
  UNIQUE KEY `code_60` (`code`),
  UNIQUE KEY `code_61` (`code`),
  UNIQUE KEY `code_62` (`code`),
  UNIQUE KEY `code_63` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leave_types`
--

LOCK TABLES `leave_types` WRITE;
/*!40000 ALTER TABLE `leave_types` DISABLE KEYS */;
INSERT INTO `leave_types` VALUES (1,'PAID_LEAVE','Paid Leave',14.0,1,0,'Annual Paid Leave (14 days per annum for all staff)','2026-09-15 15:18:45','2026-09-19 11:45:38'),(2,'SICK_LEAVE','Sick Leave',24.0,1,0,'Monthly Sick Leave (Max 2 days per calendar month)','2026-09-15 15:18:45','2026-09-19 11:45:38'),(3,'CASUAL_LEAVE','Casual Leave',6.0,1,0,NULL,'2026-09-15 15:18:45','2026-09-15 15:18:45'),(4,'FESTIVAL_LEAVE','Festival Leave',5.0,1,0,'Festival Leave as per official festive holiday calendar','2026-09-15 15:18:45','2026-09-19 11:45:38'),(5,'MENSTRUAL_LEAVE','Menstrual Leave',12.0,1,1,'Menstrual Period Welfare Leave (12 days per annum for female staff, 1 per month)','2026-09-15 15:18:45','2026-09-19 11:45:38'),(6,'UNPAID_LEAVE','Unpaid Leave',0.0,0,0,NULL,'2026-09-15 15:18:45','2026-09-15 15:18:45');
/*!40000 ALTER TABLE `leave_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `title` varchar(191) NOT NULL,
  `message` text NOT NULL,
  `type` varchar(50) NOT NULL DEFAULT 'SYSTEM',
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `link` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `notifications_user_id_is_read` (`user_id`,`is_read`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payrolls`
--

DROP TABLE IF EXISTS `payrolls`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payrolls` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `month` varchar(7) NOT NULL,
  `base_salary` decimal(10,2) NOT NULL DEFAULT '0.00',
  `total_days` int NOT NULL DEFAULT '30',
  `payable_days` decimal(4,1) NOT NULL DEFAULT '0.0',
  `present_days` decimal(4,1) NOT NULL DEFAULT '0.0',
  `half_days` decimal(4,1) NOT NULL DEFAULT '0.0',
  `absent_days` decimal(4,1) NOT NULL DEFAULT '0.0',
  `paid_leaves` decimal(4,1) NOT NULL DEFAULT '0.0',
  `unpaid_leaves` decimal(4,1) NOT NULL DEFAULT '0.0',
  `sundays_count` int NOT NULL DEFAULT '4',
  `holidays_count` int NOT NULL DEFAULT '0',
  `gross_salary` decimal(10,2) NOT NULL DEFAULT '0.00',
  `deductions` decimal(10,2) NOT NULL DEFAULT '0.00',
  `net_salary` decimal(10,2) NOT NULL DEFAULT '0.00',
  `payment_status` enum('GENERATED','PAID','PENDING') NOT NULL DEFAULT 'GENERATED',
  `payment_date` date DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `sick_leaves` decimal(4,1) NOT NULL DEFAULT '0.0',
  `casual_leaves` decimal(4,1) NOT NULL DEFAULT '0.0',
  `festival_leaves` decimal(4,1) NOT NULL DEFAULT '0.0',
  `menstrual_leaves` decimal(4,1) NOT NULL DEFAULT '0.0',
  `is_sent_to_employee` tinyint(1) NOT NULL DEFAULT '0',
  `sent_at` datetime DEFAULT NULL,
  `bonus` decimal(10,2) NOT NULL DEFAULT '0.00',
  `allowances` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_employee_month_payroll` (`employee_id`,`month`),
  CONSTRAINT `payrolls_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payrolls`
--

LOCK TABLES `payrolls` WRITE;
/*!40000 ALTER TABLE `payrolls` DISABLE KEYS */;
INSERT INTO `payrolls` VALUES (1,1,'2026-09',30000.00,30,6.0,0.0,0.0,24.0,0.0,0.0,4,1,30000.00,24000.00,6000.00,'PAID','2026-09-16','Sundays: 4 paid off, 2nd/4th Sat: 2 half-days, Paid Leaves: 0 (Sick: 0, Casual: 0, Menstrual: 0), Unpaid: 0.','2026-09-16 11:04:05','2026-09-16 11:45:31',0.0,0.0,0.0,0.0,0,NULL,0.00,0.00),(2,9,'2026-09',30000.00,30,6.0,0.0,0.0,24.0,0.0,0.0,4,1,30000.00,24000.00,6000.00,'GENERATED',NULL,'Sundays: 4 paid off, 2nd/4th Sat: 2 half-days, Paid Leaves: 0 (Sick: 0, Casual: 0, Menstrual: 0), Unpaid: 0.','2026-09-16 11:04:05','2026-09-16 11:45:31',0.0,0.0,0.0,0.0,0,NULL,0.00,0.00),(3,10,'2026-09',32000.00,30,7.0,1.0,0.0,23.0,0.0,0.0,4,1,32000.00,24533.33,7466.67,'GENERATED',NULL,'Sundays: 4 paid off, 2nd/4th Sat: 2 half-days, Paid Leaves: 0 (Sick: 0, Casual: 0, Menstrual: 0), Unpaid: 0.','2026-09-16 11:04:05','2026-09-16 11:45:31',0.0,0.0,0.0,0.0,0,NULL,0.00,0.00),(4,12,'2026-09',35000.00,30,8.0,1.0,0.0,22.0,1.0,0.0,4,1,36500.00,25666.67,10833.33,'GENERATED',NULL,'Diagnostic CRUD test verified.','2026-09-16 11:27:54','2026-09-21 11:26:22',0.0,0.0,0.0,1.0,0,NULL,1500.00,0.00),(5,13,'2026-09',30000.00,30,7.0,1.0,0.0,23.0,0.0,0.0,4,1,30000.00,23000.00,7000.00,'GENERATED',NULL,'Sundays: 4 paid off, 2nd/4th Sat: 2 half-days, Paid Leaves: 0 (Sick: 0, Casual: 0, Menstrual: 0), Unpaid: 0.','2026-09-16 11:27:54','2026-09-16 11:45:31',0.0,0.0,0.0,0.0,0,NULL,0.00,0.00);
/*!40000 ALTER TABLE `payrolls` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_members`
--

DROP TABLE IF EXISTS `project_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_members` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `employee_id` int NOT NULL,
  `role_in_project` varchar(100) NOT NULL DEFAULT 'Project Contributor',
  `assigned_date` date NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `project_members_employee_id_project_id_unique` (`project_id`,`employee_id`),
  UNIQUE KEY `unique_project_employee_member` (`project_id`,`employee_id`),
  KEY `employee_id` (`employee_id`),
  CONSTRAINT `project_members_ibfk_425` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `project_members_ibfk_426` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_members`
--

LOCK TABLES `project_members` WRITE;
/*!40000 ALTER TABLE `project_members` DISABLE KEYS */;
/*!40000 ALTER TABLE `project_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_milestones`
--

DROP TABLE IF EXISTS `project_milestones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_milestones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `title` varchar(191) NOT NULL,
  `description` text,
  `start_date` date DEFAULT NULL,
  `due_date` date NOT NULL,
  `completion_percentage` int NOT NULL DEFAULT '0',
  `status` enum('NOT_STARTED','IN_PROGRESS','COMPLETED','DELAYED') NOT NULL DEFAULT 'NOT_STARTED',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `project_milestones_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_milestones`
--

LOCK TABLES `project_milestones` WRITE;
/*!40000 ALTER TABLE `project_milestones` DISABLE KEYS */;
/*!40000 ALTER TABLE `project_milestones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_code` varchar(50) NOT NULL,
  `project_name` varchar(191) NOT NULL,
  `client_name` varchar(191) DEFAULT NULL,
  `description` text,
  `technology_stack` varchar(255) DEFAULT NULL,
  `priority` enum('LOW','MEDIUM','HIGH','URGENT') NOT NULL DEFAULT 'MEDIUM',
  `project_manager_id` int DEFAULT NULL,
  `start_date` date NOT NULL,
  `expected_end_date` date NOT NULL,
  `actual_end_date` date DEFAULT NULL,
  `status` enum('NOT_STARTED','PLANNING','IN_PROGRESS','ON_HOLD','COMPLETED','CANCELLED') NOT NULL DEFAULT 'NOT_STARTED',
  `completion_percentage` int NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `branch_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `projects_project_code_unique` (`project_code`),
  KEY `project_manager_id` (`project_manager_id`),
  KEY `branch_id` (`branch_id`),
  CONSTRAINT `projects_ibfk_151` FOREIGN KEY (`project_manager_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `projects_ibfk_152` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (4,'PRJ-001','garima Construction','dvehjngh','Updated test description','mern stack','HIGH',NULL,'2026-09-16','2026-09-23',NULL,'IN_PROGRESS',45,'2026-09-16 07:21:42','2026-09-21 11:24:27',NULL);
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_code` varchar(50) NOT NULL,
  `project_id` int NOT NULL,
  `title` varchar(191) NOT NULL,
  `description` text,
  `assigned_to` int DEFAULT NULL,
  `priority` enum('LOW','MEDIUM','HIGH','URGENT') NOT NULL DEFAULT 'MEDIUM',
  `status` enum('TODO','IN_PROGRESS','COMPLETED','BLOCKED') NOT NULL DEFAULT 'TODO',
  `start_date` date DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `progress_percentage` int NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `completed_at` datetime DEFAULT NULL,
  `completion_notes` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tasks_task_code_unique` (`task_code`),
  KEY `project_id` (`project_id`),
  KEY `assigned_to` (`assigned_to`),
  CONSTRAINT `tasks_ibfk_425` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tasks_ibfk_426` FOREIGN KEY (`assigned_to`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(191) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `saved_password` varchar(255) DEFAULT NULL,
  `reset_otp` varchar(20) DEFAULT NULL,
  `reset_otp_expires_at` datetime DEFAULT NULL,
  `role` enum('ADMIN','HR','MANAGER','EMPLOYEE') NOT NULL DEFAULT 'EMPLOYEE',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `is_online` tinyint(1) DEFAULT '0',
  `last_active_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'gargi@vidimiconsulting.com','$2a$10$UL6W4beW4QviO7B9MN56kOqQQarC4wVdkbfWydty2SL8T5mMx086K','Gargi@2026',NULL,NULL,'ADMIN',1,'2026-09-15 13:03:20','2026-10-21 11:03:44',0,'2026-10-21 11:03:44'),(9,'vineet.kumar@vaidimi.com','$2a$10$hE5Cxouh/CEoADeh89muDuvrI.5L7ndqjV64tWixNMm2pOM8gq2LC','Vineet@2026!',NULL,NULL,'HR',1,'2026-09-16 10:27:54','2026-09-19 12:00:32',1,'2026-09-19 12:00:32'),(10,'rohan.test@vaidimi.com','$2a$10$00jJui9gBnYVNFo/4c.Gj.RPOFBEWqadt4VMkAo9fT6IZWgg6Wh2u','Rohan@2026!',NULL,NULL,'EMPLOYEE',1,'2026-09-16 10:33:23','2026-10-21 10:48:53',1,'2026-10-21 10:48:53'),(12,'varsha.srivastav@vaidimi.com','$2a$10$V4NBW83t.8/X1cy7E3zJ4.qOno3pBHZET2NJuu6N3Cb99rhk5jGKG','Varsha@2026!',NULL,NULL,'EMPLOYEE',1,'2026-09-16 11:16:03','2026-09-21 12:02:49',1,'2026-09-21 12:02:49'),(13,'madhu.prajapati@vaidimi.com','$2a$10$CrvJbO49gTKDvguUl1jfkOytL9jmsydkjgqMlyK8HhLfkD0tDLBIO','Madhu@2026!',NULL,NULL,'EMPLOYEE',1,'2026-09-16 11:16:03','2026-09-19 12:00:32',1,'2026-09-19 12:00:32'),(14,'aryan.tiwari@vaidimi.com','$2a$10$TBp/lqSor7IVAs.cnu3Yk.uMjSGh.Ekjao4UU0mcUqUCqU2KVnRfq','Aryan@2026!',NULL,NULL,'EMPLOYEE',1,'2026-09-16 11:16:03','2026-09-16 11:53:46',0,NULL),(21,'pooja.verma@vaidimi.com','$2a$10$aQL45vWcvUXhxCtYg.P/.eKt3CTQU4yjHxvnScJ3UTu9SuaNs5j8G','Pooja@2026!',NULL,NULL,'HR',1,'2026-09-19 11:37:01','2026-09-19 11:37:01',1,'2026-09-19 11:37:01'),(22,'mayank.pandey@vaidimi.com','$2a$10$Qq/NPQ8IiJNRgJCBeg0mqufT8.dzFdbZoKC4RrHc7VAaHzN2HNaZS','Mayank@2026!',NULL,NULL,'EMPLOYEE',1,'2026-09-19 11:59:50','2026-09-19 12:00:32',1,'2026-09-19 12:00:32'),(23,'himanshu.kannaujiya@vaidimi.com','$2a$10$mkA4VK9yLtHc45R.hNLpEeqodiaBnRxZc.ix2BqSFscf3YYtz64CG','Himanshu@2026!',NULL,NULL,'EMPLOYEE',1,'2026-09-19 11:59:50','2026-09-19 12:00:32',1,'2026-09-19 12:00:32'),(25,'muskan@gmail.com','$2a$10$uOC6Uw2dXxNdMgUGzDULLusZdAFejjxSfklTpVFlojwhy3jKZeob6','Vaidimi@2026!',NULL,NULL,'EMPLOYEE',1,'2026-10-10 06:53:23','2026-10-10 06:58:09',0,'2026-10-10 06:58:09'),(26,'admin@vaidimiconsulting.in','$2a$10$VhMytaJ5j9mGeuRMKwsfX.I.yHhs16SwbHI1wmfpueY.ceqRXFabG','AdminPassword123',NULL,NULL,'ADMIN',1,'2026-10-21 09:49:20','2026-10-21 09:58:08',1,'2026-10-21 09:58:08');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'company_management_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-21 16:36:55
