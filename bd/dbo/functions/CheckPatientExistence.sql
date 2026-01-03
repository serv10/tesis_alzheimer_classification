-- Create function to check patient existence
CREATE FUNCTION CheckPatientExistence(@dni CHAR(8))
RETURNS BIT
AS
BEGIN
    DECLARE @count INT;
    SELECT @count = COUNT(*) FROM [User] WHERE dni = @dni;
    RETURN IIF(@count > 0, 1, 0);
END;
GO

