# GoodVision Backend

Backend del proyecto GoodVision desarrollado con Spring Boot, MySQL y JPA/Hibernate para el curso de Desarrollo Web Integrado.

---

# Tecnologías utilizadas

- Java 21
- Spring Boot 4
- Spring Web
- Spring Data JPA
- Spring Security
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
- exception

## Arquitectura implementada

### Controller
Gestiona los endpoints REST de la aplicación.

### Service
Contiene la lógica de negocio del sistema.

### Repository
Gestiona el acceso a datos usando JPA/Hibernate.

### Entity
Representa las tablas de la base de datos MySQL.

### Config
Configuraciones generales del proyecto y seguridad.

### Security
Configuración temporal de Spring Security y futura integración JWT.

# Requisitos previos

Antes de ejecutar el proyecto se necesita tener instalado:

## Software necesario

- Java JDK 21
- Maven
- Docker Desktop
- MySQL (usado mediante Docker)
- Git
- IDE (VSCode, IntelliJ o NetBeans)

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

## Crear contenedor

```bash
docker run --name mysql-dev ^
-e MYSQL_ROOT_PASSWORD=root ^
-e MYSQL_DATABASE=good_vision ^
-p 3306:3306 ^
-d mysql:8.0
```

## Verificar contenedor

```bash
docker ps
```

---

# Importar script SQL

Abrir DBeaver o MySQL Workbench.

Crear conexión con:

| Configuración | Valor |
|---|---|
| Host | localhost |
| Puerto | 3306 |
| Usuario | root |
| Password | root |

Luego ejecutar el script:

```sql
good_vision_tablas.sql
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

En terminal:

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
# Endpoints implementados

## CLIENTES

### Obtener todos los clientes

```http
GET /api/cliente
```

---

### Obtener cliente por ID

```http
GET /api/cliente/{id}
```

---

### Registrar cliente

```http
POST /api/cliente
```

Ejemplo Body JSON:

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

---

### Actualizar cliente

```http
PUT /api/cliente/{id}
```

---

### Eliminar cliente

```http
DELETE /api/cliente/{id}
```

---

### Buscar clientes por apellido

```http
GET /api/cliente/buscar?apellido=Perez
```

---

# PRODUCTOS

## Obtener todos los productos

```http
GET /api/productos
```

---

## Obtener producto por ID

```http
GET /api/productos/{id}
```

---

## Registrar producto

```http
POST /api/productos
```

Ejemplo Body JSON:

```json
{
  "nombreProducto": "Lente Blue Cut",
  "precio": 250.00,
  "categoria": {
    "idCategoria": 1
  }
}
```

---

## Actualizar producto

```http
PUT /api/productos/{id}
```

---

## Eliminar producto

```http
DELETE /api/productos/{id}
```

---

## Buscar productos por nombre

```http
GET /api/productos/buscar?nombre=Lente
```

---

# Seguridad

Actualmente el proyecto utiliza una configuración temporal de Spring Security para permitir las pruebas de endpoints durante el desarrollo.

La siguiente fase del proyecto implementará:

- JWT Authentication
- Roles de usuario
- Protección de endpoints
- Login y registro de usuarios
- Autorización basada en roles

---

# Pruebas API

Las pruebas se realizan usando:

- Postman

---
# Módulos implementados

## Módulo Clientes

CRUD completo funcional:

- Registrar clientes
- Obtener clientes
- Buscar clientes
- Actualizar clientes
- Eliminar clientes

---

## Módulo Productos

CRUD completo funcional:

- Registrar productos
- Obtener productos
- Buscar productos
- Actualizar productos
- Eliminar productos

Incluye relación con:

- Categorías

mediante JPA/Hibernate.

# Git Flow utilizado

El proyecto utiliza dos ramas principales:

| Rama | Uso |
|---|---|
| main | Producción |
| dev | Desarrollo |

---

# Integrantes

- Misael Challco
- Integrantes del equipo
