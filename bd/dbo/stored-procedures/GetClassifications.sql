-- Get classification statistics (real vs predicted counts)
CREATE PROCEDURE GetClassifications
AS
BEGIN
    SELECT 
        IC.Description AS alzheimerType,
        SUM(CASE WHEN IP.real_value = IC.id THEN 1 ELSE 0 END) AS realCount,
        SUM(CASE WHEN IP.prediction_value = IC.id THEN 1 ELSE 0 END) AS predictionCount
    FROM ImagePatient IP
    JOIN ImageClassification IC ON IC.id IN (IP.real_value, IP.prediction_value)
    GROUP BY IC.Description, IC.id
    ORDER BY IC.id;
END;
GO

