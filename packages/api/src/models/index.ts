/* tslint:disable */
/* eslint-disable */
/**
 *
 * @export
 * @interface AccountLink
 */
export interface AccountLink {
  /**
   *
   * @type {string}
   * @memberof AccountLink
   */
  url: string
}
/**
 *
 * @export
 * @interface BillingPortalLink
 */
export interface BillingPortalLink {
  /**
   *
   * @type {string}
   * @memberof BillingPortalLink
   */
  url: string
}
/**
 *
 * @export
 * @interface Coach
 */
export interface Coach {
  /**
   *
   * @type {string}
   * @memberof Coach
   */
  id: string
  /**
   *
   * @type {string}
   * @memberof Coach
   */
  name: string
  /**
   *
   * @type {string}
   * @memberof Coach
   */
  email: string
  /**
   *
   * @type {string}
   * @memberof Coach
   */
  bio: string
  /**
   *
   * @type {string}
   * @memberof Coach
   */
  gameId: string
  /**
   *
   * @type {number}
   * @memberof Coach
   */
  price: number
  /**
   *
   * @type {string}
   * @memberof Coach
   */
  country: string
  /**
   *
   * @type {boolean}
   * @memberof Coach
   */
  reviewsEnabled: boolean
  /**
   *
   * @type {boolean}
   * @memberof Coach
   */
  payoutsEnabled: boolean
}
/**
 *
 * @export
 * @interface CoachInvitationParams
 */
export interface CoachInvitationParams {
  /**
   *
   * @type {string}
   * @memberof CoachInvitationParams
   */
  token: string
}
/**
 *
 * @export
 * @interface CoachUpdateReviewRequest
 */
export interface CoachUpdateReviewRequest {
  /**
   *
   * @type {boolean}
   * @memberof CoachUpdateReviewRequest
   */
  published?: boolean | null
  /**
   *
   * @type {boolean}
   * @memberof CoachUpdateReviewRequest
   */
  taken?: boolean | null
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
  reviewId: string
  /**
   *
   * @type {string}
   * @memberof Comment
   */
  coachId: string
  /**
   *
   * @type {string}
   * @memberof Comment
   */
  body: string
  /**
   *
   * @type {number}
   * @memberof Comment
   */
  videoTimestamp: number
  /**
   *
   * @type {string}
   * @memberof Comment
   */
  drawing: string
}
/**
 *
 * @export
 * @interface CreateAccountLinkRequest
 */
export interface CreateAccountLinkRequest {
  /**
   *
   * @type {string}
   * @memberof CreateAccountLinkRequest
   */
  refreshUrl: string
  /**
   *
   * @type {string}
   * @memberof CreateAccountLinkRequest
   */
  returnUrl: string
}
/**
 *
 * @export
 * @interface CreateBillingPortalSession
 */
export interface CreateBillingPortalSession {
  /**
   *
   * @type {string}
   * @memberof CreateBillingPortalSession
   */
  returnUrl: string
}
/**
 *
 * @export
 * @interface CreateCoachRequest
 */
export interface CreateCoachRequest {
  /**
   *
   * @type {string}
   * @memberof CreateCoachRequest
   */
  email: string
  /**
   *
   * @type {string}
   * @memberof CreateCoachRequest
   */
  password: string
  /**
   *
   * @type {string}
   * @memberof CreateCoachRequest
   */
  name: string
  /**
   *
   * @type {string}
   * @memberof CreateCoachRequest
   */
  bio: string
  /**
   *
   * @type {string}
   * @memberof CreateCoachRequest
   */
  gameId: string
  /**
   *
   * @type {string}
   * @memberof CreateCoachRequest
   */
  country: string
  /**
   *
   * @type {number}
   * @memberof CreateCoachRequest
   */
  price: number
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
   * @type {number}
   * @memberof CreateCommentRequest
   */
  videoTimestamp: number
  /**
   *
   * @type {string}
   * @memberof CreateCommentRequest
   */
  reviewId: string
  /**
   *
   * @type {string}
   * @memberof CreateCommentRequest
   */
  drawing: string
}
/**
 *
 * @export
 * @interface CreateLoginLink
 */
export interface CreateLoginLink {
  /**
   *
   * @type {string}
   * @memberof CreateLoginLink
   */
  returnUrl: string
}
/**
 *
 * @export
 * @interface CreatePlayerRequest
 */
export interface CreatePlayerRequest {
  /**
   *
   * @type {string}
   * @memberof CreatePlayerRequest
   */
  name: string
  /**
   *
   * @type {string}
   * @memberof CreatePlayerRequest
   */
  email: string
  /**
   *
   * @type {string}
   * @memberof CreatePlayerRequest
   */
  password: string
  /**
   *
   * @type {string}
   * @memberof CreatePlayerRequest
   */
  gameId: string
  /**
   *
   * @type {number}
   * @memberof CreatePlayerRequest
   */
  skillLevel: number
}
/**
 *
 * @export
 * @interface CreateRecordingRequest
 */
export interface CreateRecordingRequest {
  /**
   *
   * @type {number}
   * @memberof CreateRecordingRequest
   */
  size: number
  /**
   *
   * @type {string}
   * @memberof CreateRecordingRequest
   */
  mimeType: string
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
   * @type {string}
   * @memberof CreateRecordingRequest
   */
  gameId: string
}
/**
 *
 * @export
 * @interface CreateReviewRequest
 */
export interface CreateReviewRequest {
  /**
   *
   * @type {string}
   * @memberof CreateReviewRequest
   */
  recordingId: string
  /**
   *
   * @type {string}
   * @memberof CreateReviewRequest
   */
  notes: string
  /**
   *
   * @type {string}
   * @memberof CreateReviewRequest
   */
  coachId: string
}
/**
 *
 * @export
 * @interface CreateSessionRequest
 */
export interface CreateSessionRequest {
  /**
   *
   * @type {string}
   * @memberof CreateSessionRequest
   */
  email: string
  /**
   *
   * @type {string}
   * @memberof CreateSessionRequest
   */
  password: string
  /**
   *
   * @type {UserType}
   * @memberof CreateSessionRequest
   */
  userType: UserType
}
/**
 *
 * @export
 * @interface CreateSessionResponse
 */
export interface CreateSessionResponse {
  /**
   *
   * @type {string}
   * @memberof CreateSessionResponse
   */
  token: string
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
   * @type {string}
   * @memberof Game
   */
  id: string
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
 * @interface LoginLink
 */
export interface LoginLink {
  /**
   *
   * @type {string}
   * @memberof LoginLink
   */
  url: string
}
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
  /**
   *
   * @type {UserType}
   * @memberof OneTimeTokenParams
   */
  userType: UserType
}
/**
 *
 * @export
 * @interface PaginatedResultForReview
 */
export interface PaginatedResultForReview {
  /**
   *
   * @type {Array<Review>}
   * @memberof PaginatedResultForReview
   */
  records: Array<Review>
  /**
   *
   * @type {number}
   * @memberof PaginatedResultForReview
   */
  totalPages: number
  /**
   *
   * @type {number}
   * @memberof PaginatedResultForReview
   */
  perPage: number
  /**
   *
   * @type {number}
   * @memberof PaginatedResultForReview
   */
  page: number
  /**
   *
   * @type {number}
   * @memberof PaginatedResultForReview
   */
  count: number
}
/**
 *
 * @export
 * @interface PaymentMethod
 */
export interface PaymentMethod {
  /**
   *
   * @type {string}
   * @memberof PaymentMethod
   */
  id: string
  /**
   *
   * @type {string}
   * @memberof PaymentMethod
   */
  brand: string
  /**
   *
   * @type {string}
   * @memberof PaymentMethod
   */
  last4: string
}
/**
 *
 * @export
 * @interface Player
 */
export interface Player {
  /**
   *
   * @type {string}
   * @memberof Player
   */
  id: string
  /**
   *
   * @type {string}
   * @memberof Player
   */
  name: string
  /**
   *
   * @type {string}
   * @memberof Player
   */
  email: string
  /**
   *
   * @type {string}
   * @memberof Player
   */
  gameId: string
  /**
   *
   * @type {number}
   * @memberof Player
   */
  skillLevel: number
}
/**
 *
 * @export
 * @interface PlayerUpdateReviewRequest
 */
export interface PlayerUpdateReviewRequest {
  /**
   *
   * @type {boolean}
   * @memberof PlayerUpdateReviewRequest
   */
  accepted: boolean
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
  playerId: string
  /**
   *
   * @type {string}
   * @memberof Recording
   */
  videoKey: string
  /**
   *
   * @type {string}
   * @memberof Recording
   */
  uploadUrl?: string | null
  /**
   *
   * @type {boolean}
   * @memberof Recording
   */
  uploaded: boolean
  /**
   *
   * @type {string}
   * @memberof Recording
   */
  mimeType: string
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
}
/**
 *
 * @export
 * @interface ResetPasswordRequest
 */
export interface ResetPasswordRequest {
  /**
   *
   * @type {string}
   * @memberof ResetPasswordRequest
   */
  email: string
  /**
   *
   * @type {UserType}
   * @memberof ResetPasswordRequest
   */
  userType: UserType
}
/**
 *
 * @export
 * @interface Review
 */
export interface Review {
  /**
   *
   * @type {string}
   * @memberof Review
   */
  id: string
  /**
   *
   * @type {string}
   * @memberof Review
   */
  playerId: string
  /**
   *
   * @type {string}
   * @memberof Review
   */
  coachId: string
  /**
   *
   * @type {string}
   * @memberof Review
   */
  recordingId: string
  /**
   *
   * @type {Recording}
   * @memberof Review
   */
  recording?: Recording | null
  /**
   *
   * @type {string}
   * @memberof Review
   */
  notes: string
  /**
   *
   * @type {ReviewState}
   * @memberof Review
   */
  state: ReviewState
  /**
   *
   * @type {string}
   * @memberof Review
   */
  createdAt: string
  /**
   *
   * @type {string}
   * @memberof Review
   */
  stripeClientSecret?: string | null
  /**
   *
   * @type {Coach}
   * @memberof Review
   */
  coach?: Coach | null
}

/**
 *
 * @export
 */
export const ReviewState = {
  AwaitingPayment: "AwaitingPayment",
  AwaitingReview: "AwaitingReview",
  Draft: "Draft",
  Published: "Published",
  Accepted: "Accepted",
  Refunded: "Refunded",
} as const
export type ReviewState = (typeof ReviewState)[keyof typeof ReviewState]

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
 * @interface UpdateCoachRequest
 */
export interface UpdateCoachRequest {
  /**
   *
   * @type {string}
   * @memberof UpdateCoachRequest
   */
  name: string
  /**
   *
   * @type {string}
   * @memberof UpdateCoachRequest
   */
  email: string
  /**
   *
   * @type {string}
   * @memberof UpdateCoachRequest
   */
  gameId: string
  /**
   *
   * @type {string}
   * @memberof UpdateCoachRequest
   */
  bio: string
  /**
   *
   * @type {number}
   * @memberof UpdateCoachRequest
   */
  price: number
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
   * @type {string}
   * @memberof UpdateCommentRequest
   */
  drawing: string
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
 * @interface UpdatePlayerRequest
 */
export interface UpdatePlayerRequest {
  /**
   *
   * @type {string}
   * @memberof UpdatePlayerRequest
   */
  name: string
  /**
   *
   * @type {string}
   * @memberof UpdatePlayerRequest
   */
  email: string
  /**
   *
   * @type {string}
   * @memberof UpdatePlayerRequest
   */
  gameId: string
  /**
   *
   * @type {number}
   * @memberof UpdatePlayerRequest
   */
  skillLevel: number
}

/**
 *
 * @export
 */
export const UserType = {
  Coach: "coach",
  Player: "player",
} as const
export type UserType = (typeof UserType)[keyof typeof UserType]
