# Ethara Inventory & Order Management System

[![Frontend Live](https://img.shields.io/badge/Frontend-Live-success?style=for-the-badge&logo=railway)](https://carefree-possibility-production-c679.up.railway.app/)
[![Backend API](https://img.shields.io/badge/Backend%20API-Live-blue?style=for-the-badge&logo=fastapi)](https://etharaproject-production-cd5b.up.railway.app/api)
[![Backend Image](https://img.shields.io/badge/Docker%20Hub-ethara--backend-2496ED?style=for-the-badge&logo=docker)](https://hub.docker.com/r/bhumigupta2207/ethara-backend)
[![Frontend Image](https://img.shields.io/badge/Docker%20Hub-ethara--frontend-2496ED?style=for-the-badge&logo=docker)](https://hub.docker.com/r/bhumigupta2207/ethara-frontend)

Ethara is a simplified inventory and order management system built for the assessment brief. It includes a FastAPI backend, React frontend, PostgreSQL database, Dockerized services, and deployment-ready configuration.

## Implemented Features

- JWT authentication with protected dashboard and management routes
- Product management with unique SKU validation
- Customer management with unique email validation
- Order creation with existing customer and product validation
- Inventory validation that blocks insufficient-stock orders
- Automatic stock reduction and inventory audit logs when orders are placed
- Dashboard metrics for products, customers, orders, revenue, and low stock
- Responsive React UI for products, customers, orders, and inventory tracking
- PostgreSQL-ready async SQLAlchemy backend
- Docker Compose services for PostgreSQL, backend, and frontend
- Environment-variable based configuration with no hardcoded production credentials

## Tech Stack

- Backend: FastAPI, SQLAlchemy, PostgreSQL, JWT, Uvicorn
- Frontend: React, Vite, TypeScript, Tailwind CSS, React Query, Axios
- Infrastructure: Docker, Docker Compose, Railway-ready backend, Vercel/Railway-ready frontend

## Local Setup

1. Copy the environment template:

```bash
cp .env.example .env
```

2. Start the full application:

```bash
docker compose up --build
```

3. Open the services:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- OpenAPI docs: `http://localhost:8000/docs`

Demo users are seeded automatically:

- Manager: `manager@ethara.io` / `Manager123!`
- Viewer: `viewer@ethara.io` / `Viewer123!`

## Docker Images

Published Docker Hub images:

- Backend: `https://hub.docker.com/r/bhumigupta2207/ethara-backend`
- Frontend: `https://hub.docker.com/r/bhumigupta2207/ethara-frontend`

Pull commands:

```bash
docker pull bhumigupta2207/ethara-backend:latest
docker pull bhumigupta2207/ethara-frontend:latest
```

Build and push (reference commands):

```bash
docker build -t bhumigupta2207/ethara-backend:latest -f backend/Dockerfile backend
docker push bhumigupta2207/ethara-backend:latest

docker build --build-arg VITE_API_URL=https://etharaproject-production-cd5b.up.railway.app/api -t bhumigupta2207/ethara-frontend:latest -f frontend/Dockerfile frontend
docker push bhumigupta2207/ethara-frontend:latest
```

## Deployment Notes

Backend on Railway:

- Create a Railway project and add PostgreSQL.
- Deploy the `backend` folder or the backend Docker image.
- Set `DATABASE_URL`, `SECRET_KEY`, `ALGORITHM`, and `ACCESS_TOKEN_EXPIRE_MINUTES`.
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

Frontend on Vercel or Railway:

- Deploy the `frontend` folder.
- Set `VITE_API_URL=https://<backend-host>/api`.
- Build command: `npm run build`
- Output directory: `dist`

## Assessment Submission Links

- GitHub Repository Link (Frontend + Backend): `https://github.com/bhumigupta2207/ethara_project`
- Backend Docker Hub Image Link: `https://hub.docker.com/r/bhumigupta2207/ethara-backend`
- Frontend Docker Hub Image Link: `https://hub.docker.com/r/bhumigupta2207/ethara-frontend`
- Frontend Hosted URL: `https://carefree-possibility-production-c679.up.railway.app/`
- Backend API Hosted URL: `https://etharaproject-production-cd5b.up.railway.app/api`

## Docker Tag Evidence

The latest image tags are available on Docker Hub Tags pages:

- Backend tags: `https://hub.docker.com/r/bhumigupta2207/ethara-backend/tags`
- Frontend tags: `https://hub.docker.com/r/bhumigupta2207/ethara-frontend/tags`

Latest digests pushed:

- Backend `latest`: `sha256:a914e3faad316c9c57bd1a3a84db8a99e2c74fabed8b3b25925a288509796fb3`
- Frontend `latest`: `sha256:218b4e3eaef5213755424a9f3761d9be15e479ff8064f29d8ef952c31c042d3e`

## Submission Screenshots

For final grading, include these screenshots in your report or this README:

1. Docker Hub backend tags page showing `latest`
2. Docker Hub frontend tags page showing `latest`
3. Frontend hosted URL opened in browser
4. Backend `/api/openapi.json` or `/docs` opened in browser

## API Summary

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/products`
- `POST /api/products`
- `PUT /api/products/{product_id}`
- `DELETE /api/products/{product_id}`
- `GET /api/customers`
- `POST /api/customers`
- `PUT /api/customers/{customer_id}`
- `DELETE /api/customers/{customer_id}`
- `GET /api/orders`
- `POST /api/orders`
- `GET /api/orders/{order_id}`
- `GET /api/dashboard/stats`
