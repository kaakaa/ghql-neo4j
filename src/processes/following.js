import GitHubQL from './ghql/graphql'
import GHUser from './ghql/model/user'
import Neo4jClient from './neo4j/neo4j.js'

const gql = new GitHubQL()

export default function(job, done) {
    const user = new GHUser(job.data.login)

    gql.query(user, function(data) {
        const name = data.data.user.login
        const following = data.data.user.following.nodes.map(function(val, idx, array){return val.login})
        
        const client = new Neo4jClient()
        client.mergeUser([name])
        client.mergeUser(following)
        client.followUser({"name": name, "follow": following})
    })
    done()
}