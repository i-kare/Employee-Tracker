var inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config();

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

const printRows = (rows, fields) =>{
    let output = "\n";
    for(let i = 0; i<fields.length; i++){
        let fieldName = fields[i].name;
        output+= fieldName
        output+= " "
    }
    output+= "\n"
    for(let i = 0; i<fields.length; i++){
        let fieldName = fields[i].name;
        for(let j = 0; j<fieldName.length; j++){
            output += "-"
        }
        output+= " "
    }
    for(let i = 0; i<rows.length;i++){
        let row = rows[i];
        output+= "\n";

        for(let j=0; j < fields.length; j++){
            let fieldName = fields[j].name
            let value = row[fieldName]
            if(!value){ // For fields that return ''
                value = "null";
            }
            output+= `${value} `
        }
    }
    output+= "\n";
    console.log(output)
}

// FUnction to determine which sql command to run
const runSQLCommand = async (answer) => {
    if (answer === "View all Employees") {
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

        const [rows,fields] = await connection.promise().query(query);
        printRows(rows,fields);
    } else if (answer === "Add Employee") {
        //TODO: Ask for first name and last name, and print out roles and choose, and print out managers and choose
        //TODO: SQL Query for Add Employee to employee
        //TODO: Print out added
    } else if (answer === "Update Employee Role") {
        //TODO: Need to ask question about Employee
        //TODO: list out all current employees, role to assign
        //TODO: Print out updated
        //TODO: Then take in values and use that in a SQL Update
    } else if (answer === "View All Roles") {
        const query = "SELECT roles.id, title, name as department, salary FROM roles INNER JOIN department on roles.department_id = department.id";
        const [rows,fields] = await connection.promise().query(query);
        printRows(rows,fields)
    } else if (answer === "Add Role") {
        //TODO: ASk for name, salary and department (list departments)
        //TODO: SQL Query for Add Role to roles
        //TODO: Print out add roles to db
    } else if (answer === "View All Departments") {
        const query = "SELECT id, name FROM department";
        const [rows,fields] = await connection.promise().query(query);
        printRows(rows,fields)
    } else if (answer === "Add Department") {
        await inquirer.prompt( [{
            type: 'input',
            message: 'What is the name of the department?',
            name: 'departmentName'
        }]).then(answer=> {
            const query = `INSERT INTO department (name) VALUES ("${answer.departmentName}")`
            connection.promise().query(query);
            console.log(`Added ${answer.departmentName} to the database`)
        })
    }
}

// Initializer function that asks user questions and then writes the svg
const init = async () => {
    let answer = await promptUser();

    while(answer.choice !== "Quit"){
        await runSQLCommand(answer.choice);
        answer = await promptUser();
    }
    console.log("Quitting App")
    connection.end();

    return;
};

// Function call to initialize app
init();