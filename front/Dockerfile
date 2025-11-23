FROM node:20-alpine
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY front/ .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]