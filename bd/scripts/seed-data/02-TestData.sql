-- Datos de prueba para desarrollo

-- Pacientes de prueba
IF NOT EXISTS (SELECT * FROM [User] WHERE dni = '12345678')
BEGIN
    INSERT INTO [User] (dni, name, last_name, id_user_type, id_gender, birth_date) VALUES
        ('12345678', 'Juan', 'Perez Garcia', 2, 1, '1955-03-15'),
        ('23456789', 'Maria', 'Lopez Rodriguez', 2, 2, '1960-07-22'),
        ('34567890', 'Carlos', 'Martinez Sanchez', 2, 1, '1948-11-08'),
        ('45678901', 'Ana', 'Gonzalez Fernandez', 2, 2, '1972-04-30'),
        ('56789012', 'Pedro', 'Hernandez Diaz', 2, 1, '1965-09-12'),
        ('67890123', 'Lucia', 'Ruiz Moreno', 2, 2, '1958-01-25'),
        ('78901234', 'Miguel', 'Jimenez Torres', 2, 1, '1980-06-18'),
        ('89012345', 'Carmen', 'Romero Navarro', 2, 2, '1945-12-03');
    PRINT 'Test patients inserted';
END
GO

-- Imagenes de prueba
IF NOT EXISTS (SELECT * FROM Image WHERE name = 'mri_scan_001')
BEGIN
    INSERT INTO Image (name, path, extension) VALUES
        ('mri_scan_001', '/uploads/mri_scan_001.jpg', 'jpg'),
        ('mri_scan_002', '/uploads/mri_scan_002.jpg', 'jpg'),
        ('mri_scan_003', '/uploads/mri_scan_003.jpg', 'jpg'),
        ('mri_scan_004', '/uploads/mri_scan_004.jpg', 'jpg'),
        ('mri_scan_005', '/uploads/mri_scan_005.jpg', 'jpg'),
        ('mri_scan_006', '/uploads/mri_scan_006.jpg', 'jpg'),
        ('mri_scan_007', '/uploads/mri_scan_007.jpg', 'jpg'),
        ('mri_scan_008', '/uploads/mri_scan_008.jpg', 'jpg'),
        ('mri_scan_009', '/uploads/mri_scan_009.jpg', 'jpg'),
        ('mri_scan_010', '/uploads/mri_scan_010.jpg', 'jpg'),
        ('mri_scan_011', '/uploads/mri_scan_011.jpg', 'jpg'),
        ('mri_scan_012', '/uploads/mri_scan_012.jpg', 'jpg');
    PRINT 'Test images inserted';
END
GO

-- Examenes de pacientes (ImagePatient)
IF NOT EXISTS (SELECT * FROM ImagePatient WHERE id_user = '12345678')
BEGIN
    INSERT INTO ImagePatient (id_user, id_image, real_value, prediction_value) VALUES
        -- Juan Perez - 2 examenes
        ('12345678', 1, 1, 1),  -- Non Demented (correcto)
        ('12345678', 2, 2, 2),  -- Very Mild Demented (correcto)
        -- Maria Lopez - 2 examenes
        ('23456789', 3, 3, 3),  -- Mild Demented (correcto)
        ('23456789', 4, 2, 3),  -- Very Mild real, Mild prediccion
        -- Carlos Martinez - 1 examen
        ('34567890', 5, 4, 4),  -- Moderate Demented (correcto)
        -- Ana Gonzalez - 2 examenes
        ('45678901', 6, 1, 1),  -- Non Demented (correcto)
        ('45678901', 7, 1, 2),  -- Non real, Very Mild prediccion
        -- Pedro Hernandez - 1 examen
        ('56789012', 8, 2, 2),  -- Very Mild Demented (correcto)
        -- Lucia Ruiz - 2 examenes
        ('67890123', 9, 3, 2),  -- Mild real, Very Mild prediccion
        ('67890123', 10, 4, 4), -- Moderate Demented (correcto)
        -- Miguel Jimenez - 1 examen
        ('78901234', 11, 1, 1), -- Non Demented (correcto)
        -- Carmen Romero - 1 examen
        ('89012345', 12, 4, 3); -- Moderate real, Mild prediccion
    PRINT 'Test examinations inserted';
END
GO

PRINT 'Test data seeding completed!';
GO
