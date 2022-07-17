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
};



