const restrictToGithub = require('../auth/restrictToGithub');
const Lokka = require('lokka').Lokka;
const Transport = require('lokka-transport-http').Transport;

const express = require('express');
const app = express.Router();

app.get('/repos', restrictToGithub, (req, res, next) => {
    const client = new Lokka({ transport: new Transport('https://api.github.com/graphql', { headers: { 'Authorization': `bearer ${req.user.githubToken}` }}) });
    client.query(`query {
      viewer {
        repositories(affiliations: [OWNER, COLLABORATOR], first: 10, orderBy: {field: CREATED_AT, direction: DESC}) {
          edges {
            node {
              id
              name
              url
            }
          }
          pageInfo {
            endCursor
          }
        }
      }
    }`)
        .then(query => res.send(query))
        .catch(next);
});

module.exports = app;
