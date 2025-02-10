CREATE DATABASE  IF NOT EXISTS `now_gaming` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `now_gaming`;
-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: now_gaming
-- ------------------------------------------------------
-- Server version	8.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `user_id` int NOT NULL,
  `game_id` int NOT NULL,
  `price_id` int DEFAULT NULL,
  `quantity` int DEFAULT '1',
  `date_added` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`game_id`),
  KEY `game_id` (`game_id`),
  KEY `price_id` (`price_id`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`game_id`) REFERENCES `games` (`game_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_ibfk_3` FOREIGN KEY (`price_id`) REFERENCES `historyprice` (`history_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `games`
--

DROP TABLE IF EXISTS `games`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `games` (
  `game_id` int NOT NULL AUTO_INCREMENT,
  `game_title` varchar(255) NOT NULL,
  `game_image` varchar(255) DEFAULT NULL,
  `game_description` text,
  `game_deleted` tinyint DEFAULT '0',
  `game_category` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`game_id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `games`
--

LOCK TABLES `games` WRITE;
/*!40000 ALTER TABLE `games` DISABLE KEYS */;
INSERT INTO `games` VALUES (1,'Cyberpunk 2077','cyberpunk-2077.jpg','Cyberpunk 2077 เป็นเกมสวมบทบาทแนวแอคชั่นผจญภัยแบบโลกเปิดที่ดำเนินเรื่องในอนาคตอันมืดมนของไนท์ซิตี้ มหานครที่คลั่งในอำนาจ ความหรูหรา และการปรับแต่งร่างกายอย่างไม่หยุดหย่อน',0,'Action'),(2,'Grand Theft Auto V','grand-theft-auto-v-pc-game-rockstar-cover.jpg','The game is set in the fictional town of San Andreas which is based loosely on generic southern California life.',0,'Action'),(3,'Red Dead Redemption 2','Red Dead Head.jpeg','Winner of over 175 Game of the Year Awards and recipient of over 250 perfect scores, RDR2 is the epic tale of outlaw Arthur Morgan and the infamous Van der Linde gang, on the run across America at the dawn of the modern age. Also includes access to the shared living world of Red Dead Online.',0,'Action'),(4,'Devil May Cry 5','Devil May Cry 5.jpg','            The Devil you know returns in this brand new entry in the over-the-top action series available on the PC.  Prepare to get downright demonic with this signature blend of high-octane stylized action and otherworldly & original characters the series is known for. Director Hideaki Itsuno and the core team have returned to create the most insane, technically advanced and utterly unmissable action experience of this generation!\r\n',0,'Action'),(5,'Spider-Man: Miles Morales','Marvel s Spider Man Miles Morales.jpg','Bitten by a genetically engineered spider known as specimen 42, which is slightly different from the one that granted Peter Parker superhuman powers, Miles Morales possesses abilities similar to the original Spider-Man\'s, including enhanced strength, agility, and reflexes, the ability to adhere to walls',0,'Action'),(6,'The Legend of Zelda Breath of the Wild','The Legend of Zelda Breath of the Wild.jpg','Forget everything you know about The Legend of Zelda games. Step into a world of discovery, exploration, and adventure in The Legend of Zelda: Breath of the Wild, a boundary-breaking new game in the acclaimed series. Travel across vast fields, through forests, and to mountain peaks as you discover what has become of the kingdom of Hyrule in this stunning Open-Air Adventure. Now on Nintendo Switch, your journey is freer and more open than ever. Take your system anywhere, and adventure as Link any way you like.2017 Nintendo. The Legend of Zelda and Nintendo Switch are trademarks of Nintendo',0,'Adventure'),(7,'uncharted 4 a thief\'s end','uncharted 4 a thief\'s end.jpg','Three years after UNCHARTED 3: Drake\'s Deception, hunter Nathan Drake has left his old world behind, but fate has brought the treasure back. Drake\'s brother Sam has come to the rescue, offering a service Drake can\'t refuse. Sam and Drake travel to Libertalia, a knight\'s paradise in the deep jungles of Madagascar, in search of the missing treasure of Captain Henry Avery. UNCHARTED 4: A Thief\'s End takes players on an adventure through an island filled with jungles, remote towns and snowy peaks in search of Avery\'s treasure.',0,'Adventure'),(8,'Tomb Raider','Tomb Raider (2013).jpg','Tomb Raider explores the intense and gritty origin story of Lara Croft and her ascent from a young woman to a hardened survivor. Armed only with raw instincts and the ability to push beyond the limits of human endurance, Lara must fight to unravel the dark history of a forgotten island to escape its relentless hold. Download the Turning Point trailer to see the beginning of Lara’s epic adventure.',0,'Adventure'),(9,'Firewatch','Firewatch.jpg','The year is 1989. You are a man named Henry who has retreated from his messy life to work as a fire lookout in the Wyoming wilderness. Perched high atop a mountain, it’s your job to look for smoke and keep the wilderness safe. An especially hot, dry summer has everyone on edge. Your supervisor Delilah is available to you at all times over a small, handheld radio—your only contact with the world you\'ve left behind. But when something strange draws you out of your lookout tower and into the forest, you’ll explore a wild and unknown environment, facing questions and making choices that can build or destroy the only meaningful relationship you have.',0,'Adventure'),(10,'Life is Strange','Life is Strange.jpg','Life is Strange is an award-winning and critically acclaimed episodic adventure game that allows the player to rewind time and affect the past, present and future. Follow the story of Max Caulfield, a photography senior who discovers she can rewind time while saving her best friend Chloe Price. The pair soon find themselves investigating the mysterious disappearance of fellow student Rachel Amber, uncovering a dark side to life in Arcadia Bay. Meanwhile, Max must quickly learn that changing the past can sometimes lead to a devastating future.',0,'Adventure'),(11,'pac-man world 3 remake','pac-man world 3 remake 16 9.avif','Similar to its predecessors (Pac-Man World 1 and 2), Pac-Man World 3 is a 3D platformer that places Pac-Man in a 3D platforming environment, where he ventures into the Ghosts\' Spectral Realm to stop Erwin. Pac-Man travels across various areas and solves puzzles and platforming.',0,'Retro'),(12,'Space Invaders Extreme','Space Invaders Extreme.jpg','The critically acclaimed update to the Space Invaders franchise is here to invade Steam with greatly improved graphics and audio! Packed with pulsing, vibrant visuals enhanced further by interactive sound. The invaders have evolved, the question is: can you keep up? The Steam version adds a brand new World Ranking System for Arcade Mode. Learn the intricacies of the scoring system and use that knowledge to conquer the leaderboards! Who will prevail in this battle to become the world champion?!',0,'Retro'),(13,'Donkey Kong Country: Tropical Freeze','Donkey Kong Country Tropical Freeze.jpg','Arctic invaders have turned Donkey Kong Island into their frozen fortress, and it\'s up to you to save the day. Play as Donkey Kong in Original Mode and team up with Diddy Kong, Dixie Kong and Cranky Kong, all with unique abilities, to overcome challenging levels and terrifying frozen enemies.',0,'Retro'),(14,'SUPER MARIO BROS.U DELUXE','SUPER MARIO BROS U DELUXE.avif','Two games in one, for twice the fun! Simple, intuitive controls and a new playable character tailored to younger players with limited gaming experience. A wealth of extra content, like a Hints gallery and helpful reference videos , make this the perfect choice for anyone looking to introduce their family to the magical world of Mario. Each player uses a separate Joy-Con™ controller, so two players can team up right out of the box. Battle through 164 adventure paths in the game’s two main modes, and enjoy replayability with three additional modes: Challenges, Boost Rush, and Coin Battle, where you can also play as Mii™ characters.',0,'Retro'),(15,'Rockman X4','Rockman X4.jpg','Mega Man X4 was released on the Playstation Network in North America as part of the PSOne classics on September 2, 2014,[2] which was later released in Japan on December 17, 2014. It was then re-released on Mega Man X Legacy Collection on July 24, 2018 in North America and Europe, and was released two days later in Japan.',0,'Retro'),(16,'Street Fighter V','Street Fighter V.jpg','Experience the thrilling one-on-one action in Street Fighter® V! Choose from 16 unique characters, each with their own unique story and special training missions. When you’re ready, challenge your friends both online and offline. Choose from a variety of opponents. Whether it’s competing for battle money in Ranked Match, having fun in Casual Match, or inviting friends to join the Battle Lounge to see who’s the best. Take the excitement to the next level with cross-platform play, allowing PlayStation 4 and Steam players to play together!',0,'Fighting'),(17,'Mortal Kombat 11','Mortal Kombat 11.jpg','YOU\'RE NEXT! MK is back and better than ever in the next evolution of the iconic franchise. The all new Custom Character Variations give you unprecedented control of your fighters to make them your own. The new graphics engine showcases every skull-shattering, eye-popping moment, bringing you so close to the fight you can feel it. Featuring a roster of new and returning Klassic Fighters, Mortal Kombat\'s best-in-class cinematic story mode continues the epic saga over 25 years in the making.',0,'Fighting'),(18,'TEKKEN 7','TEKKEN 7.jpg','YOU\'RE NEXT! MK is back and better than ever in the next evolution of the iconic franchise. The all new Custom Character Variations give you unprecedented control of your fighters to make them your own. The new graphics engine showcases every skull-shattering, eye-popping moment, bringing you so close to the fight you can feel it. Featuring a roster of new and returning Klassic Fighters, Mortal Kombat\'s best-in-class cinematic story mode continues the epic saga over 25 years in the making.',0,'Fighting'),(19,'Super Smash Bros. Ultimate','ac4d1fc9824876ce756406f0525d50c57ded4b2a666f6dfe40a6ac5c3563fad9.avif','Legends of the Game Evolve in the Ultimate Fighting Game to Play Anywhere, Anytime! New to the game, Simon Belmont and King K. Rool check in with Inkling, Ridley, and all the other Super Smash Bros. fighters to knock your opponents out of the way. Experience fast-paced, action-packed battles in brand-new levels based on the Castlevania series, Super Mario Odyssey, and more!',0,'Fighting'),(20,'Guilty Gear Strive','Guilty Gear Strive.avif','Discover the Smell of the Game with Guilty Gear -Strive-! Immerse yourself in new gameplay mechanics designed to be simple and welcoming for fighting game newcomers, yet deep and creative for veterans. Ride the Fire into a heavy metal inspired alternate future full of over-the-top action, style and fun! Blazing! “Guilty Gear -Strive-“ is the latest entry in the critically acclaimed Guilty Gear fighting game franchise. Created by Daisuke Ishiwatari and developed by Arc System Works, “Guilty Gear -Strive-“ upholds the series’ reputation for a high octane soundtrack, groundbreaking hybrid 2D/3D cell-shaded graphics and intense, rewarding gameplay.',0,'Fighting'),(21,'Call of Duty: Modern Warfare II','Call of Duty Modern Warfare II.jpg','Announcement Call of Duty: Modern Warfare II had its first confirmation official on February 11th, 2022. In a post on the Call of Duty blog, it has been announced that the Call of Duty title of 2022 it would be a sequel of Call of Duty: Modern Warfare released in 2019 and also a new Call of Duty: Warzone experience also would be in development, both led by Infinity Ward. At that time, the official title had not been revealed yet.',0,'FPS'),(22,'Battlefield 2042','Battlefieldâ¢ 2042.jpg','Welcome to 2042 Battlefield™ 2042 is a first-person shooter that brings the franchise’s signature all-out warfare back to action. Fight intense multiplayer battles with the latest weaponry and combat. Lead your team to victory in both massive, melee and tactical battles across maps from the world of 2042 and legacy Battlefield games.',0,'FPS'),(23,'Doom Eternal','Doom Eternal.jpg','Set some time after the events of the 2016 game, the story follows the Doom Slayer once again, on a mission to end Hell\'s consumption of Earth and foil the alien Khan Maykr\'s plans to exterminate humanity. Along with the single-player campaign, a multiplayer mode, Battlemode, was introduced.',0,'FPS'),(24,'Overwatch 2','OverwatchÂ® 2.jpg','Team up with your fellow heroes in Overwatch 2, a free-to-play first-person shooter featuring a unique and ever-expanding roster of heroes, and engage in thrilling battles across captivating global settings. Team up with friends for thrilling 5v5 squad battles or take on powerful new enemy forces.',0,'FPS'),(25,'VALORANT','Valorant.jpeg','Valorant (also known as VALORANT) is a free-to-play, multiplayer, first-person shooter video game developed and published by Riot Games for Microsoft Windows. The game was first announced in October 2019 under the codename Project A, initially in closed beta until April 7, 2020, and officially launched on June 2, 2020, after being in development since 2014. Inspired by the Counter-Strike series of tactical shooters, Valorant incorporates a number of mechanics, such as a buy menu, spray patterns, and movement discrepancies.',0,'FPS'),(26,'Hollow Knight','Hollow Knight.jpg','Godmaster - Take your place amongst the Gods. New Characters and Quest. New Boss Fights. Available Now! Lifeblood - A Kingdom Upgraded! New Boss. Upgraded Bosses. Tweaks and Refinements across the whole game. The Grimm Troupe - Light the Nightmare Lantern. Summon the Troupe. New Major Quest. New Boss Fights. New Charms. New Enemies. New Friends.',0,'Indies'),(27,'Stardew Valley','stardew-update.jpg','Stardew Valley is an open-ended country-life RPG! You\'ve inherited your grandfather\'s old farm plot in Stardew Valley. Armed with hand-me-down tools and a few coins, you set out to begin your new life.',0,'Indies'),(28,'Celeste','Celeste.jpg','Help Madeline survive her inner demons on her journey to the top of Celeste Mountain, in this super-tight platformer from the creators of TowerFall. Brave hundreds of hand-crafted challenges, uncover devious secrets, and piece together the mystery of the mountain.',0,'Indies'),(29,'Hades','Hades.jpg','Defy the god of the dead as you hack and slash out of the Underworld in this rogue-like dungeon crawler from the creators of Bastion, Transistor, and Pyre.',0,'Indies'),(30,'UNDERTALE','Undertale.jpg','Help Madeline survive her inner demons on her journey to the top of Celeste Mountain, in this super-tight platformer from the creators of TowerFall. Brave hundreds of hand-crafted challenges, uncover devious secrets, and piece together the mystery of the mountain.',0,'Indies'),(31,'The Witcher 3: Wild Hunt','The Witcher 3 Wild Hunt.jpg','The Witcher 3: Wild Hunt is an action role-playing game with a third-person perspective. Players control Geralt of Rivia, a monster slayer known as a Witcher. Geralt walks, runs, rolls and dodges, and (for the first time in the series) jumps, climbs and swims.',0,'RPG'),(32,'FINAL FANTASY VII REMAKE INTERGRADE','Final Fantasy VII Remake.jpg','FINAL FANTASY VII REMAKE is a bold reimagining of the original FINAL FANTASY VII, originally released in 1997, developed under the guidance of the original key developers. This critically-acclaimed game, which mixes traditional command-based combat and real-time action, makes its Steam debut along with FF7R EPISODE INTERmission─a new story arc featuring Yuffie Kisaragi.',0,'RPG'),(33,'Elden Ring','Elden Ring.jpg','Elden Ring is an action RPG which takes place in the Lands Between, sometime after the Shattering of the titular Elden Ring. Players must explore and fight their way through the vast open-world to unite all the shards, restore the Elden Ring, and become Elden Lord.',0,'RPG'),(34,'Persona 5 Royal','Persona 5 Royal.jpg','  Don the mask and join the Phantom Thieves of Hearts as they stage grand heists, infiltrate the minds of the corrupt, and make them change their ways!\r\n',0,'RPG'),(35,'The Elder Scrolls V: Skyrim Special Edition','Skyrim.jpg','Winner of more than 200 Game of the Year Awards, The Elder Scrolls V: Skyrim Special Edition brings the epic fantasy to life in stunning detail. The Special Edition includes the critically acclaimed game and add-ons with all-new features like remastered art and effects, volumetric god rays, dynamic depth of field, screen-space reflections, and more. ',0,'RPG'),(36,'FIFA 23','FIFA 23.jpg','FIFA 23 is a football video game published by EA Sports. It is the 30th and final installment in the FIFA series that is developed by EA Sports, and released worldwide on 30 September 2022 for Nintendo Switch, PlayStation 4, PlayStation 5, Windows, Xbox One and Xbox Series X/S. Kylian Mbappé and Sam Kerr are the cover athletes for the standard and legacy editions.',0,'Sports'),(37,'NBA 2K23','nba 2k23.jpg','The NBA series of games has been released for us to play almost every year. But if you ask what is more outstanding and interesting this year than the previous installments, I would have to say that it is the improvement of both gameplay and gameplay systems that are better in every installment. It is a tradition for fans that when September approaches, they must see a new installment released. And this year, we are going to get to experience it with NBA 2K23.',0,'Sports'),(38,'Football PES 2021 SEASON UPDATE','Pro Evolution Soccer 2021.jpg','Please note that the latest data for certain licensed leagues and teams will only be available via an update post-release. You will need an internet connection in order to download this update. See the official website for more details.',0,'Sports'),(39,'Tony Hawk\'s Pro Skater 1+2','Tony Hawk\'s Pro Skater 1 2.jpg','Tony Hawk\'s Pro Skater 1 + 2 is a skateboarding video game played in a third-person view with its gameplay oriented towards classic arcade games. The goal of most modes of the game is to achieve a high score or collect certain objects. The player must complete objectives to unlock levels to progress through the game.',0,'Sports'),(40,'Madden NFL 23','Madden NFL 23.jpg','Compete to make your mark in Madden NFL 23 history Control every clash with every decision you make in an all-new way. Take control of your team in Franchise mode, which adds free agents and updated trade logic. Compete to make your mark in Face of the Franchise: The League mode and assemble the most powerful team in all of Madden Ultimate Team™.',0,'Sports'),(41,'Resident Evil Village','Resident Evil Village.jpg','Experience survival horror like never before in the eighth installment of the Resident Evil franchise - Resident Evil Village. Set after the horrifying events of the critically acclaimed Resident Evil 7 biohazard, this all-new story begins with Ethan Winters and his wife Mia living peacefully in their new home, free from the nightmares of their past. As they build a new life together, tragedy strikes them once again.',0,'Horror'),(42,'Silent Hill 2','Silent Hill 2.webp','Investigating a letter from his late wife, James returns to where they made so many memories - Silent Hill. What he finds is a ghost town, prowled by disturbing monsters and cloaked in deep fog. Confront the monsters, solve puzzles, and search for traces of your wife in this remake of SILENT HILL 2.',0,'Horror'),(43,'Outlast','Outlast.jpg','Hell is an experiment you can\'t survive in Outlast, a first-person survival horror game developed by veterans of some of the biggest game franchises in history. As investigative journalist Miles Upshur, explore Mount Massive Asylum and try to survive long enough to discover its terrible secret... if you dare.',0,'Horror'),(44,'Alien: Isolation','Alien Isolation.jpg','Discover the true meaning of fear in Alien: Isolation, a survival horror set in an atmosphere of constant dread and mortal danger. Fifteen years after the events of Alien™, Ellen Ripley\'s daughter, Amanda enters a desperate battle for survival, on a mission to unravel the truth behind her mother\'s disappearance.',0,'Horror'),(45,'Dead by Daylight','Dead by Daylight.jpg','Dead by Daylight is an indie horror game developed and published by Behaviour Interactive. Dead by Daylight is both an action and survival horror multiplayer game in which one crazed, unstoppable Killer hunts down four Survivors through a terrifying nightmarish world in a deadly game of Cat & Mouse',0,'Horror'),(46,'Guitar Hero III: Legends of Rock','guitar hero iii legends of rock.jpg','Guitar Hero III: Legends of Rock is a music rhythm game, the third main installment in the Guitar Hero series, and the fourth title overall. The game was published by Activision and distributed by RedOctane. It is the first game in the series to be developed by Neversoft after Activision’s acquisition of RedOctane and MTV Games’ purchase of Harmonix, the previous development studio for the series.',0,'Rhythm'),(47,'Friday Night Funkin','friday night funkin.jpg','Friday Night Funkin\' is a rhythm game in which the player controls a character called Boyfriend, who must defeat a series of opponents to continue dating his significant other, Girlfriend. The player must pass multiple levels, referred to as \"Weeks\" in-game, containing three songs each.',0,'Rhythm'),(48,'Beat Saber','Beat Saber.jpg','Beat Saber is an immersive rhythm experience you have never seen before! Enjoy tons of handcrafted levels and swing your way through the pulsing music beats, surrounded by a futuristic world. Use your sabers to slash the beats as they come flying at you – every beat indicates which saber you need to use and the direction you need to match. With Beat Saber you become a dancing superhero!',0,'Rhythm'),(49,'Taiko no Tatsujin: Rhythm Festival','Taiko no Tatsujin Rhythm Festival.jpg','Taiko no Tatsujin: Rhythm Festival is a drum-based rhythm game featuring songs from genres such as Anime and VOCALOID™, and also a variety of game modes! Have fun playing solo or online! Recent Reviews: Very Positive (36) - 94% of the 36 user reviews in the last 30 days are positive.\r\n',0,'Rhythm'),(50,'osu!','osu!.webp','Osu! is a rhythm game in which hit circles appear as notes over a song\'s runtime, and the objective is to click on the circles at the appropriate time and in the correct order, aided by rings called approach circles that close in on the hit circles to visually indicate the timing.',0,'Rhythm'),(51,'Forza Horizon 5','Forza Horizon 5.jpg','Forza Horizon 5 is a racing video game set in an open world environment based in a fictional representation of Mexico. The game has the largest map in the entire Forza Horizon series, being 50% larger than its predecessor, Forza Horizon 4, while also having the highest point in the Horizon series.',0,'Racing'),(52,'Gran Turismo 7','Gran Turismo 7.webp','Gran Turismo 7 (Italian: Gran Turismo 7) is a racing simulation video game developed by Polyphony Digital and published by Sony Interactive Entertainment. It is the eighth main game in the Gran Turismo series. It was announced on June 11, 2020, at the PlayStation 5 reveal event and released on March 4, 2022 for PlayStation 4 and PlayStation 5, making it the first multi-console game in the series. Gran Turismo 7 received positive reviews from critics, with praise for its graphics and gameplay.',0,'Racing'),(53,'Need for Speed: Heat','Need for Speed Heat.jpg','Sprint by day and step on it at night with Need for Speed™ Heat Deluxe Edition. It’s a street-level racing thrill ride where the line between legal and illegal blurs as the sun sets.',0,'Racing'),(54,'Mario Kart 8 Deluxe','Mario Kart 8 Deluxe.jpg','Forza Horizon 5 is a racing video game set in an open world environment based in a fictional representation of Mexico. The game has the largest map in the entire Forza Horizon series, being 50% larger than its predecessor, Forza Horizon 4, while also having the highest point in the Horizon series.',0,'Racing'),(55,'F1® 23','F1Â® 23.jpg','Stand firm until the end in EA SPORTS™ F1® 23, the official video game of the 2023 FIA Formula One World Championship™. ',0,'Racing'),(56,'Age of Empires IV: Anniversary Edition','Age of Empires IV.jpg','Featuring both familiar and innovative new ways to expand your empire in vast landscapes with stunning 4K visual fidelity, Age of Empires IV: Anniversary Edition brings an evolved real-time strategy game to the next level in this celebratory new version that includes a host of free new content such ',0,'Strategy'),(57,'Sid Meier’s Civilization® VI','Sid Meierâs CivilizationÂ® VI.jpg','Civilization VI is the newest installment in the award winning Civilization Franchise. Expand your empire, advance your culture and go head-to-head against history’s greatest leaders. Will your civilization stand the test of time?',0,'Strategy'),(58,'StarCraft™ II Campaign Collection','StarCraftâ¢ II Campaign Collection.jpg','With millions of players already in the fight, StarCraft II has made gaming history. Now it’s your turn to take command and lead vast armies of terran, protoss and zerg to victory amongst the stars. Prepare for interstellar war, commander. You’re needed at the front. The StarCraft II Complete Collection includes',0,'Strategy'),(59,'Total War: Warhammer III','Total War Warhammer III.jpg','Like its predecessors, Total War: Warhammer III features turn-based strategy and real-time tactics gameplay similar to other games in the Total War series. In the campaign, players move armies and characters around the map and manage settlements in a turn-based manner.',0,'Strategy'),(60,'XCOM 2','XCOM 2.jpg','Description. XCOM® 2 is the sequel to the award-winning strategy game XCOM: Enemy Unknown. Earth has changed and is now under alien rule. Facing impossible odds you must rebuild XCOM, and ignite a global resistance to reclaim our world and save humanity.',0,'Strategy');
/*!40000 ALTER TABLE `games` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historyprice`
--

DROP TABLE IF EXISTS `historyprice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historyprice` (
  `history_id` int NOT NULL AUTO_INCREMENT,
  `game_id` int DEFAULT NULL,
  `game_price` decimal(10,2) DEFAULT NULL,
  `start_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`history_id`),
  KEY `game_id` (`game_id`),
  CONSTRAINT `historyprice_ibfk_1` FOREIGN KEY (`game_id`) REFERENCES `games` (`game_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historyprice`
--

LOCK TABLES `historyprice` WRITE;
/*!40000 ALTER TABLE `historyprice` DISABLE KEYS */;
INSERT INTO `historyprice` VALUES (1,1,1407.00,'2025-02-08 04:15:46'),(2,2,354.00,'2025-02-08 04:17:53'),(3,3,1753.95,'2025-02-08 04:19:17'),(4,4,3759.00,'2025-02-08 04:20:23'),(5,5,1290.00,'2025-02-08 04:22:55'),(6,6,1499.00,'2025-02-08 04:24:01'),(7,7,1890.00,'2025-02-08 04:29:01'),(8,8,560.30,'2025-02-08 04:29:54'),(9,9,400.00,'2025-02-08 04:30:41'),(10,10,635.00,'2025-02-08 04:32:08'),(11,11,1390.00,'2025-02-08 04:34:34'),(12,12,160.00,'2025-02-08 04:35:15'),(13,13,1590.00,'2025-02-08 04:35:58'),(14,14,1620.00,'2025-02-08 04:36:37'),(15,15,950.00,'2025-02-08 04:37:44'),(16,16,329.50,'2025-02-08 04:38:57'),(17,17,2950.00,'2025-02-08 04:39:31'),(18,18,3190.00,'2025-02-08 04:40:16'),(19,19,1589.00,'2025-02-08 04:41:59'),(20,20,2999.00,'2025-02-08 04:42:38'),(21,21,2990.00,'2025-02-08 04:44:08'),(22,22,1049.00,'2025-02-08 04:44:50'),(23,23,1899.00,'2025-02-08 04:45:32'),(24,24,4804.00,'2025-02-08 04:46:11'),(25,25,11900.00,'2025-02-08 04:46:49'),(26,26,506.40,'2025-02-08 04:47:54'),(27,27,315.00,'2025-02-08 04:48:40'),(28,28,2971.60,'2025-02-08 04:49:17'),(29,29,257.40,'2025-02-08 04:50:32'),(30,30,339.00,'2025-02-08 04:51:11'),(31,31,266.56,'2025-02-08 04:52:47'),(32,32,3033.75,'2025-02-08 04:53:26'),(33,33,2990.00,'2025-02-08 04:54:04'),(34,34,1880.10,'2025-02-08 04:54:36'),(35,35,2163.92,'2025-02-08 04:55:22'),(36,36,2190.00,'2025-02-08 04:56:19'),(37,37,1980.00,'2025-02-08 04:56:53'),(38,38,1850.00,'2025-02-08 04:57:39'),(39,39,1534.00,'2025-02-08 04:58:29'),(40,40,1199.00,'2025-02-08 04:59:02'),(41,41,794.02,'2025-02-08 05:00:00'),(42,42,2454.00,'2025-02-08 05:00:32'),(43,43,1846.40,'2025-02-08 05:01:05'),(44,44,1977.30,'2025-02-08 05:01:45'),(45,45,1190.00,'2025-02-08 05:06:30'),(46,46,1490.00,'2025-02-08 05:07:22'),(47,47,199.00,'2025-02-08 05:08:12'),(48,48,875.07,'2025-02-08 05:09:39'),(49,49,1890.00,'2025-02-08 05:10:27'),(50,50,1604.00,'2025-02-08 05:11:02'),(51,51,1499.50,'2025-02-08 05:12:07'),(52,52,2290.00,'2025-02-08 05:13:01'),(53,53,380.00,'2025-02-08 05:13:57'),(54,54,1550.00,'2025-02-08 05:17:31'),(55,55,2499.00,'2025-02-08 05:17:58'),(56,56,2541.74,'2025-02-08 05:18:52'),(57,57,2722.08,'2025-02-08 05:19:27'),(58,58,2099.00,'2025-02-08 05:20:13'),(59,59,1390.00,'2025-02-08 05:20:50'),(60,60,3361.80,'2025-02-08 05:21:23'),(61,8,560.00,'2025-02-08 06:08:32');
/*!40000 ALTER TABLE `historyprice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `keygames`
--

DROP TABLE IF EXISTS `keygames`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `keygames` (
  `keygame` varchar(255) NOT NULL,
  `game_id` int DEFAULT NULL,
  `key_used` tinyint DEFAULT '0',
  PRIMARY KEY (`keygame`),
  KEY `game_id` (`game_id`),
  CONSTRAINT `keygames_ibfk_1` FOREIGN KEY (`game_id`) REFERENCES `games` (`game_id`) ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `keygames`
--

LOCK TABLES `keygames` WRITE;
/*!40000 ALTER TABLE `keygames` DISABLE KEYS */;
INSERT INTO `keygames` VALUES ('119298481A568FD4D6BC9C4E9FC85',20,0),('156D11D841424C7DD65CCA1D42922',2,0),('195D9B19A491C3275D4FA7AF3EDD2',1,0),('1A6A17254558E1C4B6EDF3618B32A',28,0),('1CC7825BF4648FCDA9A55DDCCC2B9',38,0),('1ED1CC2A78957DA3B9DEFD5F795D3',48,0),('24F14A2455358629C5F43E82F75A6',15,0),('255FE6CC7E8726B1FF3773216F7B9',37,0),('29363B84A76D2DC76986321A9B665',8,0),('2BAEE3AEE39CEB322EDD5213CBE3B',40,0),('2CFEC15D975C447337BC761FACA5A',11,0),('2D4D5DFFFD2E1773C3A336D82411C',32,0),('2F2CC8AF78BAEBE91EA4438A1F9D8',33,0),('492D9B749EBDCB44E216F7E72E7F6',5,0),('4B1FAFB7D2EEB8AE166CEABB17E9D',12,0),('56DBA51EB84C2D23EA9A331D26F6C',30,0),('5AD4BDD59F7459EE55C9FE689AB5F',13,0),('5BEB5E978AB5D1C3EDD7F1BE4BDC7',17,0),('5D1BCF4775A87A468EA7A57AF43D9',36,0),('64937E598E2253956E3FA7D265444',39,0),('6975F49F3D231CF4EE94844F2E86F',10,0),('6B79ACAEAD39A2528F14B551779C8',57,0),('6C527BB8F8DD7652BB4389878B544',45,0),('6C743C9339468D2FF51F4B33B893B',7,0),('6DD473245E4FBF68B14E13BE2D886',44,0),('6E2D176BDFFB8D3793C8D971241A6',14,0),('726477958AC81A554DDC2885ABF47',53,0),('75578A6C8C16DDB3D6A6153774327',41,0),('75E7B8BA69C8AA3C35769793EE1D3',55,0),('835E525676ADED9949117FDE8D29B',52,0),('8634ED33B6FD994719D25DDF647F8',54,0),('86FF913FF6A14BEA8A5E4889D4BA5',34,0),('8F119596CC4B1B4838C292CBC433F',59,0),('9738A7BDEA1FCC355482323928D7D',3,0),('9BF6E62FE478C29F12959616AD76B',2,0),('A349CF7E4928377FA5528925962F9',56,0),('A3624DAF5189FDE3849933BF6A432',47,0),('A5D88275B2ACCF2DD5DB16C1A4B15',58,0),('A797656951D9688FDAFC9CC2BD6A5',22,0),('A8A5E4C945BEFB14499E48691AF53',49,0),('A9F96B48CBAB8BCE2ABCCBF47F2A3',60,0),('AAB566A35FB16B6CA842AC25FB1A2',19,0),('AEA979518E2E2A8C8119FE528E6CD',6,0),('AFA49FE7D4DFD87165DCAB298B6DD',35,0),('B2A12F2E45AD9AD3F5FED2BAF7876',42,0),('B4B2AF78B9381D9F352D39C73715E',16,0),('B8B4C1BB59C722F4C2DDEC33BE48F',1,0),('C1141134747EF31A8124453B24B3A',27,0),('C4E5BD984873FD485CCF973B7C643',46,0),('CB5A57E69E4D43E929B4C9BED46CD',1,0),('CF27AA7FCDEA93374B29EFED752DB',18,0),('D85DF6752DC148986B7D89F17BB79',51,0),('DD592BE71624FBCAFAC59B6566AB2',29,0),('DEC8788957E1DAB2786EBB9A858F7',21,0),('E3B837865EF695C8ACFC7FA2A5AF7',50,0),('E4D658C8428382C5162DC3E8F6572',25,0),('E854C129752CC9D27DEBB639CDE61',9,0),('E9F9DC8EA16774DA54FF4D17F4BBB',26,0),('ED14A7D851B251A18B3CB166A2F66',4,0),('EEC21D72DBDCDF61C613FC8FF3127',23,0),('F9A7BC61DFE7D73BE6CC71F2ABC23',31,0),('FCCE37F4C58643BACD87A7532754F',43,0),('FE36DBC47BB91E12F8DC31B61E35C',24,0);
/*!40000 ALTER TABLE `keygames` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orderdetail`
--

DROP TABLE IF EXISTS `orderdetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orderdetail` (
  `order_id` int NOT NULL,
  `game_id` int DEFAULT NULL,
  `price_id` int DEFAULT NULL,
  `keygame` varchar(255) NOT NULL,
  PRIMARY KEY (`order_id`,`keygame`),
  KEY `keygame` (`keygame`),
  KEY `game_id` (`game_id`),
  KEY `price_id` (`price_id`),
  CONSTRAINT `orderdetail_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderdetail_ibfk_2` FOREIGN KEY (`keygame`) REFERENCES `keygames` (`keygame`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderdetail_ibfk_3` FOREIGN KEY (`game_id`) REFERENCES `games` (`game_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderdetail_ibfk_4` FOREIGN KEY (`price_id`) REFERENCES `historyprice` (`history_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderdetail`
--

LOCK TABLES `orderdetail` WRITE;
/*!40000 ALTER TABLE `orderdetail` DISABLE KEYS */;
/*!40000 ALTER TABLE `orderdetail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `order_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'nowgaming','nowgaming2025@gmail.com','$2a$10$YACSV25yjg33D57m6RHdFOocASsH3kXUrcg1YTty.ylmpP5fjn966','admin');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'now_gaming'
--

--
-- Dumping routines for database 'now_gaming'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-10  8:29:20
