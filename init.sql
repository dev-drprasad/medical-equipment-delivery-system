CREATE TABLE `patient` (
  `accountId` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `firstName` varchar(30) NOT NULL,
  `lastName` varchar(30) NOT NULL,
  `phoneNumber` varchar(15) NOT NULL,
  `address` varchar(255) NULL,
  `zipcode` varchar(10) NULL,
  `birthDate` DATE NULL,
  PRIMARY KEY (`accountId`)
)  AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;

ALTER TABLE `patient` ADD COLUMN  `createdAt` TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP(3) NOT NULL;

CREATE TABLE `insurer` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `address` varchar(255) NOT NULL,
  `city` varchar(30) NOT NULL,
  `zipcode` varchar(10) NOT NULL,
  `phoneNumber` varchar(15) NOT NULL,
  PRIMARY KEY (`id`)
)  AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;

-- ALTER TABLE `patient` DROP `insuredBy`;
ALTER TABLE `patient` ADD COLUMN `insuredBy` int(6) unsigned NULL AFTER `birthDate`;
ALTER TABLE `patient` ADD FOREIGN KEY (`insuredBy`) REFERENCES insurer(`id`) ON DELETE RESTRICT;


CREATE TABLE `physician` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `address` varchar(255) NOT NULL,
  `city` varchar(30) NOT NULL,
  `zipcode` varchar(10) NOT NULL,
  `phoneNumber` varchar(15) NOT NULL,
  PRIMARY KEY (`id`)
)  AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;

CREATE TABLE `order` (
`id` int(6) unsigned NOT NULL AUTO_INCREMENT,
`serviceDate` DATE NULL,
`status` varchar(10) NOT NULL,
`orderedBy` int(6) unsigned NOT NULL,
`prescribedBy` int(6) unsigned NOT NULL,
`insuredBy` int(6) unsigned NOT NULL,
FOREIGN KEY (`orderedBy`) REFERENCES patient(`accountId`) ON DELETE RESTRICT,
FOREIGN KEY (`prescribedBy`) REFERENCES physician(`id`) ON DELETE RESTRICT,
FOREIGN KEY (`insuredBy`) REFERENCES insurer(`id`) ON DELETE RESTRICT,
PRIMARY KEY (`id`)
) AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;

ALTER TABLE `order` ADD COLUMN `appointment` DATE NULL AFTER `insuredBy`;

CREATE TABLE `team` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `role` ENUM('Sales', 'DTech', 'Admin', 'Screener') NOT NULL,
  PRIMARY KEY (`id`)
) AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;

CREATE TABLE `user` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `username` varchar(60) NOT NULL,
  `hashedPassword` varchar(72) NOT NULL,
  `team` int(6) unsigned NOT NULL,
  FOREIGN KEY (`team`) REFERENCES team(`id`) ON DELETE RESTRICT,
  PRIMARY KEY (`id`)
) AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;

ALTER TABLE `user` ADD UNIQUE(`username`);

CREATE TABLE `log` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `createdAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `message` VARCHAR(255) NOT NULL,
  `userId` int(6) unsigned NOT NULL,
  `meta` JSON NOT NULL,
  FOREIGN KEY (`userId`) REFERENCES user(`id`),
  PRIMARY KEY(`id`)
) AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;

CREATE TABLE `comment` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `createdAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `userId` int(6) unsigned NOT NULL,
  `orderId` int(6) unsigned NOT NULL,
  `content` varchar(255) NOT NULL,
  FOREIGN KEY (`userId`) REFERENCES user(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE CASCADE,
  PRIMARY KEY (`id`)
) AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;

ALTER TABLE `comment` CHANGE `createdAt` `createdAt` TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP(3) NOT NULL;



-- INSERT INTO `patient` (`firstName`, `lastName`, `phoneNumber`, `address`, `zipcode`, `birthDate`) VALUES
-- ('Reddy 1', 'Prasad 1', '8884223357', '1-125, Brahmana Street, Sadum, Chittoor', '517123', '1994-06-12'),
-- ('Reddy 2', 'Prasad 2', '8884223357', '1-125, Brahmana Street, Sadum, Chittoor', '517123', NULL),
-- ('Reddy 3', 'Prasad 3', '8884223357', '1-125, Brahmana Street, Sadum, Chittoor', '517123', '1994-06-12'),
-- ('Reddy 4', 'Prasad 4', '8884223357', '1-125, Brahmana Street, Sadum, Chittoor', '517123', '1994-06-12'),
-- ('Reddy 5', 'Prasad 5', '8884223357', NULL, '517123', NULL),
-- ('Reddy 6', 'Prasad 6', '8884223357', '1-125, Brahmana Street, Sadum, Chittoor', NULL, '1994-06-12'),


-- SELECT SUBSTRING(COLUMN_TYPE,5)
-- FROM information_schema.COLUMNS
-- WHERE TABLE_SCHEMA='breath_right_one' 
--     AND TABLE_NAME='team'
--     AND COLUMN_NAME='role';

CREATE TABLE equipment (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(10) NOT NULL UNIQUE,
  `name` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;

ALTER TABLE `equipment` ADD COLUMN `setPrice` DECIMAL(10,2) unsigned NOT NULL AFTER `name`;

CREATE TABLE order_equipment (
  `orderId` int(6) unsigned  NOT NULL,
  `equipmentId` int(6) unsigned NOT NULL,
  CONSTRAINT FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT FOREIGN KEY (`equipmentId`) REFERENCES `equipment`(`id`) ON DELETE RESTRICT,
  UNIQUE KEY (`orderId`,`equipmentId`)
) AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;

CREATE TABLE order_sale_user (
  `orderId` int(6) unsigned  NOT NULL,
  `userId` int(6) unsigned NOT NULL,
  CONSTRAINT FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT,
  UNIQUE KEY (`orderId`,`userId`)
) AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;

CREATE TABLE `document` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `createdAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `createdBy` int(6) unsigned NOT NULL,
  `name` VARCHAR(60) NOT NULL,
  `path` VARCHAR(255) NOT NULL,
  `orderId` int(6) unsigned NOT NULL,
  FOREIGN KEY (`createdBy`) REFERENCES user(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE CASCADE,
  PRIMARY KEY (`id`)
) AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;


-- PRIMARY KEY (person_id,property_id),

INSERT INTO `team` (`name`, `role`) VALUES ('Administrator', 'admin');
INSERT INTO `user` (`name`, `username`, `hashedPassword`, `team`) VALUES ('Admin', 'admin', '$2a$04$lk0A/IXZ7if6etGrlBspQuobYD.yaH5fr3tXR4019P.CnsD06z2x6', 1);
