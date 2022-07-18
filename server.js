const inquirer = require('inquirer');
const ct = require('console.table');
const db = require('./db/connection');

db.connect((err) => {
    if(err) {
        throw err
    } else {
        console.log('et database connected');
        menu();
    }
});

function menu() {
    inquirer.prompt({
        type: 'list',
        name: 'mainmenu',
        message: 'Please select what you would like to do:',
        choices: [
            'View All Departments',
            'View All Roles',
            'View All Employees',
            'Add a Department',
            'Add a Role',
            'Add an Employee',
            'Update an Employee Role'
        ]})
        .then(input => {
            switch(input.mainmenu){
                case 'View All Departments':
                    viewDepartment();
                    break;
                case 'View All Roles':
                    viewRoles();
                    break;
                case 'View All Employees':
                    viewEmployees();
                    break;
                case 'Add a Department':
                    addDepartment();
                    break;
                case 'Add a Role':
                    addRole();
                    break;
                case 'Add an Employee':
                    addEmployee();
                    break;
                case 'Update an Employee Role':
                    updateEmployee();
                    break;                       
            }

        })
};

const viewDepartment = () => {
    console.log(`\n Departments: \n`);
    db.query(
        `SELECT * FROM department`, (err, res) => {
            if (err) throw err;
            console.table(res);
            menu();
        }
    )
};


const viewRoles = () => {
    console.log(`\n Roles: \n`);
    db.query( `SELECT roles.id,
                roles.title,
                roles.salary,
                department.name AS department 
                FROM roles INNER JOIN department 
                ON roles.department_id = department.id`, (err, res) => {
                    if(err) throw err;
                    console.table(res);
                    menu();
                }  
    )};
 
const viewEmployees = () => {
    console.log(`\n Employees: \n`);
    db.query(`SELECT employee.id,
               employee.first_name,
               employee.last_name,
               roles.title,
               department.name AS department,
               roles.salary,
               CONCAT (manager.first_name, manager.last_name) AS manager
               FROM employee
               LEFT JOIN roles ON employee.roles_id = roles.id
               LEFT JOIN department ON roles.department_id = department.id
               LEFT JOIN employee manager ON employee.manager_id = manager.id`, (err, res) => {
                if(err) throw err;
                console.table(res);
                menu(); 
               })
};





