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
    url: string;
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
    url: string;
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
    id: string;
    /**
     * 
     * @type {string}
     * @memberof Coach
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof Coach
     */
    email: string;
    /**
     * 
     * @type {string}
     * @memberof Coach
     */
    bio: string;
    /**
     * 
     * @type {Array<UserGame>}
     * @memberof Coach
     */
    games: Array<UserGame>;
    /**
     * 
     * @type {string}
     * @memberof Coach
     */
    country: string;
    /**
     * 
     * @type {boolean}
     * @memberof Coach
     */
    canReview: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Coach
     */
    stripeDetailsSubmitted: boolean;
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
    published?: boolean | null;
    /**
     * 
     * @type {boolean}
     * @memberof CoachUpdateReviewRequest
     */
    taken?: boolean | null;
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
    id: string;
    /**
     * 
     * @type {string}
     * @memberof Comment
     */
    reviewId: string;
    /**
     * 
     * @type {string}
     * @memberof Comment
     */
    coachId: string;
    /**
     * 
     * @type {string}
     * @memberof Comment
     */
    body: string;
    /**
     * 
     * @type {number}
     * @memberof Comment
     */
    videoTimestamp: number;
    /**
     * 
     * @type {string}
     * @memberof Comment
     */
    drawing: string;
}
/**
 * 
 * @export
 * @interface CreateAccountLinkMutation
 */
export interface CreateAccountLinkMutation {
    /**
     * 
     * @type {string}
     * @memberof CreateAccountLinkMutation
     */
    refreshUrl: string;
    /**
     * 
     * @type {string}
     * @memberof CreateAccountLinkMutation
     */
    returnUrl: string;
}
/**
 * 
 * @export
 * @interface CreateBillingPortalSessionMutation
 */
export interface CreateBillingPortalSessionMutation {
    /**
     * 
     * @type {string}
     * @memberof CreateBillingPortalSessionMutation
     */
    returnUrl: string;
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
    name: string;
    /**
     * 
     * @type {string}
     * @memberof CreateCoachRequest
     */
    bio: string;
    /**
     * 
     * @type {Array<UserGame>}
     * @memberof CreateCoachRequest
     */
    games: Array<UserGame>;
    /**
     * 
     * @type {string}
     * @memberof CreateCoachRequest
     */
    country: string;
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
    body: string;
    /**
     * 
     * @type {number}
     * @memberof CreateCommentRequest
     */
    videoTimestamp: number;
    /**
     * 
     * @type {string}
     * @memberof CreateCommentRequest
     */
    reviewId: string;
    /**
     * 
     * @type {string}
     * @memberof CreateCommentRequest
     */
    drawing: string;
}
/**
 * 
 * @export
 * @interface CreateLoginLinkMutation
 */
export interface CreateLoginLinkMutation {
    /**
     * 
     * @type {string}
     * @memberof CreateLoginLinkMutation
     */
    returnUrl: string;
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
    name: string;
    /**
     * 
     * @type {Array<UserGame>}
     * @memberof CreatePlayerRequest
     */
    games: Array<UserGame>;
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
    size: number;
    /**
     * 
     * @type {string}
     * @memberof CreateRecordingRequest
     */
    mimeType: string;
}
/**
 * 
 * @export
 * @interface CreateReviewMutation
 */
export interface CreateReviewMutation {
    /**
     * 
     * @type {string}
     * @memberof CreateReviewMutation
     */
    recordingId: string;
    /**
     * 
     * @type {string}
     * @memberof CreateReviewMutation
     */
    title: string;
    /**
     * 
     * @type {string}
     * @memberof CreateReviewMutation
     */
    notes: string;
    /**
     * 
     * @type {string}
     * @memberof CreateReviewMutation
     */
    gameId: string;
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
    name: string;
    /**
     * 
     * @type {string}
     * @memberof Game
     */
    id: string;
    /**
     * 
     * @type {Array<SkillLevel>}
     * @memberof Game
     */
    skillLevels: Array<SkillLevel>;
    /**
     * 
     * @type {SkillLevel}
     * @memberof Game
     */
    minCoachSkillLevel: SkillLevel;
}
/**
 * 
 * @export
 * @interface Health
 */
export interface Health {
    /**
     * 
     * @type {string}
     * @memberof Health
     */
    status: string;
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
    url: string;
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
    id: string;
    /**
     * 
     * @type {string}
     * @memberof PaymentMethod
     */
    brand: string;
    /**
     * 
     * @type {string}
     * @memberof PaymentMethod
     */
    last4: string;
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
    id: string;
    /**
     * 
     * @type {string}
     * @memberof Player
     */
    auth0Id: string;
    /**
     * 
     * @type {string}
     * @memberof Player
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof Player
     */
    email: string;
    /**
     * 
     * @type {Array<UserGame>}
     * @memberof Player
     */
    games: Array<UserGame>;
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
    accepted: boolean;
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
    id: string;
    /**
     * 
     * @type {string}
     * @memberof Recording
     */
    playerId: string;
    /**
     * 
     * @type {string}
     * @memberof Recording
     */
    videoKey: string;
    /**
     * 
     * @type {string}
     * @memberof Recording
     */
    uploadUrl: string;
    /**
     * 
     * @type {boolean}
     * @memberof Recording
     */
    uploaded: boolean;
    /**
     * 
     * @type {string}
     * @memberof Recording
     */
    mimeType: string;
    /**
     * 
     * @type {string}
     * @memberof Recording
     */
    createdAt: string;
    /**
     * 
     * @type {string}
     * @memberof Recording
     */
    updatedAt: string;
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
    id: string;
    /**
     * 
     * @type {string}
     * @memberof Review
     */
    playerId: string;
    /**
     * 
     * @type {string}
     * @memberof Review
     */
    coachId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Review
     */
    title: string;
    /**
     * 
     * @type {string}
     * @memberof Review
     */
    recordingId: string;
    /**
     * 
     * @type {string}
     * @memberof Review
     */
    gameId: string;
    /**
     * 
     * @type {number}
     * @memberof Review
     */
    skillLevel: number;
    /**
     * 
     * @type {string}
     * @memberof Review
     */
    notes: string;
    /**
     * 
     * @type {ReviewState}
     * @memberof Review
     */
    state: ReviewState;
    /**
     * 
     * @type {string}
     * @memberof Review
     */
    stripeClientSecret?: string | null;
}
/**
 * 
 * @export
 * @enum {string}
 */
export enum ReviewState {
    AwaitingPayment = 'AwaitingPayment',
    AwaitingReview = 'AwaitingReview',
    Draft = 'Draft',
    Published = 'Published',
    Accepted = 'Accepted',
    Refunded = 'Refunded'
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
    name: string;
    /**
     * 
     * @type {number}
     * @memberof SkillLevel
     */
    value: number;
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
    body: string;
    /**
     * 
     * @type {string}
     * @memberof UpdateCommentRequest
     */
    drawing: string;
}
/**
 * @type User
 * 
 * @export
 */
export type User = UserOneOf | UserOneOf1;
/**
 * 
 * @export
 * @interface UserGame
 */
export interface UserGame {
    /**
     * 
     * @type {string}
     * @memberof UserGame
     */
    gameId: string;
    /**
     * 
     * @type {number}
     * @memberof UserGame
     */
    skillLevel: number;
}
/**
 * 
 * @export
 * @interface UserOneOf
 */
export interface UserOneOf {
    /**
     * 
     * @type {string}
     * @memberof UserOneOf
     */
    type: UserOneOfTypeEnum;
    /**
     * 
     * @type {string}
     * @memberof UserOneOf
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof UserOneOf
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof UserOneOf
     */
    email: string;
    /**
     * 
     * @type {string}
     * @memberof UserOneOf
     */
    bio: string;
    /**
     * 
     * @type {Array<UserGame>}
     * @memberof UserOneOf
     */
    games: Array<UserGame>;
    /**
     * 
     * @type {string}
     * @memberof UserOneOf
     */
    country: string;
    /**
     * 
     * @type {boolean}
     * @memberof UserOneOf
     */
    canReview: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof UserOneOf
     */
    stripeDetailsSubmitted: boolean;
}

/**
* @export
* @enum {string}
*/
export enum UserOneOfTypeEnum {
    Coach = 'Coach'
}
/**
 * 
 * @export
 * @interface UserOneOf1
 */
export interface UserOneOf1 {
    /**
     * 
     * @type {string}
     * @memberof UserOneOf1
     */
    type: UserOneOf1TypeEnum;
    /**
     * 
     * @type {string}
     * @memberof UserOneOf1
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof UserOneOf1
     */
    auth0Id: string;
    /**
     * 
     * @type {string}
     * @memberof UserOneOf1
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof UserOneOf1
     */
    email: string;
    /**
     * 
     * @type {Array<UserGame>}
     * @memberof UserOneOf1
     */
    games: Array<UserGame>;
}

/**
* @export
* @enum {string}
*/
export enum UserOneOf1TypeEnum {
    Player = 'Player'
}
