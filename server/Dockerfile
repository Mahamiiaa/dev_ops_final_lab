FROM node:18-alpine

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install production dependencies only
RUN npm install --production

# Copy application source
COPY . .

# The server expects MONGO_URI and JWT_SECRET as environment variables.
# Pass them via docker-compose.yml or docker run -e.
# Example:
#   MONGO_URI=mongodb://mongo:27017/taskmanager
#   JWT_SECRET=your-secret-key

EXPOSE 5000

CMD ["node", "server.js"]