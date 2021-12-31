
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
    auth0Id: string;
    /**
     * 
     * @type {string}
     * @memberof Coach
     */
    bio: string;
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
    gameId: string;
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
    gameId: string;
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
     * @type {string}
     * @memberof Review
     */
    recordingId: string;
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
 * @interface UserOneOf
 */
export interface UserOneOf {
    /**
     * 
     * @type {string}
     * @memberof UserOneOf
     */
    auth0Id: string;
    /**
     * 
     * @type {string}
     * @memberof UserOneOf
     */
    bio: string;
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
    gameId: string;
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
    auth0Id: string;
    /**
     * 
     * @type {string}
     * @memberof UserOneOf1
     */
    email: string;
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
    Player = 'Player'
}
