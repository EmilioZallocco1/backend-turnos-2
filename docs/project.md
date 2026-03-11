# Backend para gestión de turnos médicos

## Descripción del proyecto

Esta API REST fue construída con **Express** y **TypeScript** para administrar un sistema de turnos médicos. Los datos se persisten mediante **MikroORM**, aprovechando el patrón Data Mapper y el Unit of Work para mantener coherencia y simplificar la lógica de acceso a la base de datos.

El proyecto incluye las siguientes entidades principales:

* **Paciente** — información personal y de contacto de los pacientes.
* **Médico** — datos de los profesionales, incluyendo especialidad.
* **Especialidad** — categorías de práctica médica.
* **ObraSocial** — proveedores de seguro de salud.
* **Turno** — cita entre un paciente y un médico en una fecha determinada.

Además existen utilidades y middleware para autenticación, validación de datos y paginación.

## Estructura de carpetas

La aplicación se organiza por dominios en `src/`:

```
src/
  auth/            # controladores y middleware de autenticación
  paciente/        # CRUD y validadores de pacientes
  medico/          # CRUD y validadores de médicos
  especialidad/    # manejo de especialidades
  obraSocial/      # gestión de obras sociales
  turno/           # lógica de turnos y validación
  shared/db/       # configuración de MikroORM
  middlewares/     # utilidades generales (validación, JWT, etc.)
  utils/           # helpers (paginación, validaciones de campos)
```

## Endpoints principales

* `POST /login` – autenticación y obtención de token JWT.
* `POST /register` – registro de nuevos usuarios.
* `GET /pacientes`, `POST /pacientes` etc. – gestión de pacientes.
* `GET /medicos`, `POST /medicos` etc. – gestión de médicos.
* `GET /especialidades` – lista de especialidades.
* `GET /obras-sociales` – proveedores de cobertura.
* `GET /turnos`, `POST /turnos` etc. – manejo de turnos, filtrado por fecha, médico o paciente.

> La API utiliza middleware para proteger rutas con JWT y comprobar roles (admin, médico, paciente).

## Tecnologías clave

- **Node.js 18+**
- **Express 4**
- **TypeScript**
- **MikroORM** con PostgreSQL (configurable).
- **Jest** y **Supertest** para pruebas unitarias y de integración.

## Lectura adicional

El proyecto se basa en patrones como:

- [Data Mapper](https://www.martinfowler.com/eaaCatalog/dataMapper.html)
- [Unit of Work](https://mikro-orm.io/docs/unit-of-work)
- [Identity Map](https://mikro-orm.io/docs/identity-map)

---

Puedes encontrar los tests en la carpeta `test/` y comandos útiles en `package.json`. 
