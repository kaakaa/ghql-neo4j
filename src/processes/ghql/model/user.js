import gql from 'graphql-tag'

export default class GHUser {
    constructor(login) {
        this.login = login
    }
    generateQuery() {
        return {
            query: gql`
                query Following($login: String!){
                    user(login: $login) {
                        login
                        following(first:100){
                            nodes {
                                login
                            }
                        }
                    }
                }`,
            variables: {
                login: this.login
            }
        }
    }
}