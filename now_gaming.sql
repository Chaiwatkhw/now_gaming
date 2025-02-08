CREATE DATABASE now_gaming;
USE now_gaming;

create table games (
	game_id int auto_increment primary key,
    game_title varchar(255) not null,
    game_image varchar(255),
    game_description text,
    game_deleted tinyint default 0,
    game_category VARCHAR(50)
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
    role ENUM('user', 'admin') DEFAULT 'user'
);

CREATE TABLE keygames (
    keygame VARCHAR(255) PRIMARY KEY,
    game_id int,
    key_used tinyint default 0,
    FOREIGN KEY (game_id) REFERENCES games(game_id)
    ON UPDATE RESTRICT 
);

CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) 
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE orderdetail (
    order_id INT,
    game_id INT,
    price_id INT,
    keygame VARCHAR(255),
    PRIMARY KEY (order_id, keygame),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) 
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (keygame) REFERENCES keygames(keygame) 
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games(game_id) 
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (price_id) REFERENCES historyprice(history_id)
    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE cart (
    user_id INT,
    game_id INT,
    price_id INT,
    quantity INT DEFAULT 1,
    date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, game_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) 
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games(game_id) 
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (price_id) REFERENCES historyprice(history_id)
    ON DELETE RESTRICT ON UPDATE CASCADE
);
