"use strict";

import neo4j from 'neo4j-driver'

class FollowMaker {
    constructor(session) {
        this.session = session
    }
    makeUser(data) {
        let session = this.session
        const createUserPromises = data.map(function(val, index, array) {
            return session.run(
                'MERGE (p:Person {name: $name}) RETURN p',
                {name: val.name}
            );
        });
        const createFollowUserPromises = data.map(function(val, index, array) {
            return val.follow.map(function(val2, index2, array2) {
                return session.run(
                    'MERGE (p:Person {name: $name}) RETURN p',
                    {name: val2}
                )
            })
        });
        const createFollowRelationshipPromises = data.map(function(val, index, array) {
            return val.follow.map(function(val2, index2, array2) {
                return session.run(
                    `MATCH (a:Person),(b:Person) WHERE a.name={a} AND b.name={b} MERGE (a)-[f:Follow]->(b) RETURN f`,
                    {a: val.name, b: val2}
                )
            })
        });
        return Promise.all(createUserPromises, createFollowUserPromises, createFollowRelationshipPromises);
    }
}

export default function follow(person) {
    const uri = "bolt://" + process.env['NEO4J_HOST']
    const driver = neo4j.driver(uri, neo4j.auth.basic("neo4j", "neo4j"))

    const maker = new FollowMaker(driver.session())
    maker.makeUser(person)
        .then(data => {console.log(data); driver.close()})
       .catch(error => {console.log(error); driver.close()})
}