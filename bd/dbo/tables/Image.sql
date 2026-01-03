CREATE TABLE [dbo].[Image] (
    [id]          INT           IDENTITY (1, 1) NOT NULL,
    [name]        VARCHAR (255) NULL,
    [path]        VARCHAR (255) NULL,
    [extension]   VARCHAR (10)  NULL,
    [upload_date] DATETIME      DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);
GO

