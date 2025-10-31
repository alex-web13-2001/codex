FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production || npm install --production --registry=https://registry.npmmirror.com
COPY . .
RUN npm run build || echo "No build step"
CMD ["node", "src/server.js"]
