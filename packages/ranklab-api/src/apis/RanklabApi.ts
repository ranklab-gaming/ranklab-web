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
    LoginLink,
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

export interface CoachStripeAccountLinksCreateRequest {
    refreshUrl: string;
    returnUrl: string;
}

export interface CoachStripeLoginLinksCreateRequest {
    returnUrl: string;
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
    async claimsCoachesAvailableCountriesRaw(initOverrides?: RequestInit): Promise<runtime.ApiResponse<Array<string>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/claims/coaches/available_countries`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse<any>(response);
    }

    /**
     */
    async claimsCoachesAvailableCountries(initOverrides?: RequestInit): Promise<Array<string>> {
        const response = await this.claimsCoachesAvailableCountriesRaw(initOverrides);
        return await response.value();
    }

    /**
     */
    async claimsCoachesCreateRaw(requestParameters: ClaimsCoachesCreateRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<Coach>> {
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
        }, initOverrides);

        return new runtime.JSONApiResponse(response);
    }

    /**
     */
    async claimsCoachesCreate(requestParameters: ClaimsCoachesCreateRequest, initOverrides?: RequestInit): Promise<Coach> {
        const response = await this.claimsCoachesCreateRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async claimsPlayersCreateRaw(requestParameters: ClaimsPlayersCreateRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<Player>> {
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
        }, initOverrides);

        return new runtime.JSONApiResponse(response);
    }

    /**
     */
    async claimsPlayersCreate(requestParameters: ClaimsPlayersCreateRequest, initOverrides?: RequestInit): Promise<Player> {
        const response = await this.claimsPlayersCreateRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async coachCommentsCreateRaw(requestParameters: CoachCommentsCreateRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<Comment>> {
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
        }, initOverrides);

        return new runtime.JSONApiResponse(response);
    }

    /**
     */
    async coachCommentsCreate(requestParameters: CoachCommentsCreateRequest, initOverrides?: RequestInit): Promise<Comment> {
        const response = await this.coachCommentsCreateRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async coachCommentsListRaw(requestParameters: CoachCommentsListRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<Array<Comment>>> {
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
        }, initOverrides);

        return new runtime.JSONApiResponse(response);
    }

    /**
     */
    async coachCommentsList(requestParameters: CoachCommentsListRequest, initOverrides?: RequestInit): Promise<Array<Comment>> {
        const response = await this.coachCommentsListRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async coachCommentsUpdateRaw(requestParameters: CoachCommentsUpdateRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<Comment>> {
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
        }, initOverrides);

        return new runtime.JSONApiResponse(response);
    }

    /**
     */
    async coachCommentsUpdate(requestParameters: CoachCommentsUpdateRequest, initOverrides?: RequestInit): Promise<Comment> {
        const response = await this.coachCommentsUpdateRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async coachRecordingsGetRaw(requestParameters: CoachRecordingsGetRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<Recording>> {
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
        }, initOverrides);

        return new runtime.JSONApiResponse(response);
    }

    /**
     */
    async coachRecordingsGet(requestParameters: CoachRecordingsGetRequest, initOverrides?: RequestInit): Promise<Recording> {
        const response = await this.coachRecordingsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async coachReviewsGetRaw(requestParameters: CoachReviewsGetRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<Review>> {
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
        }, initOverrides);

        return new runtime.JSONApiResponse(response);
    }

    /**
     */
    async coachReviewsGet(requestParameters: CoachReviewsGetRequest, initOverrides?: RequestInit): Promise<Review> {
        const response = await this.coachReviewsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async coachReviewsListRaw(requestParameters: CoachReviewsListRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<Array<Review>>> {
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
        }, initOverrides);

        return new runtime.JSONApiResponse(response);
    }

    /**
     */
    async coachReviewsList(requestParameters: CoachReviewsListRequest, initOverrides?: RequestInit): Promise<Array<Review>> {
        const response = await this.coachReviewsListRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async coachStripeAccountLinksCreateRaw(requestParameters: CoachStripeAccountLinksCreateRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<AccountLink>> {
        if (requestParameters.refreshUrl === null || requestParameters.refreshUrl === undefined) {
            throw new runtime.RequiredError('refreshUrl','Required parameter requestParameters.refreshUrl was null or undefined when calling coachStripeAccountLinksCreate.');
        }

        if (requestParameters.returnUrl === null || requestParameters.returnUrl === undefined) {
            throw new runtime.RequiredError('returnUrl','Required parameter requestParameters.returnUrl was null or undefined when calling coachStripeAccountLinksCreate.');
        }

        const queryParameters: any = {};

        if (requestParameters.refreshUrl !== undefined) {
            queryParameters['refresh_url'] = requestParameters.refreshUrl;
        }

        if (requestParameters.returnUrl !== undefined) {
            queryParameters['return_url'] = requestParameters.returnUrl;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/coach/account-links`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response);
    }

    /**
     */
    async coachStripeAccountLinksCreate(requestParameters: CoachStripeAccountLinksCreateRequest, initOverrides?: RequestInit): Promise<AccountLink> {
        const response = await this.coachStripeAccountLinksCreateRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async coachStripeLoginLinksCreateRaw(requestParameters: CoachStripeLoginLinksCreateRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<LoginLink>> {
        if (requestParameters.returnUrl === null || requestParameters.returnUrl === undefined) {
            throw new runtime.RequiredError('returnUrl','Required parameter requestParameters.returnUrl was null or undefined when calling coachStripeLoginLinksCreate.');
        }

        const queryParameters: any = {};

        if (requestParameters.returnUrl !== undefined) {
            queryParameters['return_url'] = requestParameters.returnUrl;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/coach/login-links`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response);
    }

    /**
     */
    async coachStripeLoginLinksCreate(requestParameters: CoachStripeLoginLinksCreateRequest, initOverrides?: RequestInit): Promise<LoginLink> {
        const response = await this.coachStripeLoginLinksCreateRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async playerCommentsListRaw(requestParameters: PlayerCommentsListRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<Array<Comment>>> {
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
        }, initOverrides);

        return new runtime.JSONApiResponse(response);
    }

    /**
     */
    async playerCommentsList(requestParameters: PlayerCommentsListRequest, initOverrides?: RequestInit): Promise<Array<Comment>> {
        const response = await this.playerCommentsListRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async playerRecordingsCreateRaw(requestParameters: PlayerRecordingsCreateRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<Recording>> {
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
        }, initOverrides);

        return new runtime.JSONApiResponse(response);
    }

    /**
     */
    async playerRecordingsCreate(requestParameters: PlayerRecordingsCreateRequest, initOverrides?: RequestInit): Promise<Recording> {
        const response = await this.playerRecordingsCreateRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async playerRecordingsGetRaw(requestParameters: PlayerRecordingsGetRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<Recording>> {
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
        }, initOverrides);

        return new runtime.JSONApiResponse(response);
    }

    /**
     */
    async playerRecordingsGet(requestParameters: PlayerRecordingsGetRequest, initOverrides?: RequestInit): Promise<Recording> {
        const response = await this.playerRecordingsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async playerReviewsCreateRaw(requestParameters: PlayerReviewsCreateRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<Review>> {
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
        }, initOverrides);

        return new runtime.JSONApiResponse(response);
    }

    /**
     */
    async playerReviewsCreate(requestParameters: PlayerReviewsCreateRequest, initOverrides?: RequestInit): Promise<Review> {
        const response = await this.playerReviewsCreateRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async playerReviewsGetRaw(requestParameters: PlayerReviewsGetRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<Review>> {
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
        }, initOverrides);

        return new runtime.JSONApiResponse(response);
    }

    /**
     */
    async playerReviewsGet(requestParameters: PlayerReviewsGetRequest, initOverrides?: RequestInit): Promise<Review> {
        const response = await this.playerReviewsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async playerReviewsListRaw(initOverrides?: RequestInit): Promise<runtime.ApiResponse<Array<Review>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/player/reviews`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response);
    }

    /**
     */
    async playerReviewsList(initOverrides?: RequestInit): Promise<Array<Review>> {
        const response = await this.playerReviewsListRaw(initOverrides);
        return await response.value();
    }

    /**
     */
    async publicGamesListRaw(initOverrides?: RequestInit): Promise<runtime.ApiResponse<Array<Game>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/user/games`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response);
    }

    /**
     */
    async publicGamesList(initOverrides?: RequestInit): Promise<Array<Game>> {
        const response = await this.publicGamesListRaw(initOverrides);
        return await response.value();
    }

    /**
     */
    async userUsersGetMeRaw(initOverrides?: RequestInit): Promise<runtime.ApiResponse<User>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/user/users/me`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response);
    }

    /**
     */
    async userUsersGetMe(initOverrides?: RequestInit): Promise<User> {
        const response = await this.userUsersGetMeRaw(initOverrides);
        return await response.value();
    }

}
