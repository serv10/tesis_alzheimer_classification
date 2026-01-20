# Alzheimer Classification System

Sistema de clasificación de Alzheimer utilizando imágenes de resonancia magnética (MRI).

## Tecnologías

- **Frontend:** Vue 3 + Vite
- **Backend:** Node.js + Express
- **Base de Datos:** SQL Server 2022
- **Contenedores:** Docker + Docker Compose

## Requisitos Previos

- [Docker](https://docs.docker.com/get-docker/) instalado
- [Docker Compose](https://docs.docker.com/compose/install/) instalado
- (Opcional) [Make](https://www.gnu.org/software/make/) para usar comandos simplificados

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/serv10/tesis_alzheimer_classification.git
cd tesis_alzheimer_classification
```

### 2. Configurar variables de entorno

El archivo de configuración se encuentra en `back/.env`. Debes modificar las credenciales según tu entorno:

```env
# Database Configuration (SQL Server)
DB_HOST=localhost
DB_USER=sa
DB_PWD=P@ssw0rd1234!        # Cambiar por una contraseña segura
DB_NAME=AlzheimerClassification
DB_PORT=1433

# Server Configuration
PORT=4001

# File Paths
PATH_UPLOADED_IMAGES=./uploads
PATH_MODEL_JSON=./model/model.json

# Python API
PYTHON_API_URL=http://127.0.0.1:5000
```

> **Importante:** Si cambias `DB_PWD` en `back/.env`, también debes actualizar la variable `MSSQL_SA_PASSWORD` en el archivo `docker-compose.yml` para que coincidan.

---

## Levantar el Proyecto

### Opción 1: Usando Makefile (Recomendado)

```bash
# Ver todos los comandos disponibles
make help

# Levantar todo el sistema (BD + Backend + Frontend)
make up

# Ver logs de todos los servicios
make logs

# Detener todos los servicios
make down

# Limpiar todo (contenedores + volúmenes)
make clean
```

#### Comandos específicos por servicio:

| Comando | Descripción |
|---------|-------------|
| `make db` | Levanta solo la base de datos |
| `make db-logs` | Ver logs de la base de datos |
| `make db-shell` | Acceder a la consola SQL Server |
| `make backend` | Levanta BD + Backend |
| `make backend-logs` | Ver logs del backend |
| `make frontend` | Levanta solo el frontend |
| `make frontend-logs` | Ver logs del frontend |
| `make destroy` | Elimina TODO (contenedores, volúmenes, imágenes) |

---

### Opción 2: Usando Docker Compose directamente

```bash
# Levantar todo el sistema
docker compose up -d --build

# Ver logs de todos los servicios
docker compose logs -f

# Detener todos los servicios
docker compose down

# Limpiar contenedores y volúmenes
docker compose down -v --remove-orphans
```

#### Comandos específicos por servicio:

```bash
# Solo base de datos
docker compose up -d --build db
docker compose logs -f db

# Solo backend (incluye BD)
docker compose up -d --build db backend
docker compose logs -f backend

# Solo frontend
docker compose up -d --build frontend
docker compose logs -f frontend

# Acceder a la consola SQL Server
docker exec -it alzheimer-db /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "P@ssw0rd1234!" -C
```

---

## Acceso a la Aplicación

Una vez levantados los servicios:

| Servicio | URL |
|----------|-----|
| **Frontend** | http://localhost:5173 |
| **Backend API** | http://localhost:4001 |
| **Base de Datos** | localhost:1433 |

---

## Estructura del Proyecto

```
tesis_alzheimer_classification/
├── front/          # Frontend Vue 3 + Vite
├── back/           # Backend Node.js + Express
├── bd/             # Scripts de base de datos
├── docker-compose.yml
├── Makefile
└── README.md
```

---

## Solución de Problemas

### La base de datos no inicia correctamente

La base de datos SQL Server puede tardar en estar lista. El backend esperará automáticamente gracias al healthcheck configurado.

```bash
# Verificar el estado de los contenedores
docker compose ps

# Ver logs específicos de la BD
make db-logs
# o
docker compose logs -f db
```

### Reiniciar desde cero

```bash
# Con Makefile
make destroy
make up

# Con Docker Compose
docker compose down -v --remove-orphans --rmi all
docker compose up -d --build
```

---

## Licencia

Este proyecto fue desarrollado como parte de una tesis universitaria.
