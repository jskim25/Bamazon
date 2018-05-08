DROP DATABASE IF EXISTS bamazonDB;
CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  price DECIMAL(8,2) NOT NULL,
  stock_quantity INT(9) NOT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Haribo Gummy Bears", "Candy", 1.25, 150),
("Skittles", "Candy", 1.19, 150),
("Bose Wireless Headphones", "Technology", 185.59, 20),
("Logitech Wireless Mouse", "Technology", 22.75, 35),
("North Face Jacket", "Apparel", 127.50, 25),
("Champion Sweatpants", "Apparel", 45.00, 35),
("Exit West", "Books", 10.40, 200),
("Permutation City", "Books", 13.80, 150),
("Inception Blu-ray", "Movies", 15.99, 100),
("Spider-Man Homecoming Blu-ray", "Movies", 14.99, 100)