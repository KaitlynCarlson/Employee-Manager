"use strict";
const mysql = require("mysql");
const cfonts = require("cfonts");
const consoleTable = require("console.table");
const inquirer = require("inquirer");

const promptMessages = {
  viewAll: "View all employees",
  viewRoles: "View all employees by role",
  viewAllByDepartment: "View all employees by department",
  addEmployee: "Add a new employee",
  addRole: "Add a new role",
  addDepartment: "Add a new department",
  removeEmployee: "Remove employee",
  updateEmployeeRole: "Update employee role",
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
        promptMessages.addEmployee,
        promptMessages.addRole,
        promptMessages.addDepartment,
        promptMessages.removeEmployee,
        promptMessages.updateEmployeeRole,
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
        case promptMessages.addEmployee:
          addEmployee();
          break;
        case promptMessages.addRole:
          addRole();
          break;
        case promptMessages.addDepartment:
          addDepartment();
          break;
        case promptMessages.removeEmployee:
          removeEmployee();
          break;
        case promptMessages.updateEmployeeRole:
          updateEmployeeRole();
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

function addEmployee() {
  const query = `SELECT * FROM roles ;`;
  connection.query(query, (err, res) => {
    const employeeRole = res.map(res => `${res.id} ${res.title}`);
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
  const query = "SELECT * FROM employees;";
  connection.query(query, (err, res) => {
    console.log(res);
    const employees = res.map(
      res => `${res.id} ${res.first_name} ${res.last_name}`
    );
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
        const str = answer.employeeDelete;
        var res = str.replace(/\D/g, "");
        console.log(res);
        connection.query("DELETE FROM employees WHERE id=?;", [res], err => {
          if (err) throw err;
          console.log(`${answer.employeeDelete} successfully removed!`);
          prompt();
        });
      });
  });
}
function updateEmployeeRole() {
  const query = `SELECT * FROM employees`;
  connection.query(query, (err, res) => {
    const employees = res.map(
      res => `${res.id} ${res.first_name} ${res.last_name}`
    );
    inquirer
      .prompt({
        name: "whichEmployeeUpdate",
        type: "list",
        message: "Which employee's role would you like to update?",
        choices: employees
      })
      .then(answer => {
        let employee = answer.whichEmployeeUpdate;
        let employeeId = employee.replace(/\D/g, "");
        inquirer
          .prompt({
            name: "updateRoleTo",
            type: "input",
            message: "What is the new role title?"
          })
          .then(answer2 => {
            connection.query(
              `SELECT * FROM roles WHERE title=?`,
              [answer2.updateRoleTo],
              (err, res) => {
                const newRoleId = res.map(res => `${res.id}`);
                console.log(newRoleId);
                console.log(employeeId);
                updateEmployee(newRoleId, employeeId);
              }
            );
          });
      });
  });
}
function addDepartment() {
  inquirer
    .prompt({
      name: "department",
      type: "input",
      message: "What department would you like to add?"
    })
    .then(answer => {
      connection.query(
        "INSERT INTO departments(department_name) VALUES(?);",
        [answer.department],
        err => {
          if (err) throw err;
          console.log(
            `${answer.department} successfully added as a new department!`
          );
          prompt();
        }
      );
    });
}

function addRole() {
  const query = `SELECT * FROM departments;`;
  connection.query(query, (err, res) => {
    const departments = res.map(res => `${res.id} ${res.department_name}`);
    inquirer
      .prompt({
        name: "addRoleDepartment",
        type: "list",
        message: "Which department will the new role be in?",
        choices: departments
      })
      .then(answer => {
        let department = answer.addRoleDepartment;
        let departmentId = department.replace(/\D/g, "");
        console.log(departmentId);
        inquirer
          .prompt({
            name: "addRoleTitle",
            type: "input",
            message: "What is the new role title?"
          })
          .then(answer2 => {
            connection.query(
              "INSERT INTO roles(title, salary, department_id) VALUES(?,?,?);",
              [answer2.addRoleTitle, answer2.addRoleSalary, departmentId],
              err => {
                if (err) throw err;
                console.log(
                  `${answer2.addRoleTitle} successfully added as a new role!`
                );
                addRoleSalary();
              }
            );
          });
      });
  });
}
function addRoleSalary() {
  const query = `SELECT * FROM roles;`;
  connection.query(query, (err, res) => {
    const roles = res.map(res => `${res.title}`);
    inquirer
      .prompt({
        name: "addRoleSalary",
        type: "list",
        message: "Which role's salary would you like to add?",
        choices: roles
      })
      .then(answer => {
        console.log(answer.addRoleSalary);
        inquirer
          .prompt({
            name: "addRoleSalaryTo",
            type: "input",
            message: `Please include only the numbers: What is the salary for ${answer.addRoleSalary}? `
          })
          .then(answer2 => {
            connection.query(
              `UPDATE roles
              SET salary=?
              WHERE title=?;`,
              [answer2.addRoleSalaryTo, answer.addRoleSalary],
              err => {
                if (err) throw err;
                console.log(
                  `${answer2.addRoleSalaryTo} salary successfully updated!`
                );
                prompt();
              }
            );
          });
      });
  });
}
function updateEmployee(a, b) {
  connection.query(
    `UPDATE employees
    SET role_id=?
    WHERE id=?;`,
    [a, b],
    (err, res) => {
      console.log("Success!");
    }
  );
}
