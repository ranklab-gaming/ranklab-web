/* tslint:disable */
/* eslint-disable */
/**
 *
 * @export
 * @interface Audio
 */
export interface Audio {
  /**
   *
   * @type {string}
   * @memberof Audio
   */
  id: string
  /**
   *
   * @type {string}
   * @memberof Audio
   */
  audioKey?: string | null
  /**
   *
   * @type {string}
   * @memberof Audio
   */
  uploadUrl?: string | null
  /**
   *
   * @type {string}
   * @memberof Audio
   */
  createdAt: string
  /**
   *
   * @type {string}
   * @memberof Audio
   */
  updatedAt: string
  /**
   *
   * @type {MediaState}
   * @memberof Audio
   */
  state: MediaState
  /**
   *
   * @type {string}
   * @memberof Audio
   */
  instanceId?: string | null
  /**
   *
   * @type {string}
   * @memberof Audio
   */
  transcript?: string | null
}
/**
 *
 * @export
 * @interface Avatar
 */
export interface Avatar {
  /**
   *
   * @type {string}
   * @memberof Avatar
   */
  id: string
  /**
   *
   * @type {string}
   * @memberof Avatar
   */
  imageKey?: string | null
  /**
   *
   * @type {string}
   * @memberof Avatar
   */
  uploadUrl?: string | null
  /**
   *
   * @type {string}
   * @memberof Avatar
   */
  createdAt: string
  /**
   *
   * @type {string}
   * @memberof Avatar
   */
  updatedAt: string
  /**
   *
   * @type {MediaState}
   * @memberof Avatar
   */
  state: MediaState
  /**
   *
   * @type {string}
   * @memberof Avatar
   */
  instanceId?: string | null
}
/**
 *
 * @export
 * @interface Comment
 */
export interface Comment {
  /**
   *
   * @type {string}
   * @memberof Comment
   */
  id: string
  /**
   *
   * @type {string}
   * @memberof Comment
   */
  recordingId: string
  /**
   *
   * @type {string}
   * @memberof Comment
   */
  userId: string
  /**
   *
   * @type {string}
   * @memberof Comment
   */
  body: string
  /**
   *
   * @type {string}
   * @memberof Comment
   */
  preview: string
  /**
   *
   * @type {any}
   * @memberof Comment
   */
  metadata: any | null
  /**
   *
   * @type {Audio}
   * @memberof Comment
   */
  audio?: Audio | null
  /**
   *
   * @type {User}
   * @memberof Comment
   */
  user?: User | null
}
/**
 *
 * @export
 * @interface CommentMetadata
 */
export interface CommentMetadata {
  /**
   *
   * @type {CommentMetadataValueOneOfVideo}
   * @memberof CommentMetadata
   */
  video: CommentMetadataValueOneOfVideo
}
/**
 * @type CommentMetadataValue
 *
 * @export
 */
export type CommentMetadataValue = CommentMetadataValueOneOf
/**
 *
 * @export
 * @interface CommentMetadataValueOneOf
 */
export interface CommentMetadataValueOneOf {
  /**
   *
   * @type {CommentMetadataValueOneOfVideo}
   * @memberof CommentMetadataValueOneOf
   */
  video: CommentMetadataValueOneOfVideo
}
/**
 *
 * @export
 * @interface CommentMetadataValueOneOfVideo
 */
export interface CommentMetadataValueOneOfVideo {
  /**
   *
   * @type {number}
   * @memberof CommentMetadataValueOneOfVideo
   */
  timestamp: number
  /**
   *
   * @type {string}
   * @memberof CommentMetadataValueOneOfVideo
   */
  drawing: string
}
/**
 *
 * @export
 * @interface CreateCommentRequest
 */
export interface CreateCommentRequest {
  /**
   *
   * @type {string}
   * @memberof CreateCommentRequest
   */
  body: string
  /**
   *
   * @type {string}
   * @memberof CreateCommentRequest
   */
  recordingId: string
  /**
   *
   * @type {CommentMetadata}
   * @memberof CreateCommentRequest
   */
  metadata: CommentMetadata
  /**
   *
   * @type {string}
   * @memberof CreateCommentRequest
   */
  audioId?: string | null
}
/**
 *
 * @export
 * @interface CreateGameRequest
 */
export interface CreateGameRequest {
  /**
   *
   * @type {string}
   * @memberof CreateGameRequest
   */
  email: string
  /**
   *
   * @type {string}
   * @memberof CreateGameRequest
   */
  name: string
}
/**
 *
 * @export
 * @interface CreatePasswordRequest
 */
export interface CreatePasswordRequest {
  /**
   *
   * @type {string}
   * @memberof CreatePasswordRequest
   */
  email: string
}
/**
 *
 * @export
 * @interface CreateRecordingRequest
 */
export interface CreateRecordingRequest {
  /**
   *
   * @type {string}
   * @memberof CreateRecordingRequest
   */
  title: string
  /**
   *
   * @type {number}
   * @memberof CreateRecordingRequest
   */
  skillLevel: number
  /**
   *
   * @type {GameId}
   * @memberof CreateRecordingRequest
   */
  gameId: GameId
  /**
   *
   * @type {RecordingMetadata}
   * @memberof CreateRecordingRequest
   */
  metadata: RecordingMetadata
  /**
   *
   * @type {string}
   * @memberof CreateRecordingRequest
   */
  notes: string
}
/**
 *
 * @export
 * @interface CreateSessionRequest
 */
export interface CreateSessionRequest {
  /**
   *
   * @type {Credentials}
   * @memberof CreateSessionRequest
   */
  credentials: Credentials
}
/**
 *
 * @export
 * @interface CreateUserRequest
 */
export interface CreateUserRequest {
  /**
   *
   * @type {string}
   * @memberof CreateUserRequest
   */
  name: string
  /**
   *
   * @type {Credentials}
   * @memberof CreateUserRequest
   */
  credentials: Credentials
  /**
   *
   * @type {GameId}
   * @memberof CreateUserRequest
   */
  gameId: GameId
  /**
   *
   * @type {number}
   * @memberof CreateUserRequest
   */
  skillLevel: number
}
/**
 * @type Credentials
 *
 * @export
 */
export type Credentials = CredentialsOneOf | CredentialsOneOf1
/**
 *
 * @export
 * @interface CredentialsOneOf
 */
export interface CredentialsOneOf {
  /**
   *
   * @type {PasswordCredentials}
   * @memberof CredentialsOneOf
   */
  password: PasswordCredentials
}
/**
 *
 * @export
 * @interface CredentialsOneOf1
 */
export interface CredentialsOneOf1 {
  /**
   *
   * @type {TokenCredentials}
   * @memberof CredentialsOneOf1
   */
  token: TokenCredentials
}
/**
 *
 * @export
 * @interface Game
 */
export interface Game {
  /**
   *
   * @type {string}
   * @memberof Game
   */
  name: string
  /**
   *
   * @type {GameId}
   * @memberof Game
   */
  id: GameId
  /**
   *
   * @type {Array<SkillLevel>}
   * @memberof Game
   */
  skillLevels: Array<SkillLevel>
}

/**
 *
 * @export
 */
export const GameId = {
  Overwatch: "overwatch",
} as const
export type GameId = (typeof GameId)[keyof typeof GameId]

/**
 *
 * @export
 */
export const MediaState = {
  Created: "Created",
  Uploaded: "Uploaded",
  Processed: "Processed",
} as const
export type MediaState = (typeof MediaState)[keyof typeof MediaState]

/**
 *
 * @export
 * @interface OneTimeTokenParams
 */
export interface OneTimeTokenParams {
  /**
   *
   * @type {string}
   * @memberof OneTimeTokenParams
   */
  token: string
}
/**
 *
 * @export
 * @interface PaginatedResultForRecording
 */
export interface PaginatedResultForRecording {
  /**
   *
   * @type {Array<Recording>}
   * @memberof PaginatedResultForRecording
   */
  records: Array<Recording>
  /**
   *
   * @type {number}
   * @memberof PaginatedResultForRecording
   */
  totalPages: number
  /**
   *
   * @type {number}
   * @memberof PaginatedResultForRecording
   */
  perPage: number
  /**
   *
   * @type {number}
   * @memberof PaginatedResultForRecording
   */
  page: number
  /**
   *
   * @type {number}
   * @memberof PaginatedResultForRecording
   */
  count: number
}
/**
 *
 * @export
 * @interface PasswordCredentials
 */
export interface PasswordCredentials {
  /**
   *
   * @type {string}
   * @memberof PasswordCredentials
   */
  email: string
  /**
   *
   * @type {string}
   * @memberof PasswordCredentials
   */
  password: string
}
/**
 *
 * @export
 * @interface Recording
 */
export interface Recording {
  /**
   *
   * @type {string}
   * @memberof Recording
   */
  id: string
  /**
   *
   * @type {string}
   * @memberof Recording
   */
  userId: string
  /**
   *
   * @type {string}
   * @memberof Recording
   */
  videoKey?: string | null
  /**
   *
   * @type {string}
   * @memberof Recording
   */
  thumbnailKey?: string | null
  /**
   *
   * @type {string}
   * @memberof Recording
   */
  uploadUrl?: string | null
  /**
   *
   * @type {string}
   * @memberof Recording
   */
  createdAt: string
  /**
   *
   * @type {string}
   * @memberof Recording
   */
  updatedAt: string
  /**
   *
   * @type {string}
   * @memberof Recording
   */
  gameId: string
  /**
   *
   * @type {string}
   * @memberof Recording
   */
  title: string
  /**
   *
   * @type {number}
   * @memberof Recording
   */
  skillLevel: number
  /**
   *
   * @type {MediaState}
   * @memberof Recording
   */
  state: MediaState
  /**
   *
   * @type {any}
   * @memberof Recording
   */
  metadata?: any | null
  /**
   *
   * @type {string}
   * @memberof Recording
   */
  instanceId?: string | null
  /**
   *
   * @type {string}
   * @memberof Recording
   */
  notes: string
  /**
   *
   * @type {User}
   * @memberof Recording
   */
  user?: User | null
  /**
   *
   * @type {string}
   * @memberof Recording
   */
  notesText: string
  /**
   *
   * @type {number}
   * @memberof Recording
   */
  commentCount: number
}
/**
 *
 * @export
 * @interface RecordingMetadata
 */
export interface RecordingMetadata {
  /**
   *
   * @type {RecordingOverwatchMetadata}
   * @memberof RecordingMetadata
   */
  overwatch: RecordingOverwatchMetadata
}
/**
 * @type RecordingMetadataValue
 *
 * @export
 */
export type RecordingMetadataValue = RecordingMetadataValueOneOf
/**
 *
 * @export
 * @interface RecordingMetadataValueOneOf
 */
export interface RecordingMetadataValueOneOf {
  /**
   *
   * @type {RecordingOverwatchMetadata}
   * @memberof RecordingMetadataValueOneOf
   */
  overwatch: RecordingOverwatchMetadata
}
/**
 *
 * @export
 * @interface RecordingOverwatchMetadata
 */
export interface RecordingOverwatchMetadata {
  /**
   *
   * @type {string}
   * @memberof RecordingOverwatchMetadata
   */
  replayCode: string
  /**
   *
   * @type {number}
   * @memberof RecordingOverwatchMetadata
   */
  playerPosition: number
}
/**
 *
 * @export
 * @interface Session
 */
export interface Session {
  /**
   *
   * @type {string}
   * @memberof Session
   */
  token: string
}
/**
 *
 * @export
 * @interface SkillLevel
 */
export interface SkillLevel {
  /**
   *
   * @type {string}
   * @memberof SkillLevel
   */
  name: string
  /**
   *
   * @type {number}
   * @memberof SkillLevel
   */
  value: number
}
/**
 *
 * @export
 * @interface StatusResponse
 */
export interface StatusResponse {
  /**
   *
   * @type {string}
   * @memberof StatusResponse
   */
  status: string
}
/**
 *
 * @export
 * @interface TokenCredentials
 */
export interface TokenCredentials {
  /**
   *
   * @type {string}
   * @memberof TokenCredentials
   */
  token: string
}
/**
 *
 * @export
 * @interface UpdateCommentRequest
 */
export interface UpdateCommentRequest {
  /**
   *
   * @type {string}
   * @memberof UpdateCommentRequest
   */
  body: string
  /**
   *
   * @type {CommentMetadata}
   * @memberof UpdateCommentRequest
   */
  metadata: CommentMetadata
  /**
   *
   * @type {string}
   * @memberof UpdateCommentRequest
   */
  audioId?: string | null
}
/**
 *
 * @export
 * @interface UpdatePasswordRequest
 */
export interface UpdatePasswordRequest {
  /**
   *
   * @type {string}
   * @memberof UpdatePasswordRequest
   */
  password: string
}
/**
 *
 * @export
 * @interface UpdateUserRequest
 */
export interface UpdateUserRequest {
  /**
   *
   * @type {string}
   * @memberof UpdateUserRequest
   */
  name: string
  /**
   *
   * @type {GameId}
   * @memberof UpdateUserRequest
   */
  gameId: GameId
  /**
   *
   * @type {boolean}
   * @memberof UpdateUserRequest
   */
  emailsEnabled: boolean
  /**
   *
   * @type {string}
   * @memberof UpdateUserRequest
   */
  avatarId?: string | null
  /**
   *
   * @type {number}
   * @memberof UpdateUserRequest
   */
  skillLevel: number
}
/**
 *
 * @export
 * @interface User
 */
export interface User {
  /**
   *
   * @type {string}
   * @memberof User
   */
  id: string
  /**
   *
   * @type {string}
   * @memberof User
   */
  name: string
  /**
   *
   * @type {string}
   * @memberof User
   */
  email: string
  /**
   *
   * @type {string}
   * @memberof User
   */
  gameId: string
  /**
   *
   * @type {boolean}
   * @memberof User
   */
  emailsEnabled: boolean
  /**
   *
   * @type {string}
   * @memberof User
   */
  intercomHash?: string | null
  /**
   *
   * @type {string}
   * @memberof User
   */
  avatarId?: string | null
  /**
   *
   * @type {string}
   * @memberof User
   */
  avatarImageKey?: string | null
  /**
   *
   * @type {number}
   * @memberof User
   */
  skillLevel: number
}
