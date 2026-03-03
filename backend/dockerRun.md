You’re at the “turn the key and power the system” moment. At this point, Docker isn’t theory anymore — it’s just orchestration. Build → Run → Observe.

Here’s the clean, correct execution flow for your **dev environment**.

---

# Step 1 — Go to project root

The directory that contains:

```text
docker-compose.dev.yml
frontend/
backend/
.env.dev
```

```bash
cd your-project-root
```

---

# Step 2 — Build images + start containers

```bash
docker compose -f docker-compose.dev.yml up --build
```

What this does:

- `docker compose` → orchestration
- `-f docker-compose.dev.yml` → dev config
- `up` → start services
- `--build` → rebuild images from Dockerfile.dev

So it:

1. Builds frontend image
2. Builds backend image
3. Pulls postgres image
4. Creates network
5. Creates volume
6. Starts containers
7. Attaches logs to terminal

---

# Step 3 — Verify services

Open browser:

```text
Frontend → http://localhost:5173
Backend  → http://localhost:3000
DB       → localhost:5432
```

---

# Step 4 — Check containers

```bash
docker ps
```

You should see:

- frontend container
- backend container
- postgres container

---

# Step 5 — Logs (important for debugging)

```bash
docker compose -f docker-compose.dev.yml logs -f
```

Or per service:

```bash
docker compose -f docker-compose.dev.yml logs -f backend
docker compose -f docker-compose.dev.yml logs -f frontend
docker compose -f docker-compose.dev.yml logs -f db
```

---

# Step 6 — Exec into containers (debug mode)

```bash
docker exec -it chat-app-backend-1 sh
docker exec -it chat-app-frontend-1 sh
docker exec -it postgres-dev sh
```

Now you’re **inside** the containers.

---

# Step 7 — Stop containers

```bash
docker compose -f docker-compose.dev.yml down
```

Stops containers, keeps volume.

---

# Step 8 — Full reset (nuclear option)

```bash
docker compose -f docker-compose.dev.yml down -v
```

This:

- stops containers
- deletes volumes
- deletes DB data
- full reset

---

# Common dev commands cheat sheet

```bash
docker compose up --build
docker compose up -d
docker compose down
docker compose down -v
docker compose logs -f
docker ps
docker images
docker volume ls
docker network ls
```

---

# What you should expect

When it works correctly:

Frontend logs:

```text
Vite dev server running at http://0.0.0.0:5173
```

Backend logs:

```text
Server started on port 3000
Connected to database
```

DB logs:

```text
database system is ready to accept connections
```

---

# Dev-mode behavior

- Edit frontend code → browser reloads
- Edit backend code → server restarts
- DB persists data
- Containers stay running
- Network stable
- Logs stream live

---

# Failure patterns (quick diagnosis)

### ❌ Port already in use

```text
bind: address already in use
```

Fix:

```bash
netstat -ano | findstr :3000
```

### ❌ DB not ready

Backend fails connection → add retry logic or wait

### ❌ Env missing

```text
DATABASE_URL not defined
```

Fix `.env.dev`

### ❌ Prisma fails

DB container not reachable → check `db` hostname

---

# Pro workflow

Dev loop:

```text
code → save → container reload → logs → browser test
```

No manual restarts. No local installs. No env pollution.

---

# Mental model checkpoint

At this point, your laptop is acting like a **mini cloud cluster**:

- isolated services
- internal networking
- DNS routing
- persistent storage
- config injection
- process isolation
- reproducible infra

This is not “running Docker”.
This is **operating a distributed system**.

---

If something fails, paste the logs — not the config — and we debug like engineers, not guessers.
