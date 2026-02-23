# Stage 1: Build
FROM node:20-bookworm-slim AS builder

# Install make and build tools
RUN apt-get update && apt-get install -y make build-essential python3 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Execute the specific build procedure
RUN make setup
RUN npm run build

# ... (Stage 1: Builder remains the same) ...

# Stage 2: Serve
FROM node:20-bookworm-slim

WORKDIR /app

# 1. We must install curl so the healthcheck command can actually run
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# 2. Install the server
RUN npm install -g serve

# 3. Copy the built files
COPY --from=builder /app /app

# 4. The Healthcheck Instruction
# This tells Docker (and Coolify) to check if the server is responding on port 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

EXPOSE 3000

CMD ["serve", "-s", ".", "-l", "3000"]
