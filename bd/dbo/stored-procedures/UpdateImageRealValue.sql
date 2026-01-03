-- Update real classification value for an image
CREATE PROCEDURE UpdateImageRealValue (
    @imagePatientId INT,
    @realValue INT
)
AS
BEGIN
    UPDATE ImagePatient
    SET real_value = @realValue
    WHERE id = @imagePatientId;

    IF @@ROWCOUNT = 0
    BEGIN
        RAISERROR('Image not found', 16, 1);
        RETURN;
    END

    SELECT 'OK' AS result;
END;
GO
