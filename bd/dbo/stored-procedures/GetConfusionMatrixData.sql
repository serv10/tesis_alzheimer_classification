-- Create procedure to get confusion matrix data (real vs prediction combinations)
CREATE PROCEDURE GetConfusionMatrixData
AS
BEGIN
    SELECT
        IC_Real.Description AS realType,
        IC_Pred.Description AS predictedType,
        COUNT(*) AS count
    FROM ImagePatient IP
    JOIN ImageClassification IC_Real ON IP.real_value = IC_Real.id
    JOIN ImageClassification IC_Pred ON IP.prediction_value = IC_Pred.id
    GROUP BY IC_Real.Description, IC_Pred.Description, IC_Real.id, IC_Pred.id
    ORDER BY IC_Real.id, IC_Pred.id;
END;
GO
