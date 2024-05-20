DELIMITER //

CREATE FUNCTION CheckPatientExistence(p_dni VARCHAR(8))
RETURNS BOOLEAN
DETERMINISTIC
BEGIN
    RETURN (SELECT COUNT(*) FROM User WHERE dni = p_dni) > 0;
END //

CREATE PROCEDURE RegisterUser (
    IN p_dni VARCHAR(8),
    IN p_name VARCHAR(255),
    IN p_last_name VARCHAR(255),
    IN p_password VARCHAR(255),
    IN p_birth_date DATE
)
BEGIN
	IF (p_password = 0) THEN
		INSERT INTO User (dni, name, last_name, user_type, birth_date)
		VALUES (p_dni, p_name, p_last_name, 2, p_birth_date);
	ELSE
		INSERT INTO Usuario (dni, name, las_name, password, user_type, birth_date)
		VALUES (p_dni, p_name, p_last_name,p_password, 1, p_birth_date);
    END IF; 
        
	SELECT 1 AS resultado, 'Patient successfully registered' AS mensaje;
END //

CREATE PROCEDURE ExaminePatient (
	IN p_dni VARCHAR(8),
    IN p_name VARCHAR(255),
    IN p_last_name VARCHAR(255),
    IN p_password VARCHAR(255),
    IN p_image_path VARCHAR(255),
    IN p_real_prediction INT,
    IN p_value_prediction INT,
    IN p_birth_date DATE
)
BEGIN
	-- 1. Obtener el nombre y la extension de la ruta
    DECLARE image_name_extension VARCHAR(255) DEFAULT SUBSTRING_INDEX(p_image_path, '/', -1);
    DECLARE image_name VARCHAR (255) DEFAULT SUBSTRING_INDEX(image_name_extension, ".", 1);
    DECLARE image_extension VARCHAR (255) DEFAULT SUBSTRING_INDEX(image_name_extension, ".", -1);
	-- 2. Verificar existencia del paciente ingresado
    IF CheckPatientExistence(p_dni) = 0 THEN
		-- 3. Si no existe, registrarlo 
		CALL RegisterUser(p_dni,p_name,p_last_name,p_password,p_birth_date);
    END IF;
	-- 4. Asociar la imagen al paciente
	INSERT INTO Image (name, path, extension, user_id, real_value, prediction_value)
	VALUES (image_name, p_image_path, image_extension, p_dni, p_real_prediction, p_value_prediction);
END //

-- 19/05/2024

CREATE PROCEDURE GetAlzheimerCountsByClass()
BEGIN
	SELECT IC.Description, COUNT(*) Count
	FROM User U
		JOIN Image I ON I.user_id = U.dni
		JOIN ImageClassification IC ON IC.id = I.real_value
	GROUP BY IC.Description
	ORDER BY FIELD(IC.Description, 'Non Demented', 'Very Mild Demented', 'Mild Demented', 'Moderate Demented');
END //



CREATE PROCEDURE GetPredictionCountsByClass()
BEGIN
	SELECT IC.Description, COUNT(*) Count
	FROM User U
		JOIN Image I ON I.user_id = U.dni
		JOIN ImageClassification IC ON IC.id = I.prediction_value
	GROUP BY IC.Description
	ORDER BY FIELD(IC.Description, 'Non Demented', 'Very Mild Demented', 'Mild Demented', 'Moderate Demented');
END //

CREATE PROCEDURE GetAlzheimerCountsByAgeAndType()
BEGIN
	SELECT IC.Description, FLOOR(DATEDIFF(CURDATE(), U.birth_date) / 365.25) AS Age,COUNT(*) Count
	FROM User U
		JOIN Image I ON I.user_id = U.dni
		JOIN ImageClassification IC ON IC.id = I.real_value
	WHERE U.user_type <> 1
	GROUP BY Age, IC.Description
	ORDER BY Age;
END //

DELIMITER ;
