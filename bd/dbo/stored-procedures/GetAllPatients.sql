-- Get all patients with examination count
CREATE PROCEDURE GetAllPatients
AS
BEGIN
    SELECT
        U.dni,
        U.name,
        U.last_name AS lastName,
        U.birth_date AS birthDate,
        U.registration_date AS registrationDate,
        G.description AS gender,
        COUNT(IP.id) AS totalExaminations
    FROM [User] U
    LEFT JOIN Gender G ON U.id_gender = G.id
    LEFT JOIN ImagePatient IP ON U.dni = IP.id_user
    WHERE U.id_user_type = 2
    GROUP BY U.dni, U.name, U.last_name, U.birth_date, U.registration_date, G.description
    ORDER BY U.registration_date DESC;
END;
GO
