CREATE DATABASE `coffeechat`;

USE `coffeechat`;

DROP TABLE IF EXISTS `community_desc`;
CREATE TABLE `community_desc` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  `industry` int(11) DEFAULT NULL,
  `adminUserID` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `community_group`;
CREATE TABLE `community_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `communityID` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `communityID` (`communityID`),
  CONSTRAINT `community_group_ibfk_1` FOREIGN KEY (`communityID`) REFERENCES `community_desc` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `company_desc`;
CREATE TABLE `company_desc` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  `industry` int(11) NOT NULL,
  `size` int(11) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `name` (`name`(250))
) ENGINE=InnoDB AUTO_INCREMENT=1171 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `company_size_desc`;
CREATE TABLE `company_size_desc` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `desc` varchar(256) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `company_type_desc`;
CREATE TABLE `company_type_desc` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `desc` varchar(512) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `industry_desc`;
CREATE TABLE `industry_desc` (
  `id` int(11) NOT NULL,
  `group` varchar(128) DEFAULT NULL,
  `name` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `match_feedback_field_desc`;
CREATE TABLE `match_feedback_field_desc` (
  `fieldID` int(11) NOT NULL AUTO_INCREMENT,
  `fieldName` varchar(512) NOT NULL,
  `communityID` int(11) NOT NULL,
  `required` tinyint(1) DEFAULT '0',
  `displayPriority` tinyint(2) DEFAULT NULL,
  `displayType` tinyint(2) DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`fieldID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `match_feedback_field_items`;
CREATE TABLE `match_feedback_field_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fieldID` int(11) DEFAULT NULL,
  `name` varchar(512) DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `survey_field_desc`;
CREATE TABLE `survey_field_desc` (
  `fieldID` int(11) NOT NULL AUTO_INCREMENT,
  `fieldName` varchar(256) DEFAULT NULL,
  `communityID` int(11) DEFAULT NULL,
  `required` tinyint(1) DEFAULT NULL,
  `macthPriority` tinyint(3) DEFAULT NULL,
  `displayPriority` tinyint(3) DEFAULT NULL,
  `displayType` tinyint(2) DEFAULT NULL,
  `grouped` tinyint(1) DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`fieldID`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `survey_field_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `survey_field_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fieldID` int(11) NOT NULL,
  `group` varchar(256) DEFAULT NULL,
  `name` varchar(256) NOT NULL,
  `data` blob,
  `deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4962 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `user_basic`;
CREATE TABLE `user_basic` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(512) DEFAULT NULL,
  `lastName` varchar(512) NOT NULL,
  `email` varchar(255) NOT NULL,
  `headline` varchar(1024) DEFAULT NULL,
  `profilePicS` varchar(1024) DEFAULT NULL,
  `profilePicO` varchar(1024) DEFAULT NULL,
  `industry` int(11) DEFAULT NULL,
  `linkedInProfile` varchar(1024) DEFAULT NULL,
  `linkedInID` varchar(255) DEFAULT NULL,
  `linkedInToken` varchar(1024) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `linkedInID_UNIQUE` (`linkedInID`)
) ENGINE=InnoDB AUTO_INCREMENT=562 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `user_community`;
CREATE TABLE `user_community` (
  `userID` int(11) NOT NULL,
  `communityID` int(11) NOT NULL,
  PRIMARY KEY (`userID`,`communityID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `user_group`;
CREATE TABLE `user_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userID` int(11) DEFAULT NULL,
  `groupID` int(11) DEFAULT NULL,
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_group` (`userID`,`groupID`),
  KEY `groupID` (`groupID`),
  CONSTRAINT `user_group_ibfk_1` FOREIGN KEY (`groupID`) REFERENCES `community_group` (`id`),
  CONSTRAINT `user_group_ibfk_2` FOREIGN KEY (`userID`) REFERENCES `user_basic` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `user_match`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_match` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userA` int(11) NOT NULL,
  `userB` int(11) NOT NULL,
  `communityID` int(11) NOT NULL,
  `userAStatus` tinyint(2) NOT NULL DEFAULT '0',
  `userBStatus` tinyint(2) NOT NULL DEFAULT '0',
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=321 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `user_match_feedback`;
CREATE TABLE `user_match_feedback` (
  `userID` int(11) NOT NULL,
  `matchID` int(11) NOT NULL,
  `communityID` int(11) NOT NULL,
  `fieldID` int(11) NOT NULL,
  `itemID` int(11) NOT NULL,
  PRIMARY KEY (`userID`,`matchID`,`communityID`,`fieldID`,`itemID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `user_position`;
CREATE TABLE `user_position` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userID` int(11) NOT NULL,
  `companyID` int(11) NOT NULL,
  `isCurrent` tinyint(1) NOT NULL,
  `startDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  `title` varchar(256) NOT NULL,
  `isEdu` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=682 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `user_survey`;
CREATE TABLE `user_survey` (
  `userID` int(11) NOT NULL,
  `communityID` int(11) NOT NULL,
  `fieldID` int(11) NOT NULL,
  `itemID` int(11) NOT NULL,
  PRIMARY KEY (`userID`,`communityID`,`itemID`,`fieldID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
