"use strict";
const mysql = require("mysql");
const cfonts = require("cfonts");
const consoleTable = require("console.table");
const inquirer = require("inquirer");

const promptMessages = {
  viewAll: "View all employees",
  viewRoles: "View all employees by role",
  viewAllByDepartment: "View all employees by department",
  viewAllByManager: "View all employees by manager",
  addEmployee: "Add employee",
  removeEmployee: "Remove employee",
  updateEmployee: "Update employee record",
  updateEmployeeRole: "Update employee role",
  updateEmployeeManager: "Update employee manager",
  exit: "Exit Employee Manager"
};

const PORT = process.env.PORT || 3000;
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employeemanager_db"
});

connection.connect(err => {
  if (err) throw err;
  console.log("Local host connected on " + PORT);
  cfonts.say("Employee Manager", {
    font: "block",
    align: "left",
    colors: ["system"],
    background: "transparent",
    letterSpacing: 1,
    lineHeight: 1,
    space: true,
    maxLength: "0",
    gradient: false,
    independentGradient: false
  });
  prompt();
});

function prompt() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        promptMessages.viewAll,
        promptMessages.viewRoles,
        promptMessages.viewAllByDepartment,
        promptMessages.viewAllByManager,
        promptMessages.addEmployee,
        promptMessages.removeEmployee,
        promptMessages.updateEmployee,
        promptMessages.updateEmployeeRole,
        promptMessages.updateEmployeeManager,
        promptMessages.exit
      ]
    })
    .then(answer => {
      switch (answer.action) {
        case promptMessages.viewAll:
          viewAll();
          break;
        case promptMessages.viewRoles:
          viewRoles();
          break;
        case promptMessages.viewAllByDepartment:
          viewByDepartment();
          break;
        case promptMessages.viewAllByManager:
          viewByManager();
          break;
        case promptMessages.addEmployee:
          addEmployee();
          break;
        case promptMessages.removeEmployee:
          removeEmployee();
          break;
        case promptMessages.updateEmployee:
          updateEmployee();
          break;
        case promptMessages.updateEmployeeRole:
          updateEmployeeRole();
          break;
        case promptMessages.updateEmployeeManager:
          updateEmployeeManager();
          break;
        case promptMessages.exit:
          cfonts.say("So long!", {
            font: "block",
            align: "left",
            colors: ["system"],
            background: "transparent",
            letterSpacing: 1,
            lineHeight: 1,
            space: true,
            maxLength: "0",
            gradient: false,
            independentGradient: false
          });
          connection.end();
          break;
      }
    });
}

function viewAll() {
  const query = `    SELECT
    ER.id AS "Employee ID", ER.first_name AS "First Name",  ER.last_name AS "Last Name", roles.title AS "Employee Role", departments.department_name AS Department, roles.salary AS Salary, EM.first_name AS "Manager"
    FROM employees ER LEFT JOIN employees EM
    ON ER.manager_id = EM.id
    INNER JOIN roles
    ON ER.role_id = roles.id
    INNER JOIN departments
    ON roles.department_id = departments.id
    ORDER BY ER.id;`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.log(
      "\n=================================================================================================\n"
    );
    console.table(res);
    console.log(
      "\n=================================================================================================\n"
    );

    prompt();
  });
}
function viewByDepartment() {
  const query = `SELECT * FROM departments ;`;
  connection.query(query, (err, res) => {
    const departments = res.map(res => `${res.department_name}`);
    inquirer
      .prompt([
        {
          name: "selectDepartment",
          type: "list",
          message:
            "Which department would you like to view employee details on?",
          choices: departments
        }
      ])
      .then(answer =>
        connection.query(
          `SELECT ER.id AS "Employee ID", ER.first_name AS "First Name",  ER.last_name AS "Last Name", roles.title AS "Employee Role", departments.department_name AS Department, roles.salary AS Salary, CONCAT(EM.first_name ," " , EM.last_name) AS "Manager"
          FROM employees ER LEFT JOIN employees EM
            ON ER.manager_id = EM.id
              INNER JOIN roles
              ON ER.role_id = roles.id
              INNER JOIN departments
              ON roles.department_id = departments.id
              WHERE departments.department_name =?
              ORDER BY ER.id;
          `,
          [answer.selectDepartment],
          (err, res) => {
            if (err) throw err;
            console.log(
              "\n========================================================================================\n"
            );
            console.table(res);
            console.log(
              "\n========================================================================================\n"
            );
            prompt();
          }
        )
      );
  });
}
function viewRoles() {
  const query = `SELECT * FROM roles ;`;
  connection.query(query, (err, res) => {
    const roles = res.map(res => `${res.title}`);
    inquirer
      .prompt([
        {
          name: "selectRole",
          type: "list",
          message: "Which roles would you like to view employee details on?",
          choices: roles
        }
      ])
      .then(answerRole => {
        connection.query(
          `SELECT ER.id AS "Employee ID", ER.first_name AS "First Name",  ER.last_name AS "Last Name", roles.title AS "Employee Role", departments.department_name AS Department, roles.salary AS Salary, EM.first_name AS "Manager"
        FROM employees ER LEFT JOIN employees EM
        ON ER.manager_id = EM.id
        INNER JOIN roles
        ON ER.role_id = roles.id
        INNER JOIN departments
        ON roles.department_id = departments.id
        WHERE roles.title=?
        ORDER BY ER.id;
        `,
          [answerRole.selectRole],
          (err, res) => {
            if (err) throw err;
            console.log(
              "\n========================================================================================\n"
            );
            console.table(res);
            console.log(
              "\n========================================================================================\n"
            );

            prompt();
          }
        );
      });
  });
}
function viewByManager() {
  const query = `SELECT * FROM employees;`;
  connection.query(query, (err, res) => {
    const manager = res.map(res => `${res.manager_id}`);
    inquirer.prompt([
      {
        name: "selectRole",
        type: "list",
        message: "Which roles would you like to view employee details on?",
        choices: manager
      }
    ]);
  });
}
function addEmployee() {
  const query = `SELECT * FROM roles ;`;
  connection.query(query, (err, res) => {
    console.log(res);
    const employeeRole = res.map(res => `${res.id} ${res.title}`);
    console.log(employeeRole);
    inquirer
      .prompt([
        {
          name: "firstName",
          type: "input",
          message: "Please enter the new employee's first name."
        },
        {
          name: "lastName",
          type: "input",
          message: "Please enter the new employee's last name."
        },
        {
          name: "employeeRole",
          type: "list",
          message: "Please enter the new employee's role",
          choices: employeeRole
        }
      ])
      .then(answer => {
        connection.query(
          "INSERT INTO employees SET ?",
          {
            first_name: answer.firstName,
            last_name: answer.lastName,
            role_id: answer.employeeRole.charAt(0)
          },
          err => {
            if (err) throw err;
            console.log(
              "New employee successfully added to Employee Management Database"
            );
            prompt();
          }
        );
      });
  });
}
function removeEmployee() {
  const query = "SELECT id, first_name,last_name FROM employees;";
  connection.query(query, (err, res) => {
    console.log(res);
    const employees = res.map(res => `${res.first_name} ${res.last_name}`);
    console.log(employees);
    inquirer
      .prompt([
        {
          name: "employeeDelete",
          type: "list",
          message: "Which employee would you like to remove from the database?",
          choices: employees
        }
      ])
      .then(answer => {
        connection.query(
          "DELETE FROM employees WHERE first_name AND last_name;",
          [],
          err => {
            if (err) throw err;
            console.log(`${answer.employeeDelete} successfully removed!`);
            prompt();
          }
        );
      });
  });
}
function updateEmployee() {}
function updateEmployeeRole() {}
function updateEmployeeManager() {}
