FROM node:20-alpine

WORKDIR /app

# Copy dependency files first
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy project files
COPY . .

# Disable telemetry (clean logs)
ENV NEXT_TELEMETRY_DISABLED=1

# Hot reload inside Docker
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true

EXPOSE 3000

CMD ["npm", "run", "dev"]