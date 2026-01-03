-- Get patient basic data by DNI
CREATE PROCEDURE GetPatientByDni (
    @dni CHAR(8)
)
AS
BEGIN
    SELECT
        U.dni,
        U.name,
        U.last_name AS lastName,
        U.birth_date AS birthDate,
        U.id_gender AS gender,
        G.description AS genderDescription,
        U.registration_date AS registrationDate
    FROM [User] U
    LEFT JOIN Gender G ON U.id_gender = G.id
    WHERE U.dni = @dni AND U.id_user_type = 2;
END;
GO
