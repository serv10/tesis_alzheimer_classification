
-- Get age distribution by classification type
CREATE PROCEDURE GetAgeDistribution 
AS
BEGIN
    SELECT 
        IC.Description AS alzheimerType, 
        FLOOR(DATEDIFF(DAY, U.birth_date, GETDATE()) / 365.25) AS age, 
        SUM(CASE WHEN IP.real_value = IC.id THEN 1 ELSE 0 END) AS realCount,
        SUM(CASE WHEN IP.prediction_value = IC.id THEN 1 ELSE 0 END) AS predictionCount
    FROM [User] U
        JOIN ImagePatient IP ON IP.id_user = U.dni
        JOIN ImageClassification IC ON IC.id IN (IP.real_value, IP.prediction_value)
    WHERE U.id_user_type <> 1
    GROUP BY FLOOR(DATEDIFF(DAY, U.birth_date, GETDATE()) / 365.25), IC.Description
    ORDER BY FLOOR(DATEDIFF(DAY, U.birth_date, GETDATE()) / 365.25);
END;
GO

