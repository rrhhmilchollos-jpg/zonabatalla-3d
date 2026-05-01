# Vortex Royale

Juego web 3D de battle royale de ritmo rápido: explora un mapa dinámico, elimina rivales IA, recoge recursos y domina la zona segura. Diseñado para jugadores casuales en navegador móvil y escritorio.

Generado y mantenido automáticamente por **Maris AI**. Cada vez que actualizas la app desde Maris AI, este repo recibe un commit nuevo en `main` con la versión actual del código.

## Estructura

- `frontend/` — React + Vite + Tailwind

## Cómo correrlo en local

```bash
cd frontend
npm install
npm run dev
```

## Ejecutar con Docker

Esta carpeta incluye un `Dockerfile`, un `docker-compose.yml`, un `nginx.conf` y un `.dockerignore` listos para usar. Necesitas tener Docker Desktop (o equivalente) instalado.

```bash
docker compose up --build
```

Cuando termine el build, abre [http://localhost](http://localhost) en tu navegador.

Para parar todo:

```bash
docker compose down
```
