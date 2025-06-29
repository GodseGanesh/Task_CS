FROM node:20

WORKDIR /app

# copy the correct package.json from the Task subdirectory
COPY Task/package*.json ./Task/

# install
WORKDIR /app/Task
RUN npm install

# copy the actual code
COPY Task ./Task

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
