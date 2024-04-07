-- Drop the database if it exists and then create it
DROP DATABASE IF EXISTS Threadle;
CREATE DATABASE Threadle;
USE Threadle;


DROP TABLE IF EXISTS `UserLevels`;
DROP TABLE IF EXISTS `Users`;
DROP TABLE IF EXISTS `Themes`;
DROP TABLE IF EXISTS `Posts`;
DROP TABLE IF EXISTS `Chats`;
DROP TABLE IF EXISTS `ChatMessages`;
DROP TABLE IF EXISTS `CommentReplies`;
DROP TABLE IF EXISTS `Comments`;
DROP TABLE IF EXISTS `Saves`;
DROP TABLE IF EXISTS `Ratings`;
DROP TABLE IF EXISTS `Tags`;
DROP TABLE IF EXISTS `PostsTags`;
DROP TABLE IF EXISTS `Friends`;


-- Create the tables

CREATE TABLE `UserLevels` (
  `level_id` INT PRIMARY KEY AUTO_INCREMENT,
  `level_name` VARCHAR(50) NOT NULL
);

CREATE TABLE `Users` (
  `user_id` INT PRIMARY KEY AUTO_INCREMENT,
  `username` VARCHAR(50) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `email` VARCHAR(100) UNIQUE NOT NULL,
  `user_level_id` INT,
  `user_activity` ENUM ('Active', 'Away', 'Do not disturb') DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `Themes` (
  `theme_id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `color1` VARCHAR(50) NOT NULL,
  `color2` VARCHAR(50) NOT NULL,
  `color3` VARCHAR(50),
  `color4` VARCHAR(50),
  `font1` VARCHAR(100),
  `font2` VARCHAR(100),
  `created_at` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `Posts` (
  `post_id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `filename` VARCHAR(255) NOT NULL,
  `filesize` INT NOT NULL,
  `media_type` VARCHAR(255) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `Chats` (
  `chat_id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `sender_id` INT NOT NULL,
  `receiver_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `ChatMessages` (
  `message_id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `chat_id` INT NOT NULL,
  `sender_id` INT NOT NULL,
  `receiver_id` INT NOT NULL,
  `message` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `CommentReplies` (
  `reply_id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `comment_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `message` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `Comments` (
  `comment_id` INT PRIMARY KEY AUTO_INCREMENT,
  `post_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `comment_text` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `Saves` (
  `save_id` INT PRIMARY KEY AUTO_INCREMENT,
  `post_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `Ratings` (
  `rating_id` INT PRIMARY KEY AUTO_INCREMENT,
  `post_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `rating_value` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `Tags` (
  `tag_id` INT PRIMARY KEY AUTO_INCREMENT,
  `tag_name` VARCHAR(50) NOT NULL
);

CREATE TABLE `PostsTags` (
  `post_id` INT NOT NULL,
  `tag_id` INT NOT NULL,
  PRIMARY KEY (`post_id`, `tag_id`)
);

CREATE TABLE `Friends` (
  `friendship_id` int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `sender_id` int(11) DEFAULT null,
  `receiver_id` int(11) DEFAULT null,
  `status` ENUM ('pending', 'accepted', 'declined') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT (current_timestamp())
);

CREATE UNIQUE INDEX `unique_friendship` ON `Friends` (`sender_id`, `receiver_id`);

CREATE INDEX `user_id2` ON `Friends` (`receiver_id`);

ALTER TABLE `Users` ADD FOREIGN KEY (`user_level_id`) REFERENCES `UserLevels` (`level_id`);

ALTER TABLE `Posts` ADD FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`);

ALTER TABLE `Comments` ADD FOREIGN KEY (`post_id`) REFERENCES `Posts` (`post_id`);

ALTER TABLE `Comments` ADD FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`);

ALTER TABLE `Saves` ADD FOREIGN KEY (`post_id`) REFERENCES `Posts` (`post_id`);

ALTER TABLE `Saves` ADD FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`);

ALTER TABLE `Ratings` ADD FOREIGN KEY (`post_id`) REFERENCES `Posts` (`post_id`);

ALTER TABLE `Ratings` ADD FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`);

ALTER TABLE `PostsTags` ADD FOREIGN KEY (`post_id`) REFERENCES `Posts` (`post_id`);

ALTER TABLE `PostsTags` ADD FOREIGN KEY (`tag_id`) REFERENCES `Tags` (`tag_id`);

ALTER TABLE `Users` ADD FOREIGN KEY (`user_id`) REFERENCES `Themes` (`user_id`);

ALTER TABLE `Chats` ADD FOREIGN KEY (`sender_id`) REFERENCES `Users` (`user_id`);

ALTER TABLE `Chats` ADD FOREIGN KEY (`receiver_id`) REFERENCES `Users` (`user_id`);

ALTER TABLE `Friends` ADD FOREIGN KEY (`sender_id`) REFERENCES `Users` (`user_id`);

ALTER TABLE `Friends` ADD FOREIGN KEY (`receiver_id`) REFERENCES `Users` (`user_id`);

ALTER TABLE `CommentReplies` ADD FOREIGN KEY (`comment_id`) REFERENCES `Comments` (`comment_id`);

ALTER TABLE `CommentReplies` ADD FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`);

ALTER TABLE `ChatMessages` ADD FOREIGN KEY (`sender_id`) REFERENCES `Users` (`user_id`);

ALTER TABLE `ChatMessages` ADD FOREIGN KEY (`receiver_id`) REFERENCES `Users` (`user_id`);

ALTER TABLE `ChatMessages` ADD FOREIGN KEY (`chat_id`) REFERENCES `Chats` (`chat_id`);

INSERT INTO UserLevels (level_name) VALUES ('Admin'), ('Buyer'), ('Seller'), ('Guest');

INSERT INTO Users (username, password, email, user_level_id) VALUES
('JohnDoe', 'to-be-hashed-pw1', 'johndoe@example.com', 2),
('JaneSmith', 'to-be-hashed-pw2', 'janesmith@example.com', 3),
('Anon5468', 'to-be-hashed-pw3', 'anon5468@example.com', 2),
('AdminUser', 'to-be-hashed-pw4', 'adminuser@example.com', 1);

INSERT INTO Posts (user_id, filename, filesize, media_type, title, description) VALUES
(1, 'sunset.jpg', 1024, 'image/jpeg', 'Sunset', 'A beautiful sunset'),
(2, 'sample.mp4', 20480, 'video/mp4', 'Sample Video', 'A sample video file'),
(2, 'ffd8.jpg', 2048, 'image/jpeg', 'Favorite food', null),
(1, '2f9b.jpg', 1024, 'image/jpeg', 'Aksux and Jane', 'friends');

INSERT INTO Comments (post_id, user_id, comment_text) VALUES
(1, 2, 'This is cool product!'),
(1, 2, 'What material do you use?'),
(2, 1, 'Do you make this in red?');

INSERT INTO CommentReplies (comment_id, user_id, message) VALUES
(1, 2, 'I use silk'),
(2, 1, 'Yes, but it increases the price by 2€.');

INSERT INTO Chats (sender_id, receiver_id) VALUES
(1, 2),
(2, 1);

INSERT INTO ChatMessages (chat_id, sender_id, receiver_id, message) VALUES
(1, 1, 2, 'Good morning! Is it possible to make this red? Also how long does it take to finish this?'),
(1, 2, 1, 'Hi. Of course! It increases the total price to 10€. It takes me about a week to send it to you.'),
(1, 2, 1, 'Okay good. I will send you the money by mobilepay!');

INSERT INTO Saves (post_id, user_id) VALUES
(1, 2),
(2, 1),
(2, 2),
(3, 1),
(2, 3),
(3, 3);

INSERT INTO Ratings (post_id, user_id, rating_value) VALUES
(1, 2, 5),
(2, 1, 4),
(1, 3, 4);

INSERT INTO Tags (tag_name) VALUES ('Nature'), ('Video'), ('Documentary'), ('Landscape');

INSERT INTO PostsTags (post_id, tag_id) VALUES
(1, 1),
(1, 4),
(2, 2),
(3, 1),
(2, 3);

INSERT INTO Themes (user_id, color1, color2) VALUES
(1, '#800000', '#FFCCCC'),
(1, '#FFFF00', '#FFFFCC'),
(1, '#008000', '#CCFFCC'),
(1, '#FFC0CB', '#FFE6EE'),
(2, '#0000FF', '#CCCCFF');

