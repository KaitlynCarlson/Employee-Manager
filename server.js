"use strict";
const mysql = require("mysql");
const cfonts = require("cfonts");
const consoleTable = require("console.table");
const inquirer = require("inquirer");

const promptMessages = {
  viewAll: "View all employees",
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
          console.log("So long!");
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
    console.table(res);
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
          `SELECT ER.id AS "Employee ID", ER.first_name AS "First Name",  ER.last_name AS "Last Name", roles.title AS "Employee Role", departments.department_name AS Department, roles.salary AS Salary, EM.first_name AS "Manager"
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
            console.table(res);
            prompt();
          }
        )
      );
  });
}
function viewByManager() {}
function addEmployee() {
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
        name: "employeeTitle",
        type: "input",
        message: "Please select new employee's job title."
      },
      {
        name: "department",
        type: "input",
        message: "Please select the new employee's new department."
      },

      {
        name: "manager",
        type: "input",
        message: "Please select new employee's manager."
      }
    ])
    .then(answer => {
      connection.query(
        "INSERT INTO employees SET ?",
        {
          first_name: answer.firstName,
          last_name: answer.lastName,
          title: answer.employeeTitle,
          department: answer.department,
          salary: answer.employeeSalary,
          manager: answer.manager
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
}
function removeEmployee() {
  inquirer.prompt([
    {
      name: "firstNameDelete",
      type: "input",
      message: "Enter the first name of the employee you would like to remove"
    },
    {
      name: "lastNameDelete",
      type: "input",
      message: "Enter the last name of the employee you would like to remove "
    }
  ]);
  connection.query("");
}
function updateEmployee() {}
function updateEmployeeRole() {}
function updateEmployeeManager() {}
