import { createLogger } from "../utils/logger.mjs"
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import AWSXRay from 'aws-xray-sdk-core'

const logger = createLogger('AttachmentUtils')
const bucketName = process.env.TODOS_S3_BUCKET
const s3Client = AWSXRay.captureAWSv3Client(new S3Client())

export async function generateUploadUrl(todoId) {
    logger.info(`Generate upload url for ${todoId}`)

    try {
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: todoId
        })

        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3000})
        logger.info(`SignedUrl created ${signedUrl}`)

        return signedUrl
    }
    catch (error) {
        logger.error(`Upload failed ${error.message}`)
        throw new Error(error.message)
    }
}