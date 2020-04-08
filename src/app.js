const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function isValidId(request, response, next) {

  const { id } = request.params;

  if(!isUuid(id)) {
    response.status(400).json({ error: 'id is not valid.' })
  }

  return next();

}

app.get("/repositories", (request, response) => {

  response.json(repositories);

});

app.post("/repositories", (request, response) => {
  
  const id = uuid();
  const { title, url, techs, likes } = request.body;

  const likesTmp = (likes == null) ? 0 : Number(likes);

  const repository = { id, title, url, techs, likes: likesTmp };

  repositories.push(repository);

  return response.json(repository);

});

app.put("/repositories/:id", isValidId, (request, response) => {
  
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(item => item.id === id);
  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'repository not found.' });
  }

  repositories[repositoryIndex] = 
  { 
    id: repositories[repositoryIndex].id, 
    title,
    url, 
    techs, 
    likes: repositories[repositoryIndex].likes 
  };

  const repository = repositories[repositoryIndex];

  return response.json(repository);

});

app.delete("/repositories/:id", isValidId, (request, response) => {
  
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(item => item.id === id);
  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'repository not found.' });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", isValidId, (request, response) => {
  
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(item => item.id === id);
  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'repository not found.' });
  }

  repositories[repositoryIndex] = 
  { 
    id: repositories[repositoryIndex].id, 
    title: repositories[repositoryIndex].title,
    url: repositories[repositoryIndex].url,
    techs: repositories[repositoryIndex].techs,
    likes: repositories[repositoryIndex].likes + 1 
  };

  return response.json(repositories[repositoryIndex]);

});

module.exports = app;
