CREATE TABLE [dbo].[User] (
    [dni]               CHAR (8)      NOT NULL,
    [name]              VARCHAR (255) NOT NULL,
    [last_name]         VARCHAR (255) NOT NULL,
    [password]          VARCHAR (255) NULL,
    [id_user_type]      INT           NOT NULL,
    [id_gender]         INT           NULL,
    [registration_date] DATETIME      DEFAULT (getdate()) NULL,
    [birth_date]        DATE          NOT NULL,
    PRIMARY KEY CLUSTERED ([dni] ASC),
    FOREIGN KEY ([id_gender]) REFERENCES [dbo].[Gender] ([id]),
    FOREIGN KEY ([id_user_type]) REFERENCES [dbo].[UserType] ([id])
);
GO

