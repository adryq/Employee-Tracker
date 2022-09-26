const express = require('express');
const inquirer = require('inquirer');
const ct = require('console.table');
const db = require('./db/connection');
const res = require('express/lib/response');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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

const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'deptInput',
            message: 'Enter name of the department:',
            validate: deptInput => {
                if (deptInput) {
                    return true;
                } else {
                    console.log('Please enter the department name.');
                    return false;
                }
            }
        }
    ])
    .then((input) => {
        db.query(`INSERT INTO department (name) VALUES (?)`, [input.deptInput], (err,res) => {
            if(err) throw err;
            console.log('\nNew Department Added!\n');
            menu();
        })
    })
};


const addRole = () => {
//to get choices for Departments
    const getDept = `SELECT department.name FROM department`;
    db.query(getDept, (err, res) => {
        if(err) throw err;
        const deptChoices = res.map(({name}) => (`${name}`));

    inquirer.prompt([
        {
            type: 'input',
            name: 'roleInput',
            message: 'What role would you like to add?',
            validate: roleInput => {
                if (roleInput) {
                    return true;
                } else {
                    console.log('Please enter a role.');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'salaryInput',
            message: 'Enter the salary amount for the new role.',
            validate: salaryInput => {
                if (!NaN) {
                    return true;
                }else {
                    console.log('Please enter a salary amount.');
                    return false;
                }
            }
        },
        {
            type: 'list',
            name: 'deptChoice',
            message: 'Select the department for this role:',
            choices: deptChoices
        }
    ])
    })
    .then((input) => {
// to get department id to use for role
        const dep =`SELECT department.id FROM department WHERE department.name = ?`;
        db.query(dep, [input.dept], (err, res) => {
           if (err) throw err;
           const deptId = res[0].id;
        
        const insert = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`;  
        const params = [input.roles_title, input.roles_salary, deptID];

        db.query(insert, params, (err, res) => {
            if(err) throw err;
            console.log('\nNew Role Added!\n');
            menu();
        })         
    })
})};

// const addEmployee = () => {
//     const roleQuery = `SELECT roles.title FROM Roles`;
//     db.query(roleQuery, (err, res) => {
//         if(err) throw err;
//         const roleChoices = res.map(({title}) => (`${title}`));
// })
//     inquirer.prompt([
//         {
//             type: 'input',
//             name: 'first_name',
//             message: 'Enter new employees first name:'
//         },
//         {
//             type: 'input',
//             name: 'last_name',
//             message: 'Enter new employees last name:'
//         },
//         {
//             type: 'list',
//             name: 'role',
//             message: 'Enter new employees role:',
//             choices: roleChoices,
//         },
//     ])
//     .then((anser) => {
//         db.query(`INSERT INTO Employees SET ?`)
//         console.log(
//             'Added' + anser.first_name + '' + anser.last_name + 'to our employees'
//         );
//         menu()

       
//     })
// }

// const updateEmployee = () => {
//     const employeeQuery = `SELECT employee.first_name FROM employee`;
//     db.query(employeeQuery, (err, res) => {
//         if(err) throw err;
//         const employeeChoices = res.map(({first_name}) => (`${first_name}`));
//     })
//     inquirer.prompt([
//         {
//             type: 'list',
//             name: 'choice',
//             message: 'Please select an employee to update',
//             choices: employeeChoices
//         }
//     ])
//     .then((response) => {
//         const saveName = response.choice;
//         db.query('SELECT * FROM employee', (err, results) => {
//             if(err) throw err;

//             inquirer.prompt([
//                 {
//                     type: 'list',
//                     name: 'role',
//                     message: 'Select title',
//                     choices: function () {
//                         choiceArr = [];
//                         for (i = 0; i < results.length; i++){
//                             choiceArr.push(results[i].roles_id)
//                         }
//                         return choiceArr;
//                     }
//                 },
//                 {
//                     type: 'number',
//                     name: 'manager',
                    
//                 },
//             ])
//             .then((answer) => {
//                 console.log(answer);
//                 console.log(saveName);
//                 db.query('UPDATE employees SET ? WHERE first_name = ?', [
//                     {
//                         roles_id: answer.role,
//                         manager_id: answer.manager,
//                     },
//                     saveName()
//                 ]),
//                 console.log('Employee Updated');
//                 menu()
//             })
//         })
//     })
// }
