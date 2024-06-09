-- Crear la base de datos LogicalData
CREATE DATABASE LogicalData;
GO

-- Usar la base de datos LogicalData
USE LogicalData;
GO

-- Tabla Users
CREATE TABLE dbo.Users (
    id_ INT IDENTITY(1,1) PRIMARY KEY,
    name_ NVARCHAR(100) NULL,
    login_ NVARCHAR(50) NULL UNIQUE,
    password_ NVARCHAR(100) NULL
);

-- Tabla Articles
CREATE TABLE dbo.Articles (
    code_ NVARCHAR(50) PRIMARY KEY,
    name_ NVARCHAR(100) NULL,
    price_ DECIMAL(18, 2) NULL,
    IVA_ DECIMAL(18, 2) NULL,
    total_price_ AS (price_ + (price_ * 0.13)) PERSISTED
);

-- Tabla Invoices
CREATE TABLE dbo.Invoices (
    id_ INT IDENTITY(1,1) PRIMARY KEY,
    customer_name_ NVARCHAR(100) NULL
);

-- Tabla InvoiceDetails
CREATE TABLE dbo.InvoiceDetails (
    id_ INT IDENTITY(1,1) PRIMARY KEY,
    invoice_id_ INT NULL,
    Artcode_ NVARCHAR(50) NULL, 
    quantity_ INT NULL,
    total_price_ DECIMAL(18, 2) NULL,
    FOREIGN KEY (invoice_id_) REFERENCES dbo.Invoices(id_),
    FOREIGN KEY (Artcode_) REFERENCES dbo.Articles(code_) 
);

-- Constraint: Si se elimina una factura (invoices) se eliminan los detalles de factura (invoice details) asociados
ALTER TABLE dbo.InvoiceDetails
ADD CONSTRAINT FK_InvoiceDetails_Invoice FOREIGN KEY (invoice_id_)
REFERENCES dbo.Invoices(id_)
ON DELETE CASCADE;

-- Insertar algunos datos de ejemplo en la tabla Users
INSERT INTO dbo.Users (name_, login_, password_)
VALUES ('David', 'Administrator', '1234'),
        ('Alex', 'Admin', '1234');

-- Seleccionar datos de ejemplo de las tablas
SELECT * FROM dbo.InvoiceDetails;
SELECT * FROM dbo.Invoices;
SELECT * FROM dbo.Articles;
SELECT * FROM dbo.Users;
