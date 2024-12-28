import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { generateUploadUrl } from '../../businessLogic/todos.mjs'

export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({
    credentials: true
  }))
  .handler(async (event) => {
    const todoId = event.pathParameters.todoId
    const url = await generateUploadUrl(todoId)
    
    return {
      statusCode: 201,
      body: JSON.stringify({
        uploadUrl: url
      })
    }
  })

