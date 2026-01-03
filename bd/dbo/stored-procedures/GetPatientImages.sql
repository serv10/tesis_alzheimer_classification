-- Get all images for a specific patient
CREATE PROCEDURE GetPatientImages (
    @dni CHAR(8)
)
AS
BEGIN
    SELECT
        IP.id AS imagePatientId,
        I.id AS imageId,
        I.name AS imageName,
        I.path AS imagePath,
        I.extension AS imageExtension,
        I.upload_date AS uploadDate,
        IP.real_value AS realValueId,
        IC_Real.Description AS realValueDescription,
        IP.prediction_value AS predictionValueId,
        IC_Pred.Description AS predictionValueDescription
    FROM ImagePatient IP
    INNER JOIN Image I ON IP.id_image = I.id
    LEFT JOIN ImageClassification IC_Real ON IP.real_value = IC_Real.id
    INNER JOIN ImageClassification IC_Pred ON IP.prediction_value = IC_Pred.id
    WHERE IP.id_user = @dni
    ORDER BY I.upload_date DESC;
END;
GO
