/// <reference path="./custom.d.ts" />
// tslint:disable
/**
 * ranklab-api
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 0.1.0
 * 
 *
 * NOTE: This file is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the file manually.
 */

import * as url from "url";
import * as isomorphicFetch from "isomorphic-fetch";
import { Configuration } from "./configuration";

const BASE_PATH = "/".replace(/\/+$/, "");

/**
 *
 * @export
 */
export const COLLECTION_FORMATS = {
    csv: ",",
    ssv: " ",
    tsv: "\t",
    pipes: "|",
};

/**
 *
 * @export
 * @interface FetchAPI
 */
export interface FetchAPI {
    (url: string, init?: any): Promise<Response>;
}

/**
 *
 * @export
 * @interface FetchArgs
 */
export interface FetchArgs {
    url: string;
    options: any;
}

/**
 *
 * @export
 * @class BaseAPI
 */
export class BaseAPI {
    protected configuration: Configuration;

    constructor(configuration?: Configuration, protected basePath: string = BASE_PATH, protected fetch: FetchAPI = isomorphicFetch) {
        if (configuration) {
            this.configuration = configuration;
            this.basePath = configuration.basePath || this.basePath;
        }
    }
};

/**
 *
 * @export
 * @class RequiredError
 * @extends {Error}
 */
export class RequiredError extends Error {
    name: "RequiredError"
    constructor(public field: string, msg?: string) {
        super(msg);
    }
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
     * @type {string}
     * @memberof Coach
     */
    email: string;
    /**
     * 
     * @type {string}
     * @memberof Coach
     */
    game: string;
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
     * @type {Game}
     * @memberof CreateCoachRequest
     */
    game: Game;
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
     * @type {Game}
     * @memberof CreateReviewRequest
     */
    game: Game;
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
 * @interface CreateUserRequest
 */
export interface CreateUserRequest {
    /**
     * 
     * @type {string}
     * @memberof CreateUserRequest
     */
    auth0Id: string;
}
/**
 * 
 * @export
 * @enum {string}
 */
export enum Game {
    Overwatch = <any> 'overwatch',
    Chess = <any> 'chess'
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
    coachId?: string;
    /**
     * 
     * @type {string}
     * @memberof Review
     */
    game: string;
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
    videoUrl: string;
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
/**
 * DefaultApi - fetch parameter creator
 * @export
 */
export const DefaultApiFetchParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @param {CreateCoachRequest} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        coachesCreate(body: CreateCoachRequest, options: any = {}): FetchArgs {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body','Required parameter body was null or undefined when calling coachesCreate.');
            }
            const localVarPath = `/coaches`;
            const localVarUrlObj = url.parse(localVarPath, true);
            const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            localVarHeaderParameter['Content-Type'] = 'application/json';

            localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            delete localVarUrlObj.search;
            localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
            const needsSerialization = (<any>"CreateCoachRequest" !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.body =  needsSerialization ? JSON.stringify(body || {}) : (body || "");

            return {
                url: url.format(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {CreateCommentRequest} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        commentsCreate(body: CreateCommentRequest, options: any = {}): FetchArgs {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body','Required parameter body was null or undefined when calling commentsCreate.');
            }
            const localVarPath = `/comments`;
            const localVarUrlObj = url.parse(localVarPath, true);
            const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            localVarHeaderParameter['Content-Type'] = 'application/json';

            localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            delete localVarUrlObj.search;
            localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
            const needsSerialization = (<any>"CreateCommentRequest" !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.body =  needsSerialization ? JSON.stringify(body || {}) : (body || "");

            return {
                url: url.format(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getHealth(options: any = {}): FetchArgs {
            const localVarPath = `/`;
            const localVarUrlObj = url.parse(localVarPath, true);
            const localVarRequestOptions = Object.assign({ method: 'GET' }, options);
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            delete localVarUrlObj.search;
            localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

            return {
                url: url.format(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        recordingsCreate(options: any = {}): FetchArgs {
            const localVarPath = `/recordings`;
            const localVarUrlObj = url.parse(localVarPath, true);
            const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            delete localVarUrlObj.search;
            localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

            return {
                url: url.format(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {CreateReviewRequest} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        reviewsCreate(body: CreateReviewRequest, options: any = {}): FetchArgs {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body','Required parameter body was null or undefined when calling reviewsCreate.');
            }
            const localVarPath = `/reviews`;
            const localVarUrlObj = url.parse(localVarPath, true);
            const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            localVarHeaderParameter['Content-Type'] = 'application/json';

            localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            delete localVarUrlObj.search;
            localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
            const needsSerialization = (<any>"CreateReviewRequest" !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.body =  needsSerialization ? JSON.stringify(body || {}) : (body || "");

            return {
                url: url.format(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {string} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        reviewsGet(id: string, options: any = {}): FetchArgs {
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id','Required parameter id was null or undefined when calling reviewsGet.');
            }
            const localVarPath = `/reviews/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            const localVarUrlObj = url.parse(localVarPath, true);
            const localVarRequestOptions = Object.assign({ method: 'GET' }, options);
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            delete localVarUrlObj.search;
            localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

            return {
                url: url.format(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        reviewsList(options: any = {}): FetchArgs {
            const localVarPath = `/reviews`;
            const localVarUrlObj = url.parse(localVarPath, true);
            const localVarRequestOptions = Object.assign({ method: 'GET' }, options);
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            delete localVarUrlObj.search;
            localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

            return {
                url: url.format(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {CreateUserRequest} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        usersCreate(body: CreateUserRequest, options: any = {}): FetchArgs {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body','Required parameter body was null or undefined when calling usersCreate.');
            }
            const localVarPath = `/users`;
            const localVarUrlObj = url.parse(localVarPath, true);
            const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            localVarHeaderParameter['Content-Type'] = 'application/json';

            localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            delete localVarUrlObj.search;
            localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
            const needsSerialization = (<any>"CreateUserRequest" !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.body =  needsSerialization ? JSON.stringify(body || {}) : (body || "");

            return {
                url: url.format(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        usersGetCurrent(options: any = {}): FetchArgs {
            const localVarPath = `/users/current`;
            const localVarUrlObj = url.parse(localVarPath, true);
            const localVarRequestOptions = Object.assign({ method: 'GET' }, options);
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            delete localVarUrlObj.search;
            localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

            return {
                url: url.format(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * DefaultApi - functional programming interface
 * @export
 */
export const DefaultApiFp = function(configuration?: Configuration) {
    return {
        /**
         * 
         * @param {CreateCoachRequest} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        coachesCreate(body: CreateCoachRequest, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Coach> {
            const localVarFetchArgs = DefaultApiFetchParamCreator(configuration).coachesCreate(body, options);
            return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
                return fetch(basePath + localVarFetchArgs.url, localVarFetchArgs.options).then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response.json();
                    } else {
                        throw response;
                    }
                });
            };
        },
        /**
         * 
         * @param {CreateCommentRequest} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        commentsCreate(body: CreateCommentRequest, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Comment> {
            const localVarFetchArgs = DefaultApiFetchParamCreator(configuration).commentsCreate(body, options);
            return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
                return fetch(basePath + localVarFetchArgs.url, localVarFetchArgs.options).then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response.json();
                    } else {
                        throw response;
                    }
                });
            };
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getHealth(options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Health> {
            const localVarFetchArgs = DefaultApiFetchParamCreator(configuration).getHealth(options);
            return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
                return fetch(basePath + localVarFetchArgs.url, localVarFetchArgs.options).then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response.json();
                    } else {
                        throw response;
                    }
                });
            };
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        recordingsCreate(options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Recording> {
            const localVarFetchArgs = DefaultApiFetchParamCreator(configuration).recordingsCreate(options);
            return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
                return fetch(basePath + localVarFetchArgs.url, localVarFetchArgs.options).then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response.json();
                    } else {
                        throw response;
                    }
                });
            };
        },
        /**
         * 
         * @param {CreateReviewRequest} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        reviewsCreate(body: CreateReviewRequest, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Review> {
            const localVarFetchArgs = DefaultApiFetchParamCreator(configuration).reviewsCreate(body, options);
            return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
                return fetch(basePath + localVarFetchArgs.url, localVarFetchArgs.options).then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response.json();
                    } else {
                        throw response;
                    }
                });
            };
        },
        /**
         * 
         * @param {string} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        reviewsGet(id: string, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Review> {
            const localVarFetchArgs = DefaultApiFetchParamCreator(configuration).reviewsGet(id, options);
            return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
                return fetch(basePath + localVarFetchArgs.url, localVarFetchArgs.options).then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response.json();
                    } else {
                        throw response;
                    }
                });
            };
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        reviewsList(options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Array<Review>> {
            const localVarFetchArgs = DefaultApiFetchParamCreator(configuration).reviewsList(options);
            return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
                return fetch(basePath + localVarFetchArgs.url, localVarFetchArgs.options).then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response.json();
                    } else {
                        throw response;
                    }
                });
            };
        },
        /**
         * 
         * @param {CreateUserRequest} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        usersCreate(body: CreateUserRequest, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<User> {
            const localVarFetchArgs = DefaultApiFetchParamCreator(configuration).usersCreate(body, options);
            return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
                return fetch(basePath + localVarFetchArgs.url, localVarFetchArgs.options).then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response.json();
                    } else {
                        throw response;
                    }
                });
            };
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        usersGetCurrent(options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<User> {
            const localVarFetchArgs = DefaultApiFetchParamCreator(configuration).usersGetCurrent(options);
            return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
                return fetch(basePath + localVarFetchArgs.url, localVarFetchArgs.options).then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response.json();
                    } else {
                        throw response;
                    }
                });
            };
        },
    }
};

/**
 * DefaultApi - factory interface
 * @export
 */
export const DefaultApiFactory = function (configuration?: Configuration, fetch?: FetchAPI, basePath?: string) {
    return {
        /**
         * 
         * @param {CreateCoachRequest} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        coachesCreate(body: CreateCoachRequest, options?: any) {
            return DefaultApiFp(configuration).coachesCreate(body, options)(fetch, basePath);
        },
        /**
         * 
         * @param {CreateCommentRequest} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        commentsCreate(body: CreateCommentRequest, options?: any) {
            return DefaultApiFp(configuration).commentsCreate(body, options)(fetch, basePath);
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getHealth(options?: any) {
            return DefaultApiFp(configuration).getHealth(options)(fetch, basePath);
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        recordingsCreate(options?: any) {
            return DefaultApiFp(configuration).recordingsCreate(options)(fetch, basePath);
        },
        /**
         * 
         * @param {CreateReviewRequest} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        reviewsCreate(body: CreateReviewRequest, options?: any) {
            return DefaultApiFp(configuration).reviewsCreate(body, options)(fetch, basePath);
        },
        /**
         * 
         * @param {string} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        reviewsGet(id: string, options?: any) {
            return DefaultApiFp(configuration).reviewsGet(id, options)(fetch, basePath);
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        reviewsList(options?: any) {
            return DefaultApiFp(configuration).reviewsList(options)(fetch, basePath);
        },
        /**
         * 
         * @param {CreateUserRequest} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        usersCreate(body: CreateUserRequest, options?: any) {
            return DefaultApiFp(configuration).usersCreate(body, options)(fetch, basePath);
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        usersGetCurrent(options?: any) {
            return DefaultApiFp(configuration).usersGetCurrent(options)(fetch, basePath);
        },
    };
};

/**
 * DefaultApi - object-oriented interface
 * @export
 * @class DefaultApi
 * @extends {BaseAPI}
 */
export class DefaultApi extends BaseAPI {
    /**
     * 
     * @param {CreateCoachRequest} body 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public coachesCreate(body: CreateCoachRequest, options?: any) {
        return DefaultApiFp(this.configuration).coachesCreate(body, options)(this.fetch, this.basePath);
    }

    /**
     * 
     * @param {CreateCommentRequest} body 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public commentsCreate(body: CreateCommentRequest, options?: any) {
        return DefaultApiFp(this.configuration).commentsCreate(body, options)(this.fetch, this.basePath);
    }

    /**
     * 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public getHealth(options?: any) {
        return DefaultApiFp(this.configuration).getHealth(options)(this.fetch, this.basePath);
    }

    /**
     * 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public recordingsCreate(options?: any) {
        return DefaultApiFp(this.configuration).recordingsCreate(options)(this.fetch, this.basePath);
    }

    /**
     * 
     * @param {CreateReviewRequest} body 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public reviewsCreate(body: CreateReviewRequest, options?: any) {
        return DefaultApiFp(this.configuration).reviewsCreate(body, options)(this.fetch, this.basePath);
    }

    /**
     * 
     * @param {string} id 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public reviewsGet(id: string, options?: any) {
        return DefaultApiFp(this.configuration).reviewsGet(id, options)(this.fetch, this.basePath);
    }

    /**
     * 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public reviewsList(options?: any) {
        return DefaultApiFp(this.configuration).reviewsList(options)(this.fetch, this.basePath);
    }

    /**
     * 
     * @param {CreateUserRequest} body 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public usersCreate(body: CreateUserRequest, options?: any) {
        return DefaultApiFp(this.configuration).usersCreate(body, options)(this.fetch, this.basePath);
    }

    /**
     * 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public usersGetCurrent(options?: any) {
        return DefaultApiFp(this.configuration).usersGetCurrent(options)(this.fetch, this.basePath);
    }

}
