import jsonServer from 'json-server';

const server = jsonServer.create();
const router = jsonServer.router('./mock/db.json');
const middlewares = jsonServer.defaults();
const port = 3333;

server.use(middlewares);
server.use(router);
server.listen(port, () => {
    console.log(`O servidor está rodando em http://192.168.25.177:${port}/`);
});