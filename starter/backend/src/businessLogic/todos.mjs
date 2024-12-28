import * as uuid from 'uuid'
import { createLogger } from '../utils/logger.mjs'
import { TodosAccess } from '../dataLayer/todosAccess.mjs'

const logger = createLogger('Todos Business Logic')
const bucketName = process.env.TODOS_S3_BUCKET
const todosAccess = new TodosAccess()

export async function createTodo(userId, data) {
    logger.info(`Create new todo for userId ${userId}`)
    const todoId = uuid.v4()
    const createdAt = new Date().toISOString()
    const attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}`
    const todo = {
        userId,
        todoId,
        createdAt,
        done: false,
        attachmentUrl: attachmentUrl,
        ...data
    }

    return await todosAccess.createTodo(todo)
}

export async function getTodos(userId) {
    logger.info(`Get todos of userId ${userId}`)
    return await todosAccess.getTodos(userId)
}

export async function updateTodo(userId, todoId, body) {
    logger.info(`Update todo ${todoId}`)
    return await todosAccess.updateTodo(userId, todoId, body)
}

export async function deleteTodo(userId, todoId) {
    logger.info(`Delete todo ${todoId}`)
    return await todosAccess.deleteTodo(userId, todoId)
}

export async function generateUploadUrl(todoId) {
    logger.info(`Generate image url for todo ${todoId}`)
    return await todosAccess.generateUploadUrl(todoId)
}