
-- Create procedure to register user
CREATE PROCEDURE RegisterUser (
    @dni CHAR(8),
    @name VARCHAR(255),
    @last_name VARCHAR(255),
    @password VARCHAR(255) = NULL,
    @birth_date DATE,
    @id_gender INT
)
AS
BEGIN
    IF @password IS NULL
    BEGIN
        INSERT INTO [User] (dni, name, last_name, id_user_type, birth_date, id_gender)
        VALUES (@dni, @name, @last_name, 2, @birth_date, @id_gender);
    END
    ELSE
    BEGIN
        INSERT INTO [User] (dni, name, last_name, id_user_type, birth_date, id_gender)
        VALUES (@dni, @name, @last_name, 1, @birth_date, @id_gender);
    END

    SELECT 1 AS resultado, 'User successfully registered' AS mensaje;
END;
GO

