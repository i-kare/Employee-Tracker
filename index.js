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

// FUnction to determine which sql command to run
const runSQLCommand = (answer) => {
    if(answer === "View all Employees"){
        const query = "SELECT id, first_name, last_name, role_id, manager_id FROM employee";
        connection.query(query, (err, results)=>{
            if(err) console.log(err);
            console.table(results);
        })
        promptUser();
    }
}

// Initializer function that asks user questions and then writes the svg
const init = () => {
    promptUser().then(({choice}) => runSQLCommand(choice))
};

// Function call to initialize app
init();

// View all employees id first_name last_name title department salary manager
// Add employees
// Update employee role
// View all roles
// Add roles id title department salary
// View all Departments  id name
// Add Department
// Quit
