import { Adapter as OidcAdapter, AdapterPayload } from "oidc-provider"
import {
  DynamoDBDocument,
  QueryCommandInput,
  UpdateCommandInput,
  GetCommandInput,
  DeleteCommandInput,
} from "@aws-sdk/lib-dynamodb"
import {
  AttributeValue,
  BatchWriteItemInput,
  DynamoDB,
  WriteRequest,
} from "@aws-sdk/client-dynamodb"
import {
  awsAccessKeyId,
  awsSecretAccessKey,
  dynamoDbEndpoint,
} from "../config.js"

const TABLE_NAME = "oidc"
const TABLE_REGION = "eu-west-2"

const dynamoClient = DynamoDBDocument.from(
  new DynamoDB({
    region: TABLE_REGION,
    endpoint: dynamoDbEndpoint,
    credentials: {
      accessKeyId: awsAccessKeyId,
      secretAccessKey: awsSecretAccessKey,
    },
  }),
  { marshallOptions: { removeUndefinedValues: true } },
)

const handleErrors = <T>(fn: () => T) => {
  try {
    return fn()
  } catch (err) {
    console.error("[dynamodb error]", err)
    throw err
  }
}

export class Adapter implements OidcAdapter {
  name: string

  constructor(name: string) {
    this.name = name
  }

  async upsert(
    id: string,
    payload: AdapterPayload,
    expiresIn?: number,
  ): Promise<void> {
    return handleErrors(async () => {
      const expiresAt = expiresIn
        ? Math.floor(Date.now() / 1000) + expiresIn
        : null

      const params: UpdateCommandInput = {
        TableName: TABLE_NAME,
        Key: { modelId: this.name + "-" + id },
        UpdateExpression:
          "SET payload = :payload" +
          (expiresAt ? ", expiresAt = :expiresAt" : "") +
          (payload.userCode ? ", userCode = :userCode" : "") +
          (payload.uid ? ", uid = :uid" : "") +
          (payload.grantId ? ", grantId = :grantId" : ""),
        ExpressionAttributeValues: {
          ":payload": payload,
          ...(expiresAt ? { ":expiresAt": expiresAt } : {}),
          ...(payload.userCode ? { ":userCode": payload.userCode } : {}),
          ...(payload.uid ? { ":uid": payload.uid } : {}),
          ...(payload.grantId ? { ":grantId": payload.grantId } : {}),
        },
      }

      await dynamoClient.update(params)
    })
  }

  async find(id: string): Promise<AdapterPayload | undefined> {
    return handleErrors(async () => {
      const params: GetCommandInput = {
        TableName: TABLE_NAME,
        Key: { modelId: this.name + "-" + id },
        ProjectionExpression: "payload, expiresAt",
      }

      const result = <
        { payload: AdapterPayload; expiresAt?: number } | undefined
      >(await dynamoClient.get(params)).Item

      if (
        !result ||
        (result.expiresAt && Date.now() > result.expiresAt * 1000)
      ) {
        return undefined
      }

      return result.payload
    })
  }

  async findByUserCode(userCode: string): Promise<AdapterPayload | undefined> {
    return handleErrors(async () => {
      const params: QueryCommandInput = {
        TableName: TABLE_NAME,
        IndexName: "userCodeIndex",
        KeyConditionExpression: "userCode = :userCode",
        ExpressionAttributeValues: {
          ":userCode": userCode,
        },
        Limit: 1,
        ProjectionExpression: "payload, expiresAt",
      }

      const result = <
        { payload: AdapterPayload; expiresAt?: number } | undefined
      >(await dynamoClient.query(params)).Items?.[0]

      if (
        !result ||
        (result.expiresAt && Date.now() > result.expiresAt * 1000)
      ) {
        return undefined
      }

      return result.payload
    })
  }

  async findByUid(uid: string): Promise<AdapterPayload | undefined> {
    return handleErrors(async () => {
      const params: QueryCommandInput = {
        TableName: TABLE_NAME,
        IndexName: "uidIndex",
        KeyConditionExpression: "uid = :uid",
        ExpressionAttributeValues: {
          ":uid": uid,
        },
        Limit: 1,
        ProjectionExpression: "payload, expiresAt",
      }

      const result = <
        { payload: AdapterPayload; expiresAt?: number } | undefined
      >(await dynamoClient.query(params)).Items?.[0]

      if (
        !result ||
        (result.expiresAt && Date.now() > result.expiresAt * 1000)
      ) {
        return undefined
      }

      return result.payload
    })
  }

  async consume(id: string): Promise<void> {
    return handleErrors(async () => {
      const params: UpdateCommandInput = {
        TableName: TABLE_NAME,
        Key: { modelId: this.name + "-" + id },
        UpdateExpression: "SET #payload.#consumed = :value",
        ExpressionAttributeNames: {
          "#payload": "payload",
          "#consumed": "consumed",
        },
        ExpressionAttributeValues: {
          ":value": Math.floor(Date.now() / 1000),
        },
        ConditionExpression: "attribute_exists(modelId)",
      }

      await dynamoClient.update(params)
    })
  }

  async destroy(id: string): Promise<void> {
    return handleErrors(async () => {
      const params: DeleteCommandInput = {
        TableName: TABLE_NAME,
        Key: { modelId: this.name + "-" + id },
      }

      await dynamoClient.delete(params)
    })
  }

  async revokeByGrantId(grantId: string): Promise<void> {
    return handleErrors(async () => {
      let ExclusiveStartKey: Record<string, AttributeValue> | undefined =
        undefined

      do {
        const params: QueryCommandInput = {
          TableName: TABLE_NAME,
          IndexName: "grantIdIndex",
          KeyConditionExpression: "grantId = :grantId",
          ExpressionAttributeValues: {
            ":grantId": grantId,
          },
          ProjectionExpression: "modelId",
          Limit: 25,
          ExclusiveStartKey,
        }

        const queryResult = await dynamoClient.query(params)
        ExclusiveStartKey = queryResult.LastEvaluatedKey

        const items = <{ modelId: string }[] | undefined>queryResult.Items

        if (!items || !items.length) {
          return
        }

        const batchWriteParams: BatchWriteItemInput = {
          RequestItems: {
            oidc: items.reduce<WriteRequest[]>((acc, item) => {
              const params: DeleteCommandInput = {
                TableName: TABLE_NAME,
                Key: { modelId: item.modelId },
              }

              return [...acc, { DeleteRequest: params }]
            }, []),
          },
        }

        await dynamoClient.batchWrite(batchWriteParams)
      } while (ExclusiveStartKey)
    })
  }
}
