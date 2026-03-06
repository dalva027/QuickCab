npm start 
- to start app in terminal(Node.js required) -

- Might have to edit password value for DB connection in app.js | line:14 -

--- Mysql script to create adequate DB to initialize app ---

CREATE SCHEMA `quickdb` ;

USE quickdb;

CREATE TABLE REGION (
reg_id INT PRIMARY KEY NOT NULL,
area_name VARCHAR(30) NOT NULL,
fee float
);

CREATE TABLE DRIVER
( driver_id INT PRIMARY KEY NOT NULL,
car_id INT NOT NULL,
reg_id INT NOT NULL,
f_name VARCHAR(30) NOT NULL,
l_name VARCHAR(30) NOT NULL,
FOREIGN KEY (reg_id) REFERENCES REGION(reg_id)
);

CREATE TABLE CUSTOMER (
cus_id INT PRIMARY KEY NOT NULL,
reg_id INT NOT NULL,
cus_fname VARCHAR(25),
cus_lname VARCHAR(25),
dest_address VARCHAR(25),
FOREIGN KEY (reg_id)REFERENCES REGION(reg_id) 
);

CREATE TABLE INVOICE (
trip_id INT PRIMARY KEY NOT NULL,
driver_id INT NOT NULL,
cus_id INT NOT NULL,
reg_id INT NOT NULL,
cus_fname VARCHAR(45),
cus_lname VARCHAR(45),
trip_miles INT,
cost_gas INT,
fee FLOAT,
tax FLOAT,
total_cost INT,
FOREIGN KEY (driver_id) REFERENCES DRIVER(driver_id),
FOREIGN KEY (cus_id)  REFERENCES CUSTOMER(cus_id),
FOREIGN KEY (reg_id) REFERENCES REGION(reg_id) 
);

INSERT INTO `quickdb`.`region` (`reg_id`, `area_name`, `fee`) VALUES ('1', '01', '.12');
INSERT INTO `quickdb`.`region` (`reg_id`, `area_name`, `fee`) VALUES ('2', '03', '.1');
INSERT INTO `quickdb`.`region` (`reg_id`, `area_name`, `fee`) VALUES ('3', '03', '.2');
INSERT INTO `quickdb`.`region` (`reg_id`, `area_name`, `fee`) VALUES ('4', '04', '.11');
INSERT INTO `quickdb`.`region` (`reg_id`, `area_name`, `fee`) VALUES ('5', '05', '.15');
INSERT INTO `quickdb`.`region` (`reg_id`, `area_name`, `fee`) VALUES ('6', '06', '.13');
INSERT INTO `quickdb`.`region` (`reg_id`, `area_name`, `fee`) VALUES ('7', '07', '.09');
INSERT INTO `quickdb`.`region` (`reg_id`, `area_name`, `fee`) VALUES ('8', '08', '.08');
INSERT INTO `quickdb`.`region` (`reg_id`, `area_name`, `fee`) VALUES ('9', '09', '.1');
INSERT INTO `quickdb`.`region` (`reg_id`, `area_name`, `fee`) VALUES ('10', '10', '.07');

INSERT INTO `quickdb`.`driver` (`driver_id`, `car_id`, `reg_id`, `f_name`, `l_name`) VALUES ('12234', '89431', '4', 'Joe', 'Peters');
INSERT INTO `quickdb`.`driver` (`driver_id`, `car_id`, `reg_id`, `f_name`, `l_name`) VALUES ('89332', '64327', '1', 'Eric', 'Nick');
INSERT INTO `quickdb`.`driver` (`driver_id`, `car_id`, `reg_id`, `f_name`, `l_name`) VALUES ('28923', '82928', '1', 'Joel', 'Richards');
INSERT INTO `quickdb`.`driver` (`driver_id`, `car_id`, `reg_id`, `f_name`, `l_name`) VALUES ('83277', '38942', '1', 'Nick', 'Jones');
INSERT INTO `quickdb`.`driver` (`driver_id`, `car_id`, `reg_id`, `f_name`, `l_name`) VALUES ('83727', '94721', '2', 'Peter', 'Elliot');
INSERT INTO `quickdb`.`driver` (`driver_id`, `car_id`, `reg_id`, `f_name`, `l_name`) VALUES ('64834', '38439', '5', 'Kevin', 'Heath');
INSERT INTO `quickdb`.`driver` (`driver_id`, `car_id`, `reg_id`, `f_name`, `l_name`) VALUES ('32955', '54838', '6', 'Dean', 'Altern');
INSERT INTO `quickdb`.`driver` (`driver_id`, `car_id`, `reg_id`, `f_name`, `l_name`) VALUES ('12549', '84488', '7', 'Steph', 'Lowe');
INSERT INTO `quickdb`.`driver` (`driver_id`, `car_id`, `reg_id`, `f_name`, `l_name`) VALUES ('38483', '63221', '8', 'Tom', 'Rust');
INSERT INTO `quickdb`.`driver` (`driver_id`, `car_id`, `reg_id`, `f_name`, `l_name`) VALUES ('28367', '99908', '9', 'Lena', 'Garcia');
INSERT INTO `quickdb`.`driver` (`driver_id`, `car_id`, `reg_id`, `f_name`, `l_name`) VALUES ('17530', '37411', '10', 'Wesley', 'Roberts');
INSERT INTO `quickdb`.`driver` (`driver_id`, `car_id`, `reg_id`, `f_name`, `l_name`) VALUES ('90912', '23439', '3', 'Xavier', 'Gerry');
INSERT INTO `quickdb`.`driver` (`driver_id`, `car_id`, `reg_id`, `f_name`, `l_name`) VALUES ('77721', '88326', '1', 'Nick', 'Noire');

-- I also used these commands due to an error with user permission
-- ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '@pwd';

-- flush privileges;