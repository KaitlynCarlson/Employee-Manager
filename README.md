# Employee-Manager

A Content Management System, for employee management, utilizing Node.js, Inquirer, and MySQL to help users track, update, and delete employees from a database.

![Employee Manager](./assets/EmployeeManager.png)

## Table of Contents

- [Purpose](#purpose)
- [User Story](#userstory)
- [Usability](#Usability)
- [Technologies](#technologies)
- [Status](#status)

## Purpose

To create an efficient and useful application where employers can track employees, roles, departments, managers, and salaries in one place.

## User Story

```
As a business owner
I want to be able to view and manage the departments, roles, and employees in my company
So that I can organize and plan my business
```

## Technologies

- Node.js
- MySQL
- CFonts
- Console.Table
- Inquirer

## Status

Currently this application is in the process of being broken up into organized sections. The server.js file holds all inquirer prompts, SQL server connections, and functions. This is not `DRY`. It also fails to utilize constructor classes which will help to ensure organization, efficiency and lack of redundancy in code.
