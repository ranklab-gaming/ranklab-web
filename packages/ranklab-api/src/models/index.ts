
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
    /**
     * 
     * @type {string}
     * @memberof Coach
     */
    userId: string;
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
     * @type {string}
     * @memberof Comment
     */
    userId: string;
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
    email: string;
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
    uploadUrl: string;
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
    title: string;
    /**
     * 
     * @type {string}
     * @memberof Review
     */
    userId: string;
    /**
     * 
     * @type {string}
     * @memberof Review
     */
    videoKey: string;
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
    auth0Id: string;
    /**
     * 
     * @type {string}
     * @memberof User
     */
    id: string;
}
