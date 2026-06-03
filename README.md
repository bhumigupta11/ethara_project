# Ethara Inventory & Order Management System

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

Build and push images after replacing `<dockerhub-username>`:

```bash
docker build -t <dockerhub-username>/ethara-backend:latest -f backend/Dockerfile backend
docker push <dockerhub-username>/ethara-backend:latest

docker build --build-arg VITE_API_URL=https://<backend-host>/api -t <dockerhub-username>/ethara-frontend:latest -f frontend/Dockerfile frontend
docker push <dockerhub-username>/ethara-frontend:latest
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

Replace these placeholders after publishing the repo, images, and hosted apps:

- GitHub Repository Link (Frontend + Backend): `https://github.com/<your-username>/ethara_project`
- Backend Docker Hub Image Link: `https://hub.docker.com/r/<your-username>/ethara-backend`
- Frontend Hosted URL: `https://<your-frontend-host>.vercel.app`
- Backend API Hosted URL: `https://<your-backend-host>.railway.app`

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
