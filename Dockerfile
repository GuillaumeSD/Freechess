# Build Stage
FROM node:lts-alpine3.22 AS build

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Build source
COPY . .
RUN npm run build

# Production Stage
FROM nginx:alpine AS production

COPY --from=build /app/out /usr/share/nginx/html

# Replace default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port (make sure this matches the nginx.conf!)
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]