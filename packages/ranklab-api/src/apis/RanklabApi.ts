/* tslint:disable */
/* eslint-disable */
/**
 * ranklab-api
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import {
    AccountLink,
    Coach,
    Comment,
    CreateCoachRequest,
    CreateCommentRequest,
    CreatePlayerRequest,
    CreateRecordingRequest,
    CreateReviewRequest,
    Game,
    Player,
    Recording,
    Review,
    UpdateCommentRequest,
    User,
} from '../models';

export interface ClaimsCoachesCreateRequest {
    createCoachRequest: CreateCoachRequest;
}

export interface ClaimsPlayersCreateRequest {
    createPlayerRequest: CreatePlayerRequest;
}

export interface CoachCommentsCreateRequest {
    createCommentRequest: CreateCommentRequest;
}

export interface CoachCommentsListRequest {
    reviewId: string;
}

export interface CoachCommentsUpdateRequest {
    id: string;
    updateCommentRequest: UpdateCommentRequest;
}

export interface CoachRecordingsGetRequest {
    id: string;
}

export interface CoachReviewsGetRequest {
    id: string;
}

export interface CoachReviewsListRequest {
    pending?: boolean | null;
}

export interface PlayerCommentsListRequest {
    reviewId: string;
}

export interface PlayerRecordingsCreateRequest {
    createRecordingRequest: CreateRecordingRequest;
}

export interface PlayerRecordingsGetRequest {
    id: string;
}

export interface PlayerReviewsCreateRequest {
    createReviewRequest: CreateReviewRequest;
}

export interface PlayerReviewsGetRequest {
    id: string;
}

/**
 * 
 */
export class RanklabApi extends runtime.BaseAPI {

    /**
     */
    async claimsCoachesCreateRaw(requestParameters: ClaimsCoachesCreateRequest): Promise<runtime.ApiResponse<Coach>> {
        if (requestParameters.createCoachRequest === null || requestParameters.createCoachRequest === undefined) {
            throw new runtime.RequiredError('createCoachRequest','Required parameter requestParameters.createCoachRequest was null or undefined when calling claimsCoachesCreate.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/claims/coaches`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters.createCoachRequest,
        });

        return new runtime.JSONApiResponse(response);
    }

    /**
     */
    async claimsCoachesCreate(requestParameters: ClaimsCoachesCreateRequest): Promise<Coach> {
        const response = await this.claimsCoachesCreateRaw(requestParameters);
        return await response.value();
    }

    /**
     */
    async claimsPlayersCreateRaw(requestParameters: ClaimsPlayersCreateRequest): Promise<runtime.ApiResponse<Player>> {
        if (requestParameters.createPlayerRequest === null || requestParameters.createPlayerRequest === undefined) {
            throw new runtime.RequiredError('createPlayerRequest','Required parameter requestParameters.createPlayerRequest was null or undefined when calling claimsPlayersCreate.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/claims/players`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters.createPlayerRequest,
        });

        return new runtime.JSONApiResponse(response);
    }

    /**
     */
    async claimsPlayersCreate(requestParameters: ClaimsPlayersCreateRequest): Promise<Player> {
        const response = await this.claimsPlayersCreateRaw(requestParameters);
        return await response.value();
    }

    /**
     */
    async coachAccountLinksCreateRaw(): Promise<runtime.ApiResponse<AccountLink>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/coach/account-links`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response);
    }

    /**
     */
    async coachAccountLinksCreate(): Promise<AccountLink> {
        const response = await this.coachAccountLinksCreateRaw();
        return await response.value();
    }

    /**
     */
    async coachCommentsCreateRaw(requestParameters: CoachCommentsCreateRequest): Promise<runtime.ApiResponse<Comment>> {
        if (requestParameters.createCommentRequest === null || requestParameters.createCommentRequest === undefined) {
            throw new runtime.RequiredError('createCommentRequest','Required parameter requestParameters.createCommentRequest was null or undefined when calling coachCommentsCreate.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/coach/comments`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters.createCommentRequest,
        });

        return new runtime.JSONApiResponse(response);
    }

    /**
     */
    async coachCommentsCreate(requestParameters: CoachCommentsCreateRequest): Promise<Comment> {
        const response = await this.coachCommentsCreateRaw(requestParameters);
        return await response.value();
    }

    /**
     */
    async coachCommentsListRaw(requestParameters: CoachCommentsListRequest): Promise<runtime.ApiResponse<Array<Comment>>> {
        if (requestParameters.reviewId === null || requestParameters.reviewId === undefined) {
            throw new runtime.RequiredError('reviewId','Required parameter requestParameters.reviewId was null or undefined when calling coachCommentsList.');
        }

        const queryParameters: any = {};

        if (requestParameters.reviewId !== undefined) {
            queryParameters['review_id'] = requestParameters.reviewId;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/coach/comments`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response);
    }

    /**
     */
    async coachCommentsList(requestParameters: CoachCommentsListRequest): Promise<Array<Comment>> {
        const response = await this.coachCommentsListRaw(requestParameters);
        return await response.value();
    }

    /**
     */
    async coachCommentsUpdateRaw(requestParameters: CoachCommentsUpdateRequest): Promise<runtime.ApiResponse<Comment>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling coachCommentsUpdate.');
        }

        if (requestParameters.updateCommentRequest === null || requestParameters.updateCommentRequest === undefined) {
            throw new runtime.RequiredError('updateCommentRequest','Required parameter requestParameters.updateCommentRequest was null or undefined when calling coachCommentsUpdate.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/coach/comments/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters.updateCommentRequest,
        });

        return new runtime.JSONApiResponse(response);
    }

    /**
     */
    async coachCommentsUpdate(requestParameters: CoachCommentsUpdateRequest): Promise<Comment> {
        const response = await this.coachCommentsUpdateRaw(requestParameters);
        return await response.value();
    }

    /**
     */
    async coachRecordingsGetRaw(requestParameters: CoachRecordingsGetRequest): Promise<runtime.ApiResponse<Recording>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling coachRecordingsGet.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/coach/recordings/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response);
    }

    /**
     */
    async coachRecordingsGet(requestParameters: CoachRecordingsGetRequest): Promise<Recording> {
        const response = await this.coachRecordingsGetRaw(requestParameters);
        return await response.value();
    }

    /**
     */
    async coachReviewsGetRaw(requestParameters: CoachReviewsGetRequest): Promise<runtime.ApiResponse<Review>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling coachReviewsGet.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/coach/reviews/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response);
    }

    /**
     */
    async coachReviewsGet(requestParameters: CoachReviewsGetRequest): Promise<Review> {
        const response = await this.coachReviewsGetRaw(requestParameters);
        return await response.value();
    }

    /**
     */
    async coachReviewsListRaw(requestParameters: CoachReviewsListRequest): Promise<runtime.ApiResponse<Array<Review>>> {
        const queryParameters: any = {};

        if (requestParameters.pending !== undefined) {
            queryParameters['pending'] = requestParameters.pending;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/coach/reviews`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response);
    }

    /**
     */
    async coachReviewsList(requestParameters: CoachReviewsListRequest): Promise<Array<Review>> {
        const response = await this.coachReviewsListRaw(requestParameters);
        return await response.value();
    }

    /**
     */
    async playerCommentsListRaw(requestParameters: PlayerCommentsListRequest): Promise<runtime.ApiResponse<Array<Comment>>> {
        if (requestParameters.reviewId === null || requestParameters.reviewId === undefined) {
            throw new runtime.RequiredError('reviewId','Required parameter requestParameters.reviewId was null or undefined when calling playerCommentsList.');
        }

        const queryParameters: any = {};

        if (requestParameters.reviewId !== undefined) {
            queryParameters['review_id'] = requestParameters.reviewId;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/player/comments`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response);
    }

    /**
     */
    async playerCommentsList(requestParameters: PlayerCommentsListRequest): Promise<Array<Comment>> {
        const response = await this.playerCommentsListRaw(requestParameters);
        return await response.value();
    }

    /**
     */
    async playerRecordingsCreateRaw(requestParameters: PlayerRecordingsCreateRequest): Promise<runtime.ApiResponse<Recording>> {
        if (requestParameters.createRecordingRequest === null || requestParameters.createRecordingRequest === undefined) {
            throw new runtime.RequiredError('createRecordingRequest','Required parameter requestParameters.createRecordingRequest was null or undefined when calling playerRecordingsCreate.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/player/recordings`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters.createRecordingRequest,
        });

        return new runtime.JSONApiResponse(response);
    }

    /**
     */
    async playerRecordingsCreate(requestParameters: PlayerRecordingsCreateRequest): Promise<Recording> {
        const response = await this.playerRecordingsCreateRaw(requestParameters);
        return await response.value();
    }

    /**
     */
    async playerRecordingsGetRaw(requestParameters: PlayerRecordingsGetRequest): Promise<runtime.ApiResponse<Recording>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling playerRecordingsGet.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/player/recordings/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response);
    }

    /**
     */
    async playerRecordingsGet(requestParameters: PlayerRecordingsGetRequest): Promise<Recording> {
        const response = await this.playerRecordingsGetRaw(requestParameters);
        return await response.value();
    }

    /**
     */
    async playerReviewsCreateRaw(requestParameters: PlayerReviewsCreateRequest): Promise<runtime.ApiResponse<Review>> {
        if (requestParameters.createReviewRequest === null || requestParameters.createReviewRequest === undefined) {
            throw new runtime.RequiredError('createReviewRequest','Required parameter requestParameters.createReviewRequest was null or undefined when calling playerReviewsCreate.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/player/reviews`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters.createReviewRequest,
        });

        return new runtime.JSONApiResponse(response);
    }

    /**
     */
    async playerReviewsCreate(requestParameters: PlayerReviewsCreateRequest): Promise<Review> {
        const response = await this.playerReviewsCreateRaw(requestParameters);
        return await response.value();
    }

    /**
     */
    async playerReviewsGetRaw(requestParameters: PlayerReviewsGetRequest): Promise<runtime.ApiResponse<Review>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling playerReviewsGet.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/player/reviews/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response);
    }

    /**
     */
    async playerReviewsGet(requestParameters: PlayerReviewsGetRequest): Promise<Review> {
        const response = await this.playerReviewsGetRaw(requestParameters);
        return await response.value();
    }

    /**
     */
    async playerReviewsListRaw(): Promise<runtime.ApiResponse<Array<Review>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/player/reviews`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response);
    }

    /**
     */
    async playerReviewsList(): Promise<Array<Review>> {
        const response = await this.playerReviewsListRaw();
        return await response.value();
    }

    /**
     */
    async publicGamesListRaw(): Promise<runtime.ApiResponse<Array<Game>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/user/games`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response);
    }

    /**
     */
    async publicGamesList(): Promise<Array<Game>> {
        const response = await this.publicGamesListRaw();
        return await response.value();
    }

    /**
     */
    async userUsersGetMeRaw(): Promise<runtime.ApiResponse<User>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/user/users/me`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response);
    }

    /**
     */
    async userUsersGetMe(): Promise<User> {
        const response = await this.userUsersGetMeRaw();
        return await response.value();
    }

}
