import ApolloClient, { createNetworkInterface } from 'apollo-client'
import gql from 'graphql-tag'
import fetch from 'isomorphic-fetch'
import HttpsProxyAgent from 'https-proxy-agent'

export default class GitHubQL {
    constructor() {
        this.client = new ApolloClient({
            networkInterface: createNetworkInterface({uri: 'https://api.github.com/graphql'}),
        });
        this.client.networkInterface.use([{
            applyMiddleware(req,next){
                if(!req.options.headers) {
                    req.options.headers = {};
                } 
                // setup GitHub token
                let token = process.env['GITHUB_API_TOKEN'] || ''
                req.options.headers.authorization = 'Bearer ' + token
                // setup proxy
                let proxy = process.env.http_proxy || ''
                if (proxy.length > 0) {
                    req.options.agent = new HttpsProxyAgent(proxy)
                }
                next()
            }
        }]);
    }

    query(model, done) {
        this.client.query(model.generateQuery())
            .then(result => done(result))
            .catch(error => console.log("gql_error: " + error));
    }
}