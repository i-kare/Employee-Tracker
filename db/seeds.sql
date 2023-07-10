INSERT INTO department (id, name)
VALUES (1, "Finance"),
       (2, "Marketing"),
       (3, "Content")

INSERT INTO roles (title,salary,department_id)
VALUES ("Manager",100000, 1),
       ("Employee",10000, 1),
       ("Manager",100000, 2),
       ("Employee",10000, 2),
       ("Manager",100000, 3),
       ("Employee",10000, 3)

INSERT INTO employee (id,first_name,last_name,role_id,manager_id)
VALUES  (1, "John", "Doe", 2, null)
        (2, "Manager", "Doe", 1, null),
        (3, "Sad", "Doe", 2, 2),
        (4, "Roger", "Doe", 3, null)