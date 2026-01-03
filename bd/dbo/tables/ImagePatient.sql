CREATE TABLE [dbo].[ImagePatient] (
    [id]               INT      IDENTITY (1, 1) NOT NULL,
    [id_user]          CHAR (8) NOT NULL,
    [id_image]         INT      NOT NULL,
    [real_value]       INT      NULL,
    [prediction_value] INT      NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    FOREIGN KEY ([id_image]) REFERENCES [dbo].[Image] ([id]),
    FOREIGN KEY ([id_user]) REFERENCES [dbo].[User] ([dni]),
    FOREIGN KEY ([prediction_value]) REFERENCES [dbo].[ImageClassification] ([id]),
    FOREIGN KEY ([real_value]) REFERENCES [dbo].[ImageClassification] ([id])
);
GO

