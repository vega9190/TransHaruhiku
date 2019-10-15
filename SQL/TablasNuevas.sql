USE Gestor
GO

CREATE SCHEMA th

GO

CREATE TABLE th.Clientes(
IdCliente INT PRIMARY KEY IDENTITY(1,1),
Carnet NVARCHAR(25) NOT NULL,
Nombres NVARCHAR(50) NOT NULL,
Apellidos NVARCHAR(50) NOT NULL,
Direccion NVARCHAR(500) NOT NULL,
Email NVARCHAR(50) NOT NULL,
Telefono NVARCHAR(25) NOT NULL
)

CREATE TABLE th.EstadosPedidos(
IdEstadoPedido INT PRIMARY KEY IDENTITY(1,1),
Nombre NVARCHAR(25) NOT NULL
)

CREATE TABLE th.Pedidos(
IdPedido INT PRIMARY KEY IDENTITY(1,1),
Descripcion NVARCHAR(500) NOT NULL,
Contenedor NVARCHAR(100) NULL,
Fecha DATETIME NOT NULL,
Direccion NVARCHAR(500) NULL,
DireccionUrl NVARCHAR(500) NULL,
IdCliente INT NOT NULL,
IdEstadoPedido INT NOT NULL,
FOREIGN KEY(IdCliente) REFERENCES th.Clientes(IdCliente),
FOREIGN KEY(IdEstadoPedido) REFERENCES th.EstadosPedidos(IdEstadoPedido)
)

CREATE TABLE th.EstadosFicheros(
IdEstadoFichero INT PRIMARY KEY IDENTITY(1,1),
Nombre NVARCHAR(25) NOT NULL
)

CREATE TABLE th.TiposFicheros(
IdTipoFichero INT PRIMARY KEY IDENTITY(1,1),
Nombre NVARCHAR(25) NOT NULL,
Descripcion NVARCHAR(100) NOT NULL
)

CREATE TABLE th.Ficheros(
IdFichero INT PRIMARY KEY IDENTITY(1,1),
NombreFile NVARCHAR(100) NOT NULL,
IdPedido INT NOT NULL,
IdEstadoFichero INT NOT NULL,
IdTipoFichero INT NOT NULL,
FOREIGN KEY(IdPedido) REFERENCES th.Pedidos(IdPedido),
FOREIGN KEY(IdEstadoFichero) REFERENCES th.EstadosFicheros(IdEstadoFichero),
FOREIGN KEY(IdTipoFichero) REFERENCES th.TiposFicheros(IdTipoFichero)
)

CREATE TABLE th.Trabajadores(
IdTrabajador INT PRIMARY KEY IDENTITY(1,1),
Nombres NVARCHAR(50) NOT NULL,
Apellidos NVARCHAR(50) NOT NULL,
Email NVARCHAR(50) NOT NULL,
Telefono NVARCHAR(25) NOT NULL,
Direccion NVARCHAR(500) NOT NULL,
Activo BIT NOT NULL
)

CREATE TABLE th.Roles(
IdRol INT PRIMARY KEY IDENTITY(1,1),
Nombre NVARCHAR(50) NOT NULL
)

CREATE TABLE th.Usuarios(
IdUsuario INT PRIMARY KEY IDENTITY(1,1),
Usuario NVARCHAR(50) NOT NULL,
Pass NVARCHAR(50) NOT NULL,
Activo BIT NOT NULL,
IdRol INT NOT NULL,
IdTrabajador INT NOT NULL,
FOREIGN KEY(IdRol) REFERENCES th.Roles(IdRol),
FOREIGN KEY(IdTrabajador) REFERENCES th.Trabajadores(IdTrabajador)
)

CREATE TABLE th.Observaciones(
IdObservacion INT PRIMARY KEY IDENTITY(1,1),
Fecha DATETIME NOT NULL,
Descripcion NVARCHAR(100) NOT NULL,
IdPedido INT NOT NULL,
IdUsuario INT NOT NULL,
FOREIGN KEY(IdUsuario) REFERENCES th.Usuarios(IdUsuario),
FOREIGN KEY(IdPedido) REFERENCES th.Pedidos(IdPedido)
)

CREATE TABLE th.TiposSeguimientos(
IdTipoSeguimiento INT PRIMARY KEY IDENTITY(1,1),
Nombre NVARCHAR(25) NOT NULL,
Descripcion NVARCHAR(50) NOT NULL
)

CREATE TABLE th.Seguimientos(
IdSeguimiento INT PRIMARY KEY IDENTITY(1,1),
Fecha DATETIME NOT NULL,
Descripcion NVARCHAR(100) NOT NULL,
IdPedido INT NOT NULL,
IdTipoSeguimiento INT NOT NULL,
IdUsuario INT NOT NULL,
FOREIGN KEY(IdTipoSeguimiento) REFERENCES th.TiposSeguimientos(IdTipoSeguimiento),
FOREIGN KEY(IdUsuario) REFERENCES th.Usuarios(IdUsuario),
FOREIGN KEY(IdPedido) REFERENCES th.Pedidos(IdPedido)
)

CREATE TABLE th.TiposPagos(
IdTipoPago INT PRIMARY KEY IDENTITY(1,1),
Nombre NVARCHAR(25) NOT NULL,
Descripcion NVARCHAR(50) NOT NULL
)

CREATE TABLE th.Pagos(
IdPago INT PRIMARY KEY IDENTITY(1,1),
Monto DECIMAL(10,2) NOT NULL,
Fecha DATETIME NOT NULL,
IdPedido INT NOT NULL,
IdTipoPago INT NOT NULL,
FOREIGN KEY (IdPedido) REFERENCES th.Pedidos(IdPedido),
FOREIGN KEY (IdTipoPago) REFERENCES th.TiposPagos(IdTipoPago)
)



INSERT INTO th.EstadosPedidos VALUES ('Inicio')
INSERT INTO th.EstadosPedidos VALUES ('En Proceso')
INSERT INTO th.EstadosPedidos VALUES ('Desaduanizacion')
INSERT INTO th.EstadosPedidos VALUES ('Transportadora')
INSERT INTO th.EstadosPedidos VALUES ('Finalizado')
INSERT INTO th.EstadosPedidos VALUES ('Cancelado')

INSERT INTO th.Clientes VALUES ('123456', 'Douglas', 'Vega', 'dirección asd', 'hola@sd.com', '486')

INSERT INTO th.Pedidos VALUES ('ASD','4561',GETDATE(),1,1,'Dirección','dirección url')

INSERT INTO th.Roles VALUES ('Operador')
INSERT INTO th.Roles VALUES ('Gerente')
INSERT INTO th.Roles VALUES ('Administrador')

INSERT INTO th.Trabajadores VALUES ('Trabajador', 'Trabajador APP', 'asd@hotmail.com', '8794', 'dirección', 1)

INSERT INTO th.Usuarios VALUES ('adm', 'adm', 1, 1, 1)