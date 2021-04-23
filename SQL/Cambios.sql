USE Gestor
GO
select * from th.Contenedores
ALTER TABLE th.Pedidos ADD Contenedores NVARCHAR(250) NULL;

ALTER TABLE th.Contenedores ALTER COLUMN Codigo VARCHAR (250) NOT NULL;
ALTER TABLE th.Contenedores DROP COLUMN Poliza;

DROP TABLE th.DetallePolizas;
DROP TABLE th.Polizas;

CREATE TABLE th.Polizas(
IdPoliza INT PRIMARY KEY IDENTITY(1,1),
Codigo NVARCHAR(50) NOT NULL,
Nombre NVARCHAR(250) NOT NULL,
IdPedido INT NOT NULL,
FOREIGN KEY (IdPedido) REFERENCES th.Pedidos(IdPedido)
)

CREATE Table th.DetallePolizas(
IdDetallePoliza INT PRIMARY KEY IDENTITY(1,1),
Concepto NVARCHAR(250) NOT NULL,
Precio DECIMAL(10,2) NOT NULL,
IdPoliza INT NOT NULL,
FOREIGN KEY (IdPoliza) REFERENCES th.Polizas (IdPoliza)
)

CREATE TABLE th.Empresas(
IdEmpresa INT PRIMARY KEY IDENTITY(1,1),
Nombre NVARCHAR(250) NOT NULL,
Activa BIT NOT NULL
)

CREATE TABLE th.Usuarios_Empresas(
IdUsuario INT NOT NULL,
IdEmpresa INT NOT NULL,
Fecha DATETIME NOT NULL,
PRIMARY KEY(IdUsuario, IdEmpresa),
FOREIGN KEY (IdUsuario) REFERENCES th.Usuarios (IdUsuario),
FOREIGN KEY (IdEmpresa) REFERENCES th.Empresas (IdEmpresa)
)

ALTER TABLE th.Pedidos
ADD IdEmpresa INT NOT NULL;

ALTER TABLE th.Clientes
ADD IdEmpresa INT NOT NULL;

ALTER TABLE th.Pedidos
ADD CONSTRAINT FK_EmpresaPedido
FOREIGN KEY (IdEmpresa) REFERENCES th.Empresas(IdEmpresa);

ALTER TABLE th.Clientes
ADD CONSTRAINT FK_EmpresaCliente
FOREIGN KEY (IdEmpresa) REFERENCES th.Empresas(IdEmpresa);