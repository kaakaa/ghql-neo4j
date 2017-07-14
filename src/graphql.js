import ApolloClient, { createNetworkInterface } from 'apollo-client'
import gql from 'graphql-tag'
import fetch from 'isomorphic-fetch'
import HttpsProxyAgent from 'https-proxy-agent'

import follow from './neo4j.js'

var networkInterface = createNetworkInterface({uri: 'https://api.github.com/graphql'});
networkInterface.use([{
    applyMiddleware(req,next){
        if(!req.options.headers) {
            req.options.headers = {};
        }
        let token = process.env['GITHUB_API_TOKEN'] || ''
        req.options.headers.authorization = 'Bearer ' + token
        let proxy = process.env.http_proxy || ''
        if (proxy.length > 0) {
            req.options.agent = new HttpsProxyAgent(proxy)
        }
        next()
    }
}]);
const client = new ApolloClient({
    networkInterface: networkInterface,
});

client.query({
    query: gql`
      query {
          viewer {
              login
              following(first:100){
                  nodes {
                      login
                  }
              }
          }
      }`,
  })
  .then(data => {
    const name = data.data.viewer.login
    const following = data.data.viewer.following.nodes.map(function(val, idx, array){return val.login})

    follow([
        {"name": name, "follow": following}
    ])
  })
  .catch(error => console.log(error));
