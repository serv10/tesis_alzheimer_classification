-- Datos de prueba para gráficos
-- Crea pacientes de diferentes edades con exámenes de Alzheimer

-- Primero crear imágenes de prueba
IF NOT EXISTS (SELECT * FROM [Image] WHERE name LIKE 'test_mri_%')
BEGIN
    INSERT INTO [Image] (name, path, extension) VALUES
    ('test_mri_001', '/uploads/test/mri_001.jpg', 'jpg'),
    ('test_mri_002', '/uploads/test/mri_002.jpg', 'jpg'),
    ('test_mri_003', '/uploads/test/mri_003.jpg', 'jpg'),
    ('test_mri_004', '/uploads/test/mri_004.jpg', 'jpg'),
    ('test_mri_005', '/uploads/test/mri_005.jpg', 'jpg'),
    ('test_mri_006', '/uploads/test/mri_006.jpg', 'jpg'),
    ('test_mri_007', '/uploads/test/mri_007.jpg', 'jpg'),
    ('test_mri_008', '/uploads/test/mri_008.jpg', 'jpg'),
    ('test_mri_009', '/uploads/test/mri_009.jpg', 'jpg'),
    ('test_mri_010', '/uploads/test/mri_010.jpg', 'jpg'),
    ('test_mri_011', '/uploads/test/mri_011.jpg', 'jpg'),
    ('test_mri_012', '/uploads/test/mri_012.jpg', 'jpg'),
    ('test_mri_013', '/uploads/test/mri_013.jpg', 'jpg'),
    ('test_mri_014', '/uploads/test/mri_014.jpg', 'jpg'),
    ('test_mri_015', '/uploads/test/mri_015.jpg', 'jpg'),
    ('test_mri_016', '/uploads/test/mri_016.jpg', 'jpg'),
    ('test_mri_017', '/uploads/test/mri_017.jpg', 'jpg'),
    ('test_mri_018', '/uploads/test/mri_018.jpg', 'jpg'),
    ('test_mri_019', '/uploads/test/mri_019.jpg', 'jpg'),
    ('test_mri_020', '/uploads/test/mri_020.jpg', 'jpg'),
    ('test_mri_021', '/uploads/test/mri_021.jpg', 'jpg'),
    ('test_mri_022', '/uploads/test/mri_022.jpg', 'jpg'),
    ('test_mri_023', '/uploads/test/mri_023.jpg', 'jpg'),
    ('test_mri_024', '/uploads/test/mri_024.jpg', 'jpg'),
    ('test_mri_025', '/uploads/test/mri_025.jpg', 'jpg'),
    ('test_mri_026', '/uploads/test/mri_026.jpg', 'jpg'),
    ('test_mri_027', '/uploads/test/mri_027.jpg', 'jpg'),
    ('test_mri_028', '/uploads/test/mri_028.jpg', 'jpg'),
    ('test_mri_029', '/uploads/test/mri_029.jpg', 'jpg'),
    ('test_mri_030', '/uploads/test/mri_030.jpg', 'jpg');
    PRINT 'Test images inserted';
END
GO

-- Crear pacientes de prueba con diferentes edades
IF NOT EXISTS (SELECT * FROM [User] WHERE dni LIKE '9999%')
BEGIN
    -- Pacientes jóvenes (50-60 años)
    INSERT INTO [User] (dni, name, last_name, password, id_user_type, id_gender, birth_date) VALUES
    ('99990001', 'Maria', 'Garcia', NULL, 2, 2, '1970-03-15'),
    ('99990002', 'Juan', 'Lopez', NULL, 2, 1, '1972-07-22'),
    ('99990003', 'Ana', 'Martinez', NULL, 2, 2, '1968-11-08'),
    ('99990004', 'Carlos', 'Rodriguez', NULL, 2, 1, '1971-05-30'),
    ('99990005', 'Laura', 'Fernandez', NULL, 2, 2, '1969-09-12'),

    -- Pacientes mediana edad (60-70 años)
    ('99990006', 'Pedro', 'Sanchez', NULL, 2, 1, '1960-02-18'),
    ('99990007', 'Carmen', 'Gomez', NULL, 2, 2, '1958-06-25'),
    ('99990008', 'Miguel', 'Diaz', NULL, 2, 1, '1962-10-03'),
    ('99990009', 'Rosa', 'Perez', NULL, 2, 2, '1959-04-14'),
    ('99990010', 'Antonio', 'Ruiz', NULL, 2, 1, '1961-08-29'),

    -- Pacientes mayores (70-80 años)
    ('99990011', 'Josefa', 'Moreno', NULL, 2, 2, '1950-01-07'),
    ('99990012', 'Francisco', 'Jimenez', NULL, 2, 1, '1952-12-19'),
    ('99990013', 'Teresa', 'Hernandez', NULL, 2, 2, '1948-03-26'),
    ('99990014', 'Manuel', 'Alvarez', NULL, 2, 1, '1951-07-11'),
    ('99990015', 'Dolores', 'Romero', NULL, 2, 2, '1949-11-02'),

    -- Pacientes muy mayores (80+ años)
    ('99990016', 'Jose', 'Torres', NULL, 2, 1, '1942-05-08'),
    ('99990017', 'Pilar', 'Navarro', NULL, 2, 2, '1940-09-21'),
    ('99990018', 'Ramon', 'Gil', NULL, 2, 1, '1944-02-14'),
    ('99990019', 'Lucia', 'Molina', NULL, 2, 2, '1941-06-30'),
    ('99990020', 'Andres', 'Ortega', NULL, 2, 1, '1943-10-17');

    PRINT 'Test patients inserted';
END
GO

-- Crear exámenes con predicciones variadas para matriz de confusión realista
-- ImageClassification: 1=NonDemented, 2=VeryMildDemented, 3=MildDemented, 4=ModerateDemented
IF NOT EXISTS (SELECT * FROM ImagePatient WHERE id_user LIKE '9999%')
BEGIN
    DECLARE @imgStart INT = (SELECT MIN(id) FROM [Image] WHERE name LIKE 'test_mri_%');

    -- NonDemented real (mayormente predicho correctamente)
    INSERT INTO ImagePatient (id_user, id_image, real_value, prediction_value) VALUES
    ('99990001', @imgStart + 0, 1, 1),   -- Correcto
    ('99990002', @imgStart + 1, 1, 1),   -- Correcto
    ('99990003', @imgStart + 2, 1, 1),   -- Correcto
    ('99990004', @imgStart + 3, 1, 2),   -- Error: predicho como VeryMild
    ('99990005', @imgStart + 4, 1, 1),   -- Correcto

    -- VeryMildDemented real (algo de confusión con NonDemented y Mild)
    ('99990006', @imgStart + 5, 2, 2),   -- Correcto
    ('99990007', @imgStart + 6, 2, 2),   -- Correcto
    ('99990008', @imgStart + 7, 2, 1),   -- Error: predicho como Non
    ('99990009', @imgStart + 8, 2, 3),   -- Error: predicho como Mild
    ('99990010', @imgStart + 9, 2, 2),   -- Correcto

    -- MildDemented real (confusión con VeryMild y Moderate)
    ('99990011', @imgStart + 10, 3, 3),  -- Correcto
    ('99990012', @imgStart + 11, 3, 3),  -- Correcto
    ('99990013', @imgStart + 12, 3, 2),  -- Error: predicho como VeryMild
    ('99990014', @imgStart + 13, 3, 4),  -- Error: predicho como Moderate
    ('99990015', @imgStart + 14, 3, 3),  -- Correcto

    -- ModerateDemented real (mayormente correcto, algunos como Mild)
    ('99990016', @imgStart + 15, 4, 4),  -- Correcto
    ('99990017', @imgStart + 16, 4, 4),  -- Correcto
    ('99990018', @imgStart + 17, 4, 3),  -- Error: predicho como Mild
    ('99990019', @imgStart + 18, 4, 4),  -- Correcto
    ('99990020', @imgStart + 19, 4, 4);  -- Correcto

    -- Más exámenes para tener más datos
    INSERT INTO ImagePatient (id_user, id_image, real_value, prediction_value) VALUES
    ('99990001', @imgStart + 20, 1, 1),
    ('99990006', @imgStart + 21, 2, 2),
    ('99990011', @imgStart + 22, 3, 3),
    ('99990016', @imgStart + 23, 4, 4),
    ('99990002', @imgStart + 24, 1, 1),
    ('99990007', @imgStart + 25, 2, 2),
    ('99990012', @imgStart + 26, 3, 3),
    ('99990017', @imgStart + 27, 4, 4),
    ('99990003', @imgStart + 28, 1, 1),
    ('99990008', @imgStart + 29, 2, 2);

    PRINT 'Test examinations inserted';
END
GO

PRINT 'Chart test data setup complete!';
GO
