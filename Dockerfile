FROM node:14

# Install Puppeteer dependencies
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    libnss3 \
    libgdk-pixbuf2.0-0 \
    libatk-bridge2.0-0 \
    libx11-xcb1 \
    libxcb-dri3-0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libxshmfence1 \
    libxtst6 \
    libnss3 \
    libgconf-2-4

# Install Puppeteer
RUN npm install puppeteer

# Your app setup
COPY . /app
WORKDIR /app
RUN npm install
CMD ["node", "server.mjs"]
