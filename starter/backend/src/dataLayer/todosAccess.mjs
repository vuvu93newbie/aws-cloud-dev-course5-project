import { createLogger } from "../utils/logger.mjs"
import { DynamoDB, ReturnValue } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'
import { generateUploadUrl } from "../fileStorage/attachmentUtils.mjs"

export class TodosAccess {
    constructor(
        documentClient = AWSXRay.captureAWSv3Client(new DynamoDB()),
        todosTable = process.env.TODOS_TABLE
    ) {
        this.todosTable = todosTable
        this.dynamoDbClient = DynamoDBDocument.from(documentClient)
        this.todosCreatedAtIndex = process.env.TODOS_CREATED_AT_INDEX
        this.logger = createLogger('todosAccess')
    }
    
    async createTodo(todo) {
        this.logger.info('Create todo')

        try {
            await this.dynamoDbClient.put({
                TableName: this.todosTable,
                Item: todo
            })
            this.logger.info('Create todo successfully')
            return todo
        } catch (error) {
            this.logger.error(`Create todo failed ${error.message}`)
            throw new Error(error.message)
        }
    }

    async getTodos(userId) {
        this.logger.info(`Get todos by user id ${userId}`)
        try {
            const result = await this.dynamoDbClient.query({
                TableName: this.todosTable,
                // IndexName: this.todosCreatedAtIndex,
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId
                }
            })
            return result.Items
        } catch (error) {
            this.logger.error(`Get todo by user id ${userId} failed ${error.message}`)
            throw new Error(error.message)
        }
    }

    async updateTodo(userId, todoId, data) {
        this.logger.info(`Update todo ${todoId}`)

        try {
            await this.dynamoDbClient.update({
                TableName: this.todosTable,
                Key: {
                    userId,
                    todoId
                },
                UpdateExpression: 'set name = :name, dueDate = :dueDate, done = :done',
                ExpressionAttributeValues: {
                    ':name': data.name,
                    ':dueDate': data.dueDate,
                    ':done': data.done
                },
                ReturnValues: 'ALL_NEW'
            })
            
            this.logger.info(`Update todo ${todoId} successfully`)
        } catch (error) {
            this.logger.error(`Update todo ${todoId} failed ${error.message}`)
            throw new Error(error.message)
        }
    }

    async deleteTodo(userId, todoId) {
        this.logger.info(`Delete todo ${todoId}`)

        try {
            await this.dynamoDbClient.delete({
                TableName: this.todosTable,
                Key: {
                    userId,
                    todoId
                }
            })

            this.logger.info(`Delete todo ${todoId} successfully`)
        } catch (error) {
            this.logger.error(`Delete todo ${todoId} failed ${error.message}`)
            throw new Error(error.message)
        }
    }

    async generateUploadUrl(todoId) {
        this.logger.info(`Generate image URL for Todo ${todoId}`)

        try {
            return await generateUploadUrl(todoId)
        } catch (error) {
            this.logger.error(`Generate image URL for Todo ${todoId} failed`)
            throw new Error(error.message)
        }
    }
}

