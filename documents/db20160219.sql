CREATE DATABASE `coffeechat` /*!40100 DEFAULT CHARACTER SET utf8 */;
CREATE TABLE `community_desc` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  `industry` int(11) DEFAULT NULL,
  `adminUserID` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;
CREATE TABLE `company_desc` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  `industry` int(11) NOT NULL,
  `size` int(11) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=utf8;
CREATE TABLE `company_size_desc` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `desc` varchar(256) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8;
CREATE TABLE `company_type_desc` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `desc` varchar(512) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8;
CREATE TABLE `survey_field_desc` (
  `fieldID` int(11) NOT NULL,
  `fieldName` varchar(256) DEFAULT NULL,
  `communityID` int(11) NOT NULL,
  `required` tinyint(1) DEFAULT NULL,
  `macthPriority` tinyint(3) DEFAULT NULL,
  `displayPriority` tinyint(3) DEFAULT NULL,
  `grouped` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`fieldID`,`communityID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE `survey_field_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fieldID` int(11) NOT NULL,
  `group` varchar(256) DEFAULT NULL,
  `name` varchar(256) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3292 DEFAULT CHARSET=utf8;
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
) ENGINE=InnoDB AUTO_INCREMENT=552 DEFAULT CHARSET=utf8;
CREATE TABLE `user_community` (
  `userID` int(11) NOT NULL,
  `communityID` int(11) NOT NULL,
  PRIMARY KEY (`userID`,`communityID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE `user_position` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userID` int(11) NOT NULL,
  `companyID` int(11) NOT NULL,
  `isCurrent` tinyint(1) NOT NULL,
  `startDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  `title` varchar(256) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=252 DEFAULT CHARSET=utf8;
CREATE TABLE `user_survey` (
  `userID` int(11) NOT NULL,
  `communityID` int(11) NOT NULL,
  `fieldID` int(11) NOT NULL,
  `itemID` int(11) NOT NULL,
  PRIMARY KEY (`userID`,`communityID`,`itemID`,`fieldID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
