# GoodVision Frontend

Frontend Angular para probar el backend de GoodVision.

## Ejecutar

1. Inicia el backend Spring Boot en `http://localhost:8080`.
2. En esta carpeta ejecuta:

```bash
npm install
npm start
```

3. Abre `http://localhost:4200`.

El servidor Angular usa `proxy.conf.json`, por eso las llamadas a `/api` se redirigen al backend local.

## Modulos conectados

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET/POST/PUT/DELETE /api/productos`
- `GET/POST/PUT/DELETE /api/cliente`
- Busquedas por `nombre` de producto y `apellido` de cliente

Los modulos de inventario, ventas y medidas quedan como vistas preparadas para conectarse cuando existan sus endpoints.
