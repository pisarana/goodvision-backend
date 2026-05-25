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

El proyecto sigue una arquitectura por capas:

- Controller
- Service
- Repository
- Entity
- Config

---

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

# Seguridad

Actualmente el proyecto tiene una configuración temporal de seguridad para facilitar las pruebas de API durante el desarrollo.

Posteriormente se implementará:

- JWT Authentication
- Roles
- Protección de endpoints

---

# Pruebas API

Las pruebas se realizan usando:

- Postman

---

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
