"use strict";

import neo4j from 'neo4j-driver'

export default class Neo4jClient {
    constructor() {
        const uri = "bolt://" + process.env['NEO4J_HOST']
        this.driver = neo4j.driver(uri, neo4j.auth.basic("neo4j", "admin"))
    }
    mergeUser(users) {
        let session = this.driver.session()
        const promises = users.map(function(val, index, array) {
            return session.run(
                'MERGE (p:Person {name: $name}) RETURN p',
                {name: val}
            )
        });
        return Promise.all(promises)
            .then(data => {console.log("neo: " + data); session.close()})
            .catch(error => {console.log("neo_error:" + error); session.close()})
    }

    followUser(data) {
        let session = this.driver.session()
        const promises = data.follow.map(function(val, index2, array2) {
            return session.run(
                `MATCH (a:Person),(b:Person) WHERE a.name={a} AND b.name={b} MERGE (a)-[f:Follow]->(b) RETURN f`,
                {a: data.name, b: val}
            )
        });
        return Promise.all(promises)
            .then(data => {console.log("neo: " + data); session.close()})
            .catch(error => {console.log("neo_error:" + error); session.close()})
    }
}
