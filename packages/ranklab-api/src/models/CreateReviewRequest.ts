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

import { exists, mapValues } from '../runtime';
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
    recordingId: string;
    /**
     * 
     * @type {string}
     * @memberof CreateReviewRequest
     */
    title: string;
}

export function CreateReviewRequestFromJSON(json: any): CreateReviewRequest {
    return CreateReviewRequestFromJSONTyped(json, false);
}

export function CreateReviewRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreateReviewRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'gameId': json['game_id'],
        'recordingId': json['recording_id'],
        'title': json['title'],
    };
}

export function CreateReviewRequestToJSON(value?: CreateReviewRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'game_id': value.gameId,
        'recording_id': value.recordingId,
        'title': value.title,
    };
}


