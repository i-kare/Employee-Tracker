USE employee_tracker;

INSERT INTO department (name)
VALUES ("Finance"),
       ("Marketing"),
       ("Content");

INSERT INTO roles (title,salary,department_id)
VALUES ("Finance Manager", 200, 1),
       ("Finance Employee", 300, 1),
       ("Marketing Manager", 4000, 2),
       ("Marketing Employee", 5000, 2),
       ("Content Manager", 600, 3),
       ("Content Employee", 7000, 3);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES  ("John", "Doe", 2, null),
        ("Manager", "Doe", 1, null),
        ("Sad", "Doe", 2, 2),
        ("Roger", "Doe", 3, null);