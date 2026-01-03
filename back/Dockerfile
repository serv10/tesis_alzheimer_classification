FROM node:20-slim

# Instalar dependencias del sistema para canvas (necesario para TensorFlow.js)
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Crear directorio de uploads
RUN mkdir -p /app/uploads

EXPOSE 4001

CMD ["npm", "run", "dev"]
