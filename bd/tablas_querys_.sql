DROP DATABASE IF EXISTS alzheimer_classification;

CREATE DATABASE alzheimer_classification;

USE alzheimer_classification;

CREATE TABLE UserType (
	id INT AUTO_INCREMENT PRIMARY KEY,
    Description VARCHAR(20) NOT NULL
);

CREATE TABLE User (
	dni VARCHAR(8) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
	last_name VARCHAR(255) NOT NULL,
    password VARCHAR(255),
    user_type INT NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_type) REFERENCES UserType(id)
);

CREATE TABLE Image (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    path VARCHAR(255),
    extension VARCHAR(10),
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR(8),
    FOREIGN KEY (user_id) REFERENCES User(dni)
);

INSERT INTO UserType (Description) VALUES ("medico"), ("paciente");

INSERT INTO User (dni, name, last_name, password, user_type)
VALUES ('71696801', 'Doctor', 'Apellido', '123', 1);

INSERT INTO User (dni,  name, last_name, user_type)
VALUES 
	('71696802', 'Paciente1', 'Apellido1', 2),
	('71696803', 'Paciente2', 'Apellido2', 2);

INSERT INTO Image (name, path, extension, user_id)
VALUES ('imagen1', '/ruta/de/imagen1.jpg', 'jpg', '71696801');

CREATE TABLE ImageClassification (
	id INT AUTO_INCREMENT PRIMARY KEY,
    Description VARCHAR(20) NOT NULL
);

INSERT INTO ImageClassification (Description) 
VALUES
	("NON DEMENTED"),
	("VERY MILD DEMENTED"),
    ("MILD DEMENTED"),
    ("MODERATE DEMENTED");
    
TRUNCATE TABLE Image;
    
ALTER TABLE Image
ADD COLUMN real_value INT NOT NULL,
ADD COLUMN prediction_value INT NOT NULL,
ADD CONSTRAINT fk_real_value FOREIGN KEY (real_value) REFERENCES ImageClassification(id),
ADD CONSTRAINT fk_prediction_value FOREIGN KEY (prediction_value) REFERENCES ImageClassification(id);

INSERT INTO Image (name, path, extension, user_id,real_value,prediction_value)
VALUES ('imagen1', '/ruta/de/imagen1.jpg', 'jpg', '71696801',1,1);

----
ALTER TABLE Image DROP FOREIGN KEY image_ibfk_1;
TRUNCATE TABLE Image;
TRUNCATE TABLE User;
ALTER TABLE Image ADD CONSTRAINT image_ibfk_1 FOREIGN KEY (user_id) REFERENCES User(dni);

ALTER TABLE USER
ADD COLUMN birth_date DATE NOT NULL;

INSERT INTO User (dni, name, last_name, password, user_type, birth_date)
VALUES ('71696801', 'Doctor', 'Apellido', '123', 1, "1980-12-12");

INSERT INTO User (dni,  name, last_name, user_type, birth_date)
VALUES 
	('71696802', 'Paciente1', 'Apellido1', 2, "1980-12-12"),
	('71696803', 'Paciente2', 'Apellido2', 2, "1950-01-23");
    
INSERT INTO Image (name, path, extension, user_id,real_value,prediction_value)
VALUES ('imagen1', '/ruta/de/imagen1.jpg', 'jpg', '71696801',1,1);
