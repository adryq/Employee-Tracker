INSERT INTO department (name) VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');

INSERT INTO roles (title, salary, department_id) VALUES
    ('Salesperson', 200000, 1),
    ('Sales Closer', 70000, 1),
    ('Junior Engineer', 100000, 2),
    ('Lead Engineer', 250000, 2),
    ('Accountant', 150000, 3),
    ('Account Manager', 155000, 3),
    ('Lawyer', 200000, 4),
    ('Legal Team Lead', 190000, 4);

INSERT INTO employee (first_name, last_name, roles_id, manager_id) VALUES
    ('Sara', 'White', 1, NULL),
    ('Emily', 'Cortez', 2, NULL),
    ('Michael', 'Chan', 3, NULL),
    ('Ruida', 'Albakry', 4, NULL),
    ('Adry', 'Castro', 5, NULL),
    ('Ana', 'Rodriguez', 6, 1),
    ('Johana', 'Calderon', 7, NULL),
    ('Alex', 'Bello', 8, NULL);
