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
    IN p_password VARCHAR(255)
)
BEGIN
	IF (p_password = 0) THEN
		INSERT INTO User (dni, name, last_name, user_type)
		VALUES (p_dni, p_name, p_last_name, 2);
	ELSE
		INSERT INTO Usuario (dni, name, las_name, password, user_type)
		VALUES (p_dni, p_name, p_last_name,p_password, 1);
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
    IN p_value_prediction INT
)
BEGIN
	-- 1. Obtener el nombre y la extension de la ruta
    DECLARE image_name_extension VARCHAR(255) DEFAULT SUBSTRING_INDEX(p_image_path, '/', -1);
    DECLARE image_name VARCHAR (255) DEFAULT SUBSTRING_INDEX(image_name_extension, ".", 1);
    DECLARE image_extension VARCHAR (255) DEFAULT SUBSTRING_INDEX(image_name_extension, ".", -1);
	-- 2. Verificar existencia del paciente ingresado
    IF CheckPatientExistence(p_dni) = 0 THEN
		-- 3. Si no existe, registrarlo 
		CALL RegisterUser(p_dni,p_name,p_last_name,p_password);
    END IF;
	-- 4. Asociar la imagen al paciente
	INSERT INTO Image (name, path, extension, user_id, real_value, prediction_value)
	VALUES (image_name, p_image_path, image_extension, p_dni, p_real_prediction, p_value_prediction);
END //


DELIMITER ;
