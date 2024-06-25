FROM node:14 AS build

WORKDIR /app

COPY package*.json ./

# Instala todas as dependências do projeto
RUN npm install

COPY . .

# Adicione este comando para listar arquivos e verificar se a pasta dist está presente
RUN ls -l /app

# Execute o comando de build
RUN npx vite build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]