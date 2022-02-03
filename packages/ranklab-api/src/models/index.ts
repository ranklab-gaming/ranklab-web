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
 * @interface CheckoutSession
 */
export interface CheckoutSession {
    /**
     * 
     * @type {string}
     * @memberof CheckoutSession
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
    bio: string;
    /**
     * 
     * @type {boolean}
     * @memberof Coach
     */
    canReview: boolean;
    /**
     * 
     * @type {string}
     * @memberof Coach
     */
    country: string;
    /**
     * 
     * @type {string}
     * @memberof Coach
     */
    email: string;
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
    id: string;
    /**
     * 
     * @type {string}
     * @memberof Coach
     */
    name: string;
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
    body: string;
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
    drawing: string;
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
     * @type {number}
     * @memberof Comment
     */
    videoTimestamp: number;
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
 * @interface CreateCheckoutSessionMutation
 */
export interface CreateCheckoutSessionMutation {
    /**
     * 
     * @type {string}
     * @memberof CreateCheckoutSessionMutation
     */
    cancelUrl: string;
    /**
     * 
     * @type {string}
     * @memberof CreateCheckoutSessionMutation
     */
    successUrl: string;
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
    bio: string;
    /**
     * 
     * @type {string}
     * @memberof CreateCoachRequest
     */
    country: string;
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
    name: string;
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
     * @type {string}
     * @memberof CreateCommentRequest
     */
    drawing: string;
    /**
     * 
     * @type {string}
     * @memberof CreateCommentRequest
     */
    reviewId: string;
    /**
     * 
     * @type {number}
     * @memberof CreateCommentRequest
     */
    videoTimestamp: number;
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
     * @type {Array<UserGame>}
     * @memberof CreatePlayerRequest
     */
    games: Array<UserGame>;
    /**
     * 
     * @type {string}
     * @memberof CreatePlayerRequest
     */
    name: string;
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
    mimeType: string;
    /**
     * 
     * @type {number}
     * @memberof CreateRecordingRequest
     */
    size: number;
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
    gameId: string;
    /**
     * 
     * @type {string}
     * @memberof CreateReviewRequest
     */
    notes: string;
    /**
     * 
     * @type {string}
     * @memberof CreateReviewRequest
     */
    recordingId: string;
    /**
     * 
     * @type {string}
     * @memberof CreateReviewRequest
     */
    title: string;
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
    id: string;
    /**
     * 
     * @type {SkillLevel}
     * @memberof Game
     */
    minCoachSkillLevel: SkillLevel;
    /**
     * 
     * @type {string}
     * @memberof Game
     */
    name: string;
    /**
     * 
     * @type {Array<SkillLevel>}
     * @memberof Game
     */
    skillLevels: Array<SkillLevel>;
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
 * @interface Player
 */
export interface Player {
    /**
     * 
     * @type {string}
     * @memberof Player
     */
    auth0Id: string;
    /**
     * 
     * @type {boolean}
     * @memberof Player
     */
    canCreateReviews: boolean;
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
    name: string;
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
    mimeType: string;
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
    videoKey: string;
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
    coachId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Review
     */
    gameId: string;
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
    notes: string;
    /**
     * 
     * @type {string}
     * @memberof Review
     */
    playerId: string;
    /**
     * 
     * @type {boolean}
     * @memberof Review
     */
    published: boolean;
    /**
     * 
     * @type {string}
     * @memberof Review
     */
    recordingId: string;
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
    title: string;
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
    bio: string;
    /**
     * 
     * @type {boolean}
     * @memberof UserOneOf
     */
    canReview: boolean;
    /**
     * 
     * @type {string}
     * @memberof UserOneOf
     */
    country: string;
    /**
     * 
     * @type {string}
     * @memberof UserOneOf
     */
    email: string;
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
    type: UserOneOfTypeEnum;
}

/**
* @export
* @enum {string}
*/
export enum UserOneOfTypeEnum {
    CoachView = 'CoachView'
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
    auth0Id: string;
    /**
     * 
     * @type {boolean}
     * @memberof UserOneOf1
     */
    canCreateReviews: boolean;
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
    name: string;
    /**
     * 
     * @type {string}
     * @memberof UserOneOf1
     */
    type: UserOneOf1TypeEnum;
}

/**
* @export
* @enum {string}
*/
export enum UserOneOf1TypeEnum {
    PlayerView = 'PlayerView'
}
