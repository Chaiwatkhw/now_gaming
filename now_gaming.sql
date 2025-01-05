CREATE DATABASE now_gaming;
USE now_gaming;

create table games (
	game_id int auto_increment primary key,
    game_title varchar(255) not null,
    game_image varchar(255),
    game_description text,
    game_deleted tinyint
);

create table historyprice (
	history_id int primary key auto_increment,
    game_id int,
    game_price decimal(10,2),
    start_date timestamp default current_timestamp,

    foreign key (game_id) references games(game_id)
    on delete restrict on update cascade
);

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
);

INSERT INTO users (username, email, password, role) VALUES ('admin', 'chaiwat.ke@rmuti.ac.th', 'admin', 'admin');
