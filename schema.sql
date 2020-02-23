/*
 Schema architecture
*/


DROP DATABASE IF EXISTS employeemanager_db;
CREATE DATABASE employeemanager_db;
USE employeemanager_db;

CREATE TABLE departments
(
    id INTEGER
    AUTO_INCREMENT NOT NULL,
department_name VARCHAR
    (30) NOT NULL,
PRIMARY KEY
    (id)
);
    INSERT INTO departments
        (department_name)
    VALUES('Sales'),
        ('Engineering'),
        ('Legal'),
        ('Customer Support'),
        ('Finance');
    SELECT *
    FROM departments;

    CREATE TABLE roles
    (
        id INTEGER
        AUTO_INCREMENT NOT NULL,
title VARCHAR
        (30) NOT NULL,
salary DECIMAL
        (10, 4),
department_id INTEGER NOT NULL,
PRIMARY KEY
        (id),
FOREIGN KEY
        (department_id) REFERENCES departments
        (id)
);

        INSERT INTO roles
            (title, salary, department_id)
        VALUES("Sales Lead", 90000, 1),
            ("Junior Sales Associate", 70000, 1),
            ("Junior Software Engineer", 110000, 2),
            ("Senior Software Engineer", 130000, 2),
            ("Lawyer", 150000, 3),
            ("Technical Support Analyst", 60000, 4),
            ("Accountant", 150000, 5);
        SELECT *
        FROM roles;

        CREATE TABLE employees
        (
            id INTEGER
            AUTO_INCREMENT NOT NULL,
first_name VARCHAR
            (30) NOT NULL,
last_name VARCHAR
            (30) NOT NULL,
role_id INTEGER NOT NULL,
manager_id INTEGER,
PRIMARY KEY
            (id),
FOREIGN KEY
            (role_id) REFERENCES roles
            (id),
FOREIGN KEY
            (manager_id) REFERENCES employees
            (id)
);

            INSERT INTO employees
                (first_name, last_name, role_id, manager_id)
            VALUES
                ("Matt", "Emery", 4, NULL),
                ("Kaitlyn", "Carlson", 4, 1),
                ("Kirstie", "Wilkinson", 1, NULL),
                ("Kayla", "Gilmar", 2 , 3),
                ("Tori", "Winkler", 2, 3),
                ("Justin", "Brown", 3, 2),
                ("Tim", "Butler", 3, 2),
                ("Catherine", "Deveraux", 5, NULL),
                ("Max", "Millieon", 6, NULL),
                ("Ana", "Johnson", 6, NULL),
                ("Gabriel", "Miller", 7, NULL);


            SELECT *
            FROM departments;
            SELECT *
            FROM roles;
            SELECT *
            FROM employees;

