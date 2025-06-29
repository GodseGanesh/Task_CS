FROM node:20

WORKDIR /app

COPY package*.json ./

# ensure devDependencies are installed
ENV NODE_ENV=development

# install Vite globally so the shell can find it
RUN npm install -g vite && npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
