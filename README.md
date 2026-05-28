# SIB Manager Frontend

Frontend del sistema de gestión de empleados desarrollado en React con Vite y TanStack Table.

## Requisitos

- [Node.js 18+](https://nodejs.org/)
- El backend [SIBManagerAPI](https://github.com/josemirandaa01/SIBManagerAPI) corriendo localmente

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/josemirandaa01/sib-manager-frontend.git
cd sib-manager-frontend
```

2. Instala las dependencias:
```bash
npm install
```

## Configuración

Si el backend corre en un puerto diferente al `7236`, abre `src/services/api.js` y cambia la URL:

```javascript
const BASE_URL = "https://localhost:7236/api";
```

## Correr el proyecto

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

> Asegúrate de tener el backend corriendo antes de abrir el frontend.

## Permisos por rol

| Rol | Inicio | Consulta | Crear | Editar | Eliminar | Usuarios | Reporte |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| RRHH | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Consulta | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |

## Tecnologías

- React 18
- Vite
- React Router DOM
- TanStack Table
- React Modal
- Tabler Icons
