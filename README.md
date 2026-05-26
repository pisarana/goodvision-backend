# GoodVision Backend

Backend del proyecto GoodVision desarrollado con Spring Boot, MySQL y JPA/Hibernate para el curso de Desarrollo Web Integrado.

---

# Tecnologías utilizadas

- Java 21
- Spring Boot 4
- Spring Web
- Spring Data JPA
- Spring Security
- JWT Authentication
- MySQL 8
- Docker
- Maven
- Postman

---

# Arquitectura del proyecto

El proyecto sigue una arquitectura por capas utilizando Spring Boot y JPA/Hibernate.

## Estructura principal

- controller
- service
- repository
- entity
- config
- security
- dto

---

# Arquitectura implementada

## Controller

Gestiona los endpoints REST de la aplicación.

## Service

Contiene la lógica de negocio del sistema.

## Repository

Gestiona el acceso a datos usando JPA/Hibernate.

## Entity

Representa las tablas de la base de datos MySQL.

## Config

Configuraciones generales del proyecto y seguridad.

## Security

Implementación de autenticación JWT y protección de endpoints.

## DTO

Objetos utilizados para login, registro y respuestas de autenticación.

---

# Requisitos previos

Antes de ejecutar el proyecto se necesita tener instalado:

## Software necesario

- Java JDK 21
- Maven
- Docker Desktop
- Git
- IDE (VSCode, IntelliJ o NetBeans)
- Postman
- DBeaver o MySQL Workbench

---

# Clonar repositorio

```bash
git clone https://github.com/pisarana/goodvision-backend.git
```

Entrar al proyecto:

```bash
cd goodvision-backend
```

---

# Configuración de MySQL con Docker

## Descargar imagen MySQL

```bash
docker pull mysql:8.0
```

---

## Crear contenedor MySQL

### Windows PowerShell

```powershell
docker run --name mysql-dev `
-e MYSQL_ROOT_PASSWORD=root `
-e MYSQL_DATABASE=good_vision `
-p 3306:3306 `
-d mysql:8.0
```

---

## Verificar contenedor

```bash
docker ps
```

---

# Configuración de la base de datos

Abrir DBeaver o MySQL Workbench.

Crear conexión con:

| Configuración | Valor |
|---|---|
| Host | localhost |
| Puerto | 3306 |
| Usuario | root |
| Password | root |

---

# Ejecutar script SQL

Ejecutar:

```sql
good_vision_tablas.sql
```

---

# Configuración adicional para JWT

Ejecutar también:

```sql
ALTER TABLE USUARIOS
ADD COLUMN password VARCHAR(255) NOT NULL,
ADD COLUMN role VARCHAR(30) NOT NULL DEFAULT 'ESPECIALISTA';
```

---

# Configuración del backend

Abrir:

```properties
src/main/resources/application.properties
```

Configurar:

```properties
spring.application.name=goodvision-backend

spring.datasource.url=jdbc:mysql://localhost:3306/good_vision?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=root

spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

server.port=8080
```

---

# Ejecutar proyecto

## Windows PowerShell

```powershell
.\mvnw spring-boot:run
```

## CMD

```cmd
mvnw spring-boot:run
```

---

# Verificar ejecución

Si todo funciona correctamente aparecerá:

```txt
Started GoodvisionBackendApplication
```

---

# Configuración JWT

El sistema implementa autenticación basada en JWT (JSON Web Token).

## Funcionalidades implementadas

- Registro de usuarios
- Login de usuarios
- Generación de JWT
- Protección de endpoints
- Bearer Token Authentication
- Validación de token
- Contraseñas encriptadas con BCrypt

---

# Flujo de autenticación

## 1. Registrar usuario

Endpoint:

```http
POST /api/auth/register
```

Body JSON:

```json
{
  "nombre": "Misael",
  "apellido": "Challco",
  "correo": "misael@gmail.com",
  "telefono": "999999999",
  "direccion": "Lima",
  "password": "123456",
  "role": "ADMIN"
}
```

---

## 2. Iniciar sesión

Endpoint:

```http
POST /api/auth/login
```

Body JSON:

```json
{
  "correo": "misael@gmail.com",
  "password": "123456"
}
```

Respuesta esperada:

```json
{
  "token": "eyJhbGciOiJIUzI1Ni..."
}
```

---

## 3. Usar Bearer Token

### En Postman

- Ir a:
  Authorization

- Seleccionar:
  Bearer Token

- Pegar el JWT generado

Ejemplo:

```txt
Bearer eyJhbGciOiJIUzI1Ni...
```

---

# Endpoints públicos

```http
POST /api/auth/register
POST /api/auth/login
```

---

# Endpoints protegidos

```http
GET /api/cliente
POST /api/cliente
PUT /api/cliente/{id}
DELETE /api/cliente/{id}

GET /api/productos
POST /api/productos
PUT /api/productos/{id}
DELETE /api/productos/{id}
```

Todos requieren JWT válido.

---

# Endpoints implementados

# CLIENTES

## Obtener todos los clientes

```http
GET /api/cliente
```

## Obtener cliente por ID

```http
GET /api/cliente/{id}
```

## Registrar cliente

```http
POST /api/cliente
```

Body JSON:

```json
{
  "nombre": "Juan",
  "apellido": "Perez",
  "documento": "12345678",
  "telefono": "987654321",
  "direccion": "Av Lima 123",
  "correo": "juan@gmail.com"
}
```

## Actualizar cliente

```http
PUT /api/cliente/1
```

Body JSON:

```json
{
  "nombre": "Juan Carlos",
  "apellido": "Perez",
  "documento": "12345678",
  "telefono": "999999999",
  "direccion": "Av Peru 999",
  "correo": "juancarlos@gmail.com"
}
```

## Eliminar cliente

```http
DELETE /api/cliente/1
```

## Buscar cliente por apellido

```http
GET /api/cliente/buscar?apellido=Perez
```

---

# PRODUCTOS

## Obtener todos los productos

```http
GET /api/productos
```

## Obtener producto por ID

```http
GET /api/productos/1
```

## Registrar producto

```http
POST /api/productos
```

Body JSON:

```json
{
  "nombreProducto": "Lente Blue Cut",
  "precio": 250.00,
  "categoria": {
    "idCategoria": 1
  }
}
```

## Actualizar producto

```http
PUT /api/productos/1
```

Body JSON:

```json
{
  "nombreProducto": "Lente Anti Luz Azul",
  "precio": 300.00,
  "categoria": {
    "idCategoria": 1
  }
}
```

## Eliminar producto

```http
DELETE /api/productos/1
```

## Buscar producto por nombre

```http
GET /api/productos/buscar?nombre=Lente
```

---

# Pruebas API

Las pruebas de la API fueron realizadas utilizando:

- Postman
- DBeaver
- MySQL
- Docker

---

# Validaciones realizadas

## CLIENTES

- Registro de clientes
- Obtención de clientes
- Actualización de clientes
- Eliminación de clientes
- Búsqueda de clientes

## PRODUCTOS

- Registro de productos
- Obtención de productos
- Actualización de productos
- Eliminación de productos
- Relación con categorías

## JWT

- Registro de usuarios
- Login de usuarios
- Generación correcta de JWT
- Protección de endpoints
- Validación Bearer Token
- Restricción sin token

---

# Módulos implementados

## Módulo Clientes

CRUD completo funcional.

## Módulo Productos

CRUD completo funcional con relación a categorías mediante JPA/Hibernate.

## Módulo Seguridad

Implementación de:

- JWT Authentication
- Spring Security
- Login
- Registro
- Bearer Token
- BCrypt Password Encoding

---

# Git Flow utilizado

El proyecto utiliza dos ramas principales:

| Rama | Uso |
|---|---|
| main | Producción |
| dev | Desarrollo |

---

# Configuración importante

## Base de datos

| Configuración | Valor |
|---|---|
| Database | good_vision |
| Usuario | root |
| Password | root |
| Puerto | 3306 |

## JWT

| Configuración | Valor |
|---|---|
| Algoritmo | HS256 |
| Expiración | 24 horas |
| Tipo | Bearer Token |

---

# Integrantes

- Misael Challco
- Integrantes del equipo
