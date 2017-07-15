import { Queue, PROCESS } from './queue'


const queue = new Queue()
queue.init()

queue.create(PROCESS.USER_FOLLOWING, {
    login: 'kaakaa'
})