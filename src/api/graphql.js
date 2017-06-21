const restrictToAuthenticated = require('../auth/restrictToAuthenticated');
const express = require('express');
const EventModel = require('../models/event');
const UserModel = require('../models/user');
const PushMessageModel = require('../webpush/models/PushMessage');
const graphqlExpress = require('graphql-server-express').graphqlExpress;
const makeExecutableSchema = require('graphql-tools').makeExecutableSchema;
const GraphQLDateTime = require('graphql-iso-date').GraphQLDateTime;
const app = express.Router();

function toISO(value) {
    return Date.toISOString(value);
}

var schema = makeExecutableSchema({
    typeDefs: `
        scalar Date
        type Query {
            viewer: User!
            messages: [PushMessage]
        }
        type User {
            id: Int!
            email: String!
            name: String!
            events: [Event]
            shirtSize: String
            dietaryRestrictions: String
            specialNeeds: String
            gender: String
            school: School
            roles: [String]!
            github: GitHub
        }
        type Event {
            id: ID!
            name: String!
            description: String
            photo: String
            times: Duration
            discord: DiscordChannel
            github: Repo
            links: [String]
            workshops: [Event]
            attendees: [User]
        }
        type School {
            id: Int!
            name: String!
        }
        type PushMessage {
            id: ID
            data: String
            recipients: [PushSubscription]
            failedRecipients: [PushSubscription]
        }
        type PushSubscription {
            id: ID
            endpoint: String!
            keys: PushKeys
        }
        type PushKeys {
            p256dh: String
            auth: String
        }
        type GitHub {
            repos(before: ID, after: ID): RepoList
        }
        type Duration {
            start: Date
            end: Date
        }
        type DiscordChannel {
            id: ID
            url: String
        }
        type RepoList {
            nodes: [Repo]
            startCursor: String
            endCursor: String
            hasNextPage: Boolean
            hasPreviousPage: Boolean
        }
        type Repo {
            id: ID
            name: String
            url: String
        }
    `,
    resolvers: {
        Date: GraphQLDateTime,
        Query: {
            viewer(obj, args, context) {
                return UserModel.findOne({ id: context.user.id }).populate('events').exec();
            },
            messages() {
                return PushMessageModel.find().exec();
            }
        },
        User: {
            github(obj) {
                return { id: obj.githubID, token: obj.githubToken };
            }
        },
        Event: {
            discord(obj) {
                return { id: obj.discordID, url: obj.discordURL };
            },
            github(obj) {
                return { id: obj.githubID, url: obj.githubURL };
            },
            workshops(obj) {
                return EventModel.findOne({ id: obj.id }).populate('workshops').exec()
                    .then(self => self.workshops);
            },
            attendees(obj) {
                return EventModel.findOne({ id: obj.id }).populate('attendees').exec()
                    .then(self => self.attendees);
            }
        },
        PushMessage: {
            recipients(obj) {
                return PushMessageModel.findById(obj.id).populate('recipients').exec()
                    .then(self => self.recipients);
            },
            failedRecipients(obj) {
                return PushMessageModel.findById(obj.id).populate('failedRecipients').exec()
                    .then(self => self.failedRecipients);
            }
        },
        GitHub: {
            repos(obj, options) {
                client = new Lokka({ transport: new Transport('https://api.github.com/graphql', { headers: { 'Authorization': `bearer ${obj.token}` }}) });
                return client.query(`query($before: String, $after: String) {
                  viewer {
                    repositories(affiliations: [OWNER, COLLABORATOR], before: $before, after: $after, first: 10, orderBy: {field: CREATED_AT, direction: DESC}) {
                      nodes {
                        id
                        name
                        url
                      }
                      pageInfo {
                        startCursor
                        endCursor
                        hasNextPage
                        hasPreviousPage
                      }
                    }
                  }
              }`, { before: options.before, after: options.after })
                .then(query => {
                    return {
                        nodes: query.viewer.repositories.nodes.map(node => {
                            return { id: node.id, url: node.url, name: node.name, client: client };
                        }),
                        startCursor: query.viewer.repositories.pageInfo.startCursor,
                        endCursor: query.viewer.repositories.pageInfo.endCursor,
                        hasNextPage: query.viewer.repositories.pageInfo.hasNextPage,
                        hasPreviousPage: query.viewer.repositories.pageInfo.hasPreviousPage
                    }
                });
            }
        },
        Repo: {
            id(obj) {
                if (obj.id) {
                    return obj.id;
                } else if (obj.url) {
                    return obj.client.query(`query($url: URI!) {
                      resource(url: $url) {
                        ... on Repository {
                          id
                        }
                      }
                  }`, { url: obj.url })
                        .then(query => query.resource.id);
                } else {
                    return new Error('No id or url given, cannot resolve id');
                }
            },
            url() {
                if (obj.url) {
                    return obj.url;
                } else if (obj.id) {
                    return obj.client.query(`query($id: ID!) {
                      node(id: $id) {
                        ... on Repository {
                          url
                        }
                      }
                  }`, { id: obj.id })
                        .then(query => query.node.url);
                } else {
                    return new Error('No id or url given, cannot resolve url');
                }
            },
            name() {
                if (obj.name) {
                    return obj.name;
                } else if (obj.id) {
                    return obj.client.query(`query($id: ID!) {
                      node(id: $id) {
                        ... on Repository {
                          name
                        }
                      }
                  }`, { id: obj.id })
                        .then(query => query.node.name);
                } else if (obj.url) {
                    return obj.client.query(`query($url: URI!) {
                      resource(url: $url) {
                        ... on Repository {
                          name
                        }
                      }
                  }`, { url: obj.url })
                        .then(query => query.resource.name);
                } else {
                    return new Error('No id, url or name given, cannot resolve name');
                }
            }
        }
    }
});

app.use('/', restrictToAuthenticated, graphqlExpress(req => ({ schema: schema, context: { user: req.user } })));

module.exports = app;
