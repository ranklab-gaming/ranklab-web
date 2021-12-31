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
    Coach,
    Comment,
    CreateCoachRequest,
    CreateCommentRequest,
    CreateRecordingRequest,
    CreateReviewRequest,
    Game,
    Recording,
    Review,
    UpdateCommentRequest,
    User,
} from '../models';

export interface CoachesCreateRequest {
    createCoachRequest: CreateCoachRequest;
}

export interface CommentsCreateRequest {
    createCommentRequest: CreateCommentRequest;
}

export interface CommentsListRequest {
    reviewId: string;
}

export interface CommentsUpdateRequest {
    id: string;
    updateCommentRequest: UpdateCommentRequest;
}

export interface RecordingsCreateRequest {
    createRecordingRequest: CreateRecordingRequest;
}

export interface RecordingsGetRequest {
    id: string;
}

export interface ReviewsCreateRequest {
    createReviewRequest: CreateReviewRequest;
}

export interface ReviewsGetRequest {
    id: string;
}

/**
 * 
 */
export class RanklabApi extends runtime.BaseAPI {

    /**
     */
    async coachesCreateRaw(requestParameters: CoachesCreateRequest): Promise<runtime.ApiResponse<Coach>> {
        if (requestParameters.createCoachRequest === null || requestParameters.createCoachRequest === undefined) {
            throw new runtime.RequiredError('createCoachRequest','Required parameter requestParameters.createCoachRequest was null or undefined when calling coachesCreate.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/coaches`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters.createCoachRequest,
        });

        return new runtime.JSONApiResponse(response);
    }

    /**
     */
    async coachesCreate(requestParameters: CoachesCreateRequest): Promise<Coach> {
        const response = await this.coachesCreateRaw(requestParameters);
        return await response.value();
    }

    /**
     */
    async commentsCreateRaw(requestParameters: CommentsCreateRequest): Promise<runtime.ApiResponse<Comment>> {
        if (requestParameters.createCommentRequest === null || requestParameters.createCommentRequest === undefined) {
            throw new runtime.RequiredError('createCommentRequest','Required parameter requestParameters.createCommentRequest was null or undefined when calling commentsCreate.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/comments`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters.createCommentRequest,
        });

        return new runtime.JSONApiResponse(response);
    }

    /**
     */
    async commentsCreate(requestParameters: CommentsCreateRequest): Promise<Comment> {
        const response = await this.commentsCreateRaw(requestParameters);
        return await response.value();
    }

    /**
     */
    async commentsListRaw(requestParameters: CommentsListRequest): Promise<runtime.ApiResponse<Array<Comment>>> {
        if (requestParameters.reviewId === null || requestParameters.reviewId === undefined) {
            throw new runtime.RequiredError('reviewId','Required parameter requestParameters.reviewId was null or undefined when calling commentsList.');
        }

        const queryParameters: any = {};

        if (requestParameters.reviewId !== undefined) {
            queryParameters['review_id'] = requestParameters.reviewId;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/comments`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response);
    }

    /**
     */
    async commentsList(requestParameters: CommentsListRequest): Promise<Array<Comment>> {
        const response = await this.commentsListRaw(requestParameters);
        return await response.value();
    }

    /**
     */
    async commentsUpdateRaw(requestParameters: CommentsUpdateRequest): Promise<runtime.ApiResponse<Comment>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling commentsUpdate.');
        }

        if (requestParameters.updateCommentRequest === null || requestParameters.updateCommentRequest === undefined) {
            throw new runtime.RequiredError('updateCommentRequest','Required parameter requestParameters.updateCommentRequest was null or undefined when calling commentsUpdate.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/comments/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters.updateCommentRequest,
        });

        return new runtime.JSONApiResponse(response);
    }

    /**
     */
    async commentsUpdate(requestParameters: CommentsUpdateRequest): Promise<Comment> {
        const response = await this.commentsUpdateRaw(requestParameters);
        return await response.value();
    }

    /**
     */
    async gamesListRaw(): Promise<runtime.ApiResponse<Array<Game>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/games`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response);
    }

    /**
     */
    async gamesList(): Promise<Array<Game>> {
        const response = await this.gamesListRaw();
        return await response.value();
    }

    /**
     */
    async recordingsCreateRaw(requestParameters: RecordingsCreateRequest): Promise<runtime.ApiResponse<Recording>> {
        if (requestParameters.createRecordingRequest === null || requestParameters.createRecordingRequest === undefined) {
            throw new runtime.RequiredError('createRecordingRequest','Required parameter requestParameters.createRecordingRequest was null or undefined when calling recordingsCreate.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/recordings`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters.createRecordingRequest,
        });

        return new runtime.JSONApiResponse(response);
    }

    /**
     */
    async recordingsCreate(requestParameters: RecordingsCreateRequest): Promise<Recording> {
        const response = await this.recordingsCreateRaw(requestParameters);
        return await response.value();
    }

    /**
     */
    async recordingsGetRaw(requestParameters: RecordingsGetRequest): Promise<runtime.ApiResponse<Recording>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling recordingsGet.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/recordings/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response);
    }

    /**
     */
    async recordingsGet(requestParameters: RecordingsGetRequest): Promise<Recording> {
        const response = await this.recordingsGetRaw(requestParameters);
        return await response.value();
    }

    /**
     */
    async reviewsCreateRaw(requestParameters: ReviewsCreateRequest): Promise<runtime.ApiResponse<Review>> {
        if (requestParameters.createReviewRequest === null || requestParameters.createReviewRequest === undefined) {
            throw new runtime.RequiredError('createReviewRequest','Required parameter requestParameters.createReviewRequest was null or undefined when calling reviewsCreate.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/reviews`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters.createReviewRequest,
        });

        return new runtime.JSONApiResponse(response);
    }

    /**
     */
    async reviewsCreate(requestParameters: ReviewsCreateRequest): Promise<Review> {
        const response = await this.reviewsCreateRaw(requestParameters);
        return await response.value();
    }

    /**
     */
    async reviewsGetRaw(requestParameters: ReviewsGetRequest): Promise<runtime.ApiResponse<Review>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling reviewsGet.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/reviews/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response);
    }

    /**
     */
    async reviewsGet(requestParameters: ReviewsGetRequest): Promise<Review> {
        const response = await this.reviewsGetRaw(requestParameters);
        return await response.value();
    }

    /**
     */
    async reviewsListRaw(): Promise<runtime.ApiResponse<Array<Review>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/reviews`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response);
    }

    /**
     */
    async reviewsList(): Promise<Array<Review>> {
        const response = await this.reviewsListRaw();
        return await response.value();
    }

    /**
     */
    async usersGetMeRaw(): Promise<runtime.ApiResponse<User>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/me`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response);
    }

    /**
     */
    async usersGetMe(): Promise<User> {
        const response = await this.usersGetMeRaw();
        return await response.value();
    }

}
