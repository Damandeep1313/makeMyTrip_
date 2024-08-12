# Use your existing base image or version of Node.js
FROM node:14

# Install dependencies for Puppeteer and Chrome
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
    libgconf-2-4 \
    fonts-liberation \
    libappindicator3-1 \
    libu2f-udev \
    libdbus-1-3 \
    libnspr4 \
    libnss3 \
    xdg-utils \
    # Install Chrome
    curl \
    && curl -sS https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
    -o google-chrome-stable_current_amd64.deb \
    && dpkg -i google-chrome-stable_current_amd64.deb \
    && apt-get install -f \
    && rm google-chrome-stable_current_amd64.deb

# Install Puppeteer
RUN npm install puppeteer

# Copy application code
COPY . /app
WORKDIR /app

# Install app dependencies
RUN npm install

# Set the command to run the application
CMD ["node", "server.mjs"]
