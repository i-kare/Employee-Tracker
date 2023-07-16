# Employee-Tracker
6.26.23 SQL: A command-line application that manages a company's employee database, using Node.js, Inquirer, and MySQL

## Acceptance Criteria
1.WHEN I start the application THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role

2.WHEN I choose to view all departments THEN I am presented with a formatted table showing department names and department ids

3.WHEN I choose to view all roles THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role

4.WHEN I choose to view all employees THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to

5.WHEN I choose to add a department THEN I am prompted to enter the name of the department and that department is added to the database

6.WHEN I choose to add a role THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database

7.WHEN I choose to add an employee THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database

8.WHEN I choose to update an employee role THEN I am prompted to select an employee to update and their new role and this information is updated in the database

## Video of Application
https://drive.google.com/file/d/1HQF2gyxvYrtRHjPq86LjnaFUeoHWgrFa/view?usp=sharing

## How to run application
1. Run npm install so all packages are properly installed 
2. Create .env file like the .env.sample and fill out the db password
3. Run mysql -u root -p in the project folder
4. While you're in the sql console, run source db/schema.sql and seeds.sql
5. Then exit out of console and run npm start