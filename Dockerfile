FROM node:lts-alpine

WORKDIR /app

# Install Chromium and other dependencies
RUN apk update && apk add --no-cache \
    chromium \
    harfbuzz \
    "freetype>2.8" \
    ttf-freefont \
    nss \
    dumb-init

# Set environment variables for Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Copy application files
COPY . /app

# Install npm dependencies
RUN npm install

EXPOSE 3000

# Use dumb-init to handle PID 1
ENTRYPOINT ["dumb-init", "--"]

CMD ["node", "server.mjs"]
