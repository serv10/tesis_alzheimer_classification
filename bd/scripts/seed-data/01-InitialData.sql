-- Datos iniciales para catálogos

-- Gender
IF NOT EXISTS (SELECT * FROM Gender)
BEGIN
    SET IDENTITY_INSERT Gender ON;
    INSERT INTO Gender (id, description) VALUES (1, 'Masculino');
    INSERT INTO Gender (id, description) VALUES (2, 'Femenino');
    INSERT INTO Gender (id, description) VALUES (3, 'Otro');
    SET IDENTITY_INSERT Gender OFF;
    PRINT 'Gender data inserted';
END
GO

-- UserType
IF NOT EXISTS (SELECT * FROM UserType)
BEGIN
    SET IDENTITY_INSERT UserType ON;
    INSERT INTO UserType (id, description) VALUES (1, 'Administrador');
    INSERT INTO UserType (id, description) VALUES (2, 'Paciente');
    SET IDENTITY_INSERT UserType OFF;
    PRINT 'UserType data inserted';
END
GO

-- ImageClassification (clasificaciones de Alzheimer)
-- Orden igual al modelo: mild=1, moderate=2, non=3, verymild=4
IF NOT EXISTS (SELECT * FROM ImageClassification)
BEGIN
    SET IDENTITY_INSERT ImageClassification ON;
    INSERT INTO ImageClassification (id, description) VALUES (1, 'Mild Demented');
    INSERT INTO ImageClassification (id, description) VALUES (2, 'Moderate Demented');
    INSERT INTO ImageClassification (id, description) VALUES (3, 'Non Demented');
    INSERT INTO ImageClassification (id, description) VALUES (4, 'Very Mild Demented');
    SET IDENTITY_INSERT ImageClassification OFF;
    PRINT 'ImageClassification data inserted';
END
GO
