import inquirer from 'inquirer';
import mysql from 'mysql2';
import figlet from "figlet"; // to print out the title 
import boxen from 'boxen'; // to print out a box

import 'dotenv/config'; // require dotenv so we can provide sql password

// create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// An array of questions for the user
const questions =
    [{
        type: 'list',
        message: 'What would you like to do?',
        name: 'choice',
        choices: [
            "View all Employees",
            "Add Employee",
            'Update Employee Role',
            'View All Roles',
            'Add Role',
            'View All Departments',
            'Add Department',
            "Quit",
        ],
    }]

// Ask user questions
const promptUser = () => {
    return inquirer.prompt(questions)
}

// Print out the database rows in pretty form
const printRows = (rows, fields) => {
    let output = "\n";
    for (let i = 0; i < fields.length; i++) {
        let fieldName = fields[i].name;
        output += fieldName
        output += " "
    }
    output += "\n"
    for (let i = 0; i < fields.length; i++) {
        let fieldName = fields[i].name;
        for (let j = 0; j < fieldName.length; j++) {
            output += "-"
        }
        output += " "
    }
    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        output += "\n";

        for (let j = 0; j < fields.length; j++) {
            let fieldName = fields[j].name
            let value = row[fieldName]
            if (!value) { // For fields that return ''
                value = "null";
            }
            output += `${value} `
        }
    }
    output += "\n";
    console.log(output)
}

// Function to determine which sql command to run
const runSQLCommand = async (answer) => {
    if (answer === "View all Employees") { //If they choose view all employees, then run this select query and print out the rows
        const query =
            `SELECT e.id, e.first_name, e.last_name, title, d.name as department, r.salary, CONCAT_WS(" ", e2.first_name, e2.last_name) as manager 
        FROM employee e
        INNER JOIN roles r 
        on e.role_id = r.id
        INNER JOIN department d
        on r.department_id = d.id
        LEFT JOIN employee e2
        on e.manager_id = e2.id
        `;

        const [rows, fields] = await connection.promise().query(query);
        printRows(rows, fields);
    } else if (answer === "Add Employee") { //If they add employee, then ask for user information, their role and manager, and then run an insert query
        const getRolesQuery = `SELECT id as value, title as name FROM roles`
        const [rolesRows] = await connection.promise().query(getRolesQuery);
        const getManagersQuery = `SELECT e.id as value, CONCAT_WS(" ", e.first_name, e.last_name) as name 
        FROM employee e 
        INNER JOIN employee e2
        on e.id = e2.manager_id`;
        let managerRows = { "value": null, "name": "None" }
        const [managerDbRows] = await connection.promise().query(getManagersQuery);
        managerRows = [managerRows, ...managerDbRows];
        await inquirer.prompt([{
            type: 'input',
            message: "What is the employee's first name?",
            name: 'first_name'
        },
        {
            type: 'input',
            message: "What is the employee's last name?",
            name: 'last_name'
        },
        {
            type: 'list',
            message: "What is the employee's role?",
            name: 'role',
            choices: rolesRows,
        },
        {
            type: 'list',
            message: "Who is the employee's manager?",
            name: 'manager',
            choices: managerRows,
        }
        ]).then(answers => {
            const insertQuery = `INSERT INTO employee (first_name, last_name, role_id, manager_id) 
            VALUES ("${answers.first_name}", "${answers.last_name}", ${answers.role}, ${answers.manager})`
            connection.promise().query(insertQuery);
            console.log(`Added ${answers.first_name} ${answers.last_name} to the database`)
        })
    } else if (answer === "Update Employee Role") { // if they choose update, then we will ask which employee and role, then run update query
        const getEmployeeQuery = `SELECT id as value, CONCAT_WS(" ", first_name, last_name) as name FROM employee`
        const getRoleQuery = `SELECT roles.id as value, title as name FROM roles`;
        const [employeeRows] = await connection.promise().query(getEmployeeQuery);
        const [rolesRows] = await connection.promise().query(getRoleQuery);
        await inquirer.prompt([{
            type: 'list',
            message: "Which employee's role do you want to update?",
            name: 'employee',
            choices: employeeRows
        },
        {
            type: 'list',
            message: "Which role do you want to assign the selected employee?",
            name: 'role',
            choices: rolesRows
        }
        ]).then(answers => {
            const updateQuery = `UPDATE employee set role_id = ${answers.role}  WHERE id = ${answers.employee}`
            connection.promise().query(updateQuery);
            console.log(`Updated employee's role`)
        })
    } else if (answer === "View All Roles") { // if they choose view all roles, run a select query for roles table
        const query = "SELECT roles.id, title, name as department, salary FROM roles INNER JOIN department on roles.department_id = department.id";
        const [rows, fields] = await connection.promise().query(query);
        printRows(rows, fields)
    } else if (answer === "Add Role") { // if they choose add role, then we will ask name, salary and department, then do an insert query
        const getQuery = `SELECT id as value, name from department`
        const [rows] = await connection.promise().query(getQuery);
        await inquirer.prompt([{
            type: 'input',
            message: 'What is the name of the role?',
            name: 'role'
        },
        {
            type: 'number',
            message: 'What is the salary of the role?',
            name: 'salary'
        },
        {
            type: 'list',
            message: 'Which department does the role belong to?',
            name: 'department',
            choices: rows,
        }
        ]).then(answers => {
            const insertQuery = `INSERT INTO roles (title, salary, department_id) 
            VALUES ("${answers.role}", ${answers.salary}, ${answers.department})`
            connection.promise().query(insertQuery);
            console.log(`Added ${answers.role} to the database`)
        })
    } else if (answer === "View All Departments") { // if they choose view all departments then run a select from departments query
        const query = "SELECT id, name FROM department";
        const [rows, fields] = await connection.promise().query(query);
        printRows(rows, fields)
    } else if (answer === "Add Department") { // if they choose add department then run an insert after asking department name
        await inquirer.prompt([{
            type: 'input',
            message: 'What is the name of the department?',
            name: 'departmentName'
        }]).then(answer => {
            const query = `INSERT INTO department (name) VALUES ("${answer.departmentName}")`
            connection.promise().query(query);
            console.log(`Added ${answer.departmentName} to the database`)
        })
    }
}

//Function to print out the title with nice font and a box
const printTitle = () => {
    console.log(
        boxen(
            figlet.textSync(
                "Employee Manager",
                {
                    font: "big",
                    horizontalLayout: "fitted",
                    verticalLayout: "full",
                    width: 80,
                    whitespaceBreak: true,
                }))
    );
}

// Initializer function that asks user questions and then only ends the connection if they quit
const init = async () => {
    printTitle();

    let answer = await promptUser();

    while (answer.choice !== "Quit") {
        await runSQLCommand(answer.choice);
        answer = await promptUser();
    }
    console.log("Quitting App")
    connection.end();

    return;
};

// Function call to initialize app
init();