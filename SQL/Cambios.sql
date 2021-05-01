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
---------
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

INSERT INTO th.Empresas VALUES ('Transportadora Haruhiko', 1)
INSERT INTO th.Empresas VALUES ('Maxi Trader', 1)

ALTER TABLE th.Pedidos
ADD IdEmpresa INT NOT NULL DEFAULT 1;

ALTER TABLE th.Clientes
ADD IdEmpresa INT NOT NULL DEFAULT 1;

ALTER TABLE th.Trabajadores
ADD IdEmpresa INT NOT NULL DEFAULT 1;

ALTER TABLE th.Pedidos
ADD CONSTRAINT FK_EmpresaPedido
FOREIGN KEY (IdEmpresa) REFERENCES th.Empresas(IdEmpresa);

ALTER TABLE th.Clientes
ADD CONSTRAINT FK_EmpresaCliente
FOREIGN KEY (IdEmpresa) REFERENCES th.Empresas(IdEmpresa);

ALTER TABLE th.Trabajadores
ADD CONSTRAINT FK_EmpresaTrabajador
FOREIGN KEY (IdEmpresa) REFERENCES th.Empresas(IdEmpresa);


UPDATE th.EstadosPedidos SET Nombre = 'Desaduanización' WHERE IdEstadoPedido = 3

GO
CREATE SCHEMA conta

GO

CREATE TABLE conta.ServiciosBasicos(
IdServicioBasico INT PRIMARY KEY IDENTITY(1,1),
Nombre NVARCHAR (250) NOT NULL
)

CREATE TABLE conta.TiposHaberes(
IdTipoHaber INT PRIMARY KEY IDENTITY(1,1),
Nombre NVARCHAR (250) NOT NULL
)

CREATE TABLE conta.Haberes(
IdHaber INT PRIMARY KEY IDENTITY(1,1),
Observacion NVARCHAR(800) NOT NULL,
Monto DECIMAL(10,2) NOT NULL,
Fecha DATETIME NOT NULL,
IdServicioBasico INT NOT NULL,
IdTipoHaber INT NOT NULL,
IdTipoMoneda INT NOT NULL,
IdEmpresa INT NOT NULL,
FOREIGN KEY (IdServicioBasico) REFERENCES conta.ServiciosBasicos(IdServicioBasico),
FOREIGN KEY (IdTipoHaber) REFERENCES conta.TiposHaberes(IdTipoHaber),
FOREIGN KEY (IdTipoMoneda) REFERENCES th.TiposMonedas(IdTipoMoneda),
FOREIGN KEY (IdEmpresa) REFERENCES th.Empresas(IdEmpresa)
)

INSERT INTO conta.ServiciosBasicos VALUES ('Luz')
INSERT INTO conta.ServiciosBasicos VALUES ('Agua')
INSERT INTO conta.ServiciosBasicos VALUES ('Internet')
INSERT INTO conta.ServiciosBasicos VALUES ('Varios')
INSERT INTO conta.ServiciosBasicos VALUES ('Alquiler Oficina')
INSERT INTO conta.ServiciosBasicos VALUES ('Alquiler Interno')
INSERT INTO conta.ServiciosBasicos VALUES ('Teléfono Móvil')

INSERT INTO conta.TiposHaberes VALUES ('Ingresos')
INSERT INTO conta.TiposHaberes VALUES ('Egresos')
-----
INSERT INTO th.Trabajadores VALUES ('Douglas', 'Vega', '123456','holta@hotmail.com','11456', 'ASD', 1)
INSERT INTO th.Trabajadores VALUES ('Carla', 'Suarez', '123456','gjru@hotmail.com','854121', 'dfffdf fsdf df', 1)

INSERT INTO th.Usuarios VALUES ('vega@hotmail.com', '123456', 1, 2, 1)
INSERT INTO th.Usuarios VALUES ('carla@hotmail.com', '123456', 1, 1, 1)

INSERT INTO th.Usuarios_Empresas VALUES (1, 2, GETDATE())
INSERT INTO th.Usuarios_Empresas VALUES (1, 1, GETDATE())
INSERT INTO th.Usuarios_Empresas VALUES (2, 2, GETDATE())

select * from th.Trabajadores

