# GoodVision — Sistema de Gestión de Óptica

Aplicación web full-stack para gestión de una óptica: productos, clientes, inventario, ventas y evaluaciones ópticas.

## Stack

| Capa | Tecnología |
|------|-----------|
| Backend | Java 21 · Spring Boot 4 · Spring Security + JWT · Spring Data JPA |
| Base de datos | MySQL 8 |
| Frontend | Angular 18 · TypeScript 5 · RxJS 7 |
| Build | Maven (backend) · npm / Angular CLI (frontend) |

---

## Estructura del repositorio

```
goodvision-backend/
├── src/
│   ├── main/java/com/goodvision/
│   │   ├── controller/         ← endpoints REST
│   │   ├── service/            ← lógica de negocio
│   │   ├── repository/         ← acceso a datos (JPA)
│   │   ├── entity/             ← entidades JPA
│   │   ├── dto/                ← DTOs de autenticación
│   │   ├── security/           ← JWT filter + utils
│   │   ├── config/             ← SecurityConfig + CORS
│   │   └── exception/          ← excepciones + GlobalExceptionHandler
│   ├── main/resources/
│   │   └── application.properties
│   └── database/
│       └── dump-good_vision-*.sql   ← esquema de la base de datos
├── frontend/                   ← aplicación Angular 18
│   ├── src/app/
│   │   ├── core/               ← dominio, repositorios, servicios de aplicación
│   │   └── presentation/       ← páginas y layout
│   ├── proxy.conf.json         ← proxy /api → localhost:8080
│   └── package.json
├── pom.xml
└── README.md
```

---

## Requisitos previos

- **Java 21** (JDK)
- **Maven 3.9+** — incluido como `mvnw` / `mvnw.cmd` en el proyecto
- **Node.js 20+** y **npm**
- **Angular CLI**: `npm install -g @angular/cli`
- **Docker Desktop** (recomendado para MySQL)

---

## 1. Configurar la base de datos

### Opción A — Docker (recomendado)

**Windows PowerShell:**
```powershell
docker run --name mysql-goodvision `
  -e MYSQL_ROOT_PASSWORD=root `
  -e MYSQL_DATABASE=good_vision `
  -p 3306:3306 `
  -d mysql:8.0
```

**Linux / macOS:**
```bash
docker run --name mysql-goodvision \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=good_vision \
  -p 3306:3306 \
  -d mysql:8.0
```

### Opción B — MySQL local

Crear la base de datos `good_vision` con usuario `root` / contraseña `root`, o ajustar `src/main/resources/application.properties`.

### Importar el esquema

```bash
mysql -u root -p good_vision < src/database/dump-good_vision-202605251239.sql
```

---

## 2. Ejecutar el backend

Desde la raíz del proyecto:

```bash
# Linux / macOS / WSL
./mvnw spring-boot:run

# Windows CMD
mvnw.cmd spring-boot:run

# Windows PowerShell
.\mvnw spring-boot:run
```

Esperar: `Started GoodvisionBackendApplication`  
El servidor queda en **http://localhost:8080**

---

## 3. Ejecutar el frontend

```bash
cd frontend

# Instalar dependencias (solo la primera vez)
npm install

# Iniciar servidor de desarrollo
npm start
```

El frontend queda en **http://localhost:4200**  
El proxy en `proxy.conf.json` redirige `/api/*` → `http://localhost:8080` automáticamente.

---

## Orden de arranque

```
1. MySQL (Docker o local)
2. Backend  →  ./mvnw spring-boot:run
3. Frontend →  cd frontend && npm start
4. Abrir    →  http://localhost:4200
```

---

## Primer acceso

En la pantalla de login, hacer clic en **"Registrar"** para crear la primera cuenta.

Roles disponibles:
| Rol | Permisos |
|-----|----------|
| **ADMIN** | Acceso completo: crear, editar y eliminar todo; gestionar usuarios |
| **ESPECIALISTA** | Puede crear ventas y evaluaciones, pero no eliminarlas |

---

## Módulos de la aplicación

| Módulo | Descripción |
|--------|-------------|
| **Dashboard** | KPIs: total productos, clientes, ventas del mes, ingresos, stock bajo, venta promedio |
| **Productos** | CRUD con categorías |
| **Categorías** | CRUD de categorías de productos |
| **Clientes** | CRUD con validaciones + modal de reporte por cliente (ventas + evaluaciones ópticas) |
| **Inventario** | Control de stock con alertas de mínimo |
| **Ventas** | POS con catálogo de productos, carrito, cliente y método de pago |
| **Medidas** | Evaluaciones ópticas OD/OI (esfera, cilindro, eje) con historial expandible |
| **Reportes** | Métricas por período, top productos, exportación CSV y PDF |
| **Usuarios** | Gestión de cuentas (solo ADMIN) |

---

## API REST

Base URL: `http://localhost:8080/api`

| Módulo | Método | Endpoint | Rol requerido |
|--------|--------|----------|---------------|
| Auth | POST | `/auth/register` | Público |
| Auth | POST | `/auth/login` | Público |
| Clientes | GET/POST/PUT/DELETE | `/cliente` | JWT |
| Productos | GET/POST/PUT/DELETE | `/productos` | JWT |
| Categorías | GET/POST/PUT/DELETE | `/categorias` | JWT |
| Inventario | GET/POST/PUT/DELETE | `/inventario` | JWT |
| Ventas | GET | `/ventas` | JWT |
| Ventas | POST | `/ventas` | ADMIN / ESPECIALISTA |
| Ventas | DELETE | `/ventas/{id}` | ADMIN |
| Medidas | GET | `/medidas` | JWT |
| Medidas | POST | `/medidas` | ADMIN / ESPECIALISTA |
| Medidas | DELETE | `/medidas/{id}` | ADMIN |
| Usuarios | GET/PUT/DELETE | `/usuarios` | ADMIN |
| Usuarios | POST | `/usuarios` | ADMIN |

### Ejemplo de autenticación

```http
POST /api/auth/login
Content-Type: application/json

{
  "correo": "admin@goodvision.pe",
  "password": "tupassword"
}
```

Responde con:
```json
{ "token": "eyJhbGciOiJIUzI1Ni..." }
```

Incluir en todas las peticiones protegidas:
```
Authorization: Bearer <token>
```

---

## Build de producción

```bash
# Backend — genera JAR ejecutable
./mvnw clean package -DskipTests
java -jar target/goodvision-backend-*.jar

# Frontend — genera archivos estáticos en frontend/dist/
cd frontend
npm run build
```

Para producción, actualizar `frontend/src/environments/environment.ts` con la URL real del backend y configurar CORS en `src/main/java/com/goodvision/config/SecurityConfig.java`.

---

## Configuración

### Backend — `application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/good_vision?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=root
server.port=8080
```

### Frontend — `environment.ts`

```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080/api'
};
```

---

## Integrantes

- Misael Challco
