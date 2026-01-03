
-- Create procedure to examine patient
CREATE PROCEDURE ExaminePatient (
    @dni CHAR(8),
    @name VARCHAR(255),
    @last_name VARCHAR(255),
    @password VARCHAR(255) = NULL,
    @image_path VARCHAR(255),
    @real_prediction INT = NULL,
    @value_prediction INT,
    @birth_date DATE,
    @id_gender INT
)
AS
BEGIN
    -- Normalize path separators (replace \ with /)
    DECLARE @normalized_path VARCHAR(255) = REPLACE(@image_path, '\', '/');

    -- Extract filename with extension
    DECLARE @slash_pos INT = LEN(@normalized_path) - CHARINDEX('/', REVERSE(@normalized_path)) + 1;
    DECLARE @image_name_extension VARCHAR(255) = CASE
        WHEN CHARINDEX('/', @normalized_path) > 0 THEN RIGHT(@normalized_path, LEN(@normalized_path) - @slash_pos)
        ELSE @normalized_path
    END;

    -- Extract name and extension
    DECLARE @dot_pos INT = CHARINDEX('.', @image_name_extension);
    DECLARE @image_name VARCHAR(255) = CASE
        WHEN @dot_pos > 0 THEN LEFT(@image_name_extension, @dot_pos - 1)
        ELSE @image_name_extension
    END;
    DECLARE @image_extension VARCHAR(10) = CASE
        WHEN @dot_pos > 0 THEN RIGHT(@image_name_extension, LEN(@image_name_extension) - @dot_pos)
        ELSE ''
    END;

    IF dbo.CheckPatientExistence(@dni) = 0
    BEGIN
        EXEC RegisterUser @dni, @name, @last_name, @password, @birth_date, @id_gender;
    END

    INSERT INTO Image (name, path, extension)
    VALUES (@image_name, @image_path, @image_extension);

    DECLARE @id_image INT = SCOPE_IDENTITY();

    INSERT INTO ImagePatient (id_user, id_image, real_value, prediction_value)
    VALUES (@dni, @id_image, @real_prediction, @value_prediction);

    -- Return success result
    SELECT 1 AS result;
END;
GO

