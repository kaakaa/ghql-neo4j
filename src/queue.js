import kue from 'kue'

import followProcess from './processes/following'
import followerProcess from './processes/followed'
import contributedRepoProcess from './processes/contributed'
import starredRepoProcess from './processes/starred'

export const PROCESS = {
    USER_FOLLOWING: 'user.following',
    USER_FOLLOWED: 'user.followed',
    REPO_CONTRIBUTED: 'user.repo.contributed',
    REPO_STARRED: 'user.repo.starred',
}

export class Queue {
    constructor() {
        this.queue = kue.createQueue({
            prefix: 'q',
            redis: {
                port: 6379,
                host: 'localhost'
            }
        })
        kue.app.listen(3000)
    }
    init() {
        this.queue.process('ping', function(job, done){
            done()
        })
        this.queue.process(PROCESS.USER_FOLLOWING, followProcess)
        this.queue.process(PROCESS.USER_FOLLOWED, followerProcess)
        this.queue.process(PROCESS.REPO_CONTRIBUTED, contributedRepoProcess)
        this.queue.process(PROCESS.REPO_STARRED, starredRepoProcess)
    }
    create(job, data) {
        this.queue.create(job, data).save(function(err){
            if( !err ) console.log( "success:" + job );
        })
    }
}