/*
 Schema architecture
*/

DROP DATABASE IF EXISTS employeemanager_db;
CREATE DATABASE employeemanager_db;
USE employeemanager_db;

CREATE TABLE employees
(
    id INTEGER
    AUTO_INCREMENT NOT NULL,
first_name VARCHAR
    (20) NOT NULL,
last_name VARCHAR
    (20) NOT NULL,
title VARCHAR
    (20) NOT NULL,
department VARCHAR
    (20) NOT NULL,
salary INTEGER,
manager VARCHAR
    (20),
PRIMARY KEY
    (id)
);
    SELECT *
    FROM employees;