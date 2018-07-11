import {EventEmitter, Injectable} from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';
import {ObliqueRequest, ObliqueResponse} from './oblique-http-interceptor';

// TODO: make sure that app.module.ts provides an instance of ObliqueHttpInterceptorConfig filled with data from environment[.prod].ts

/**
 * Configuration service for the Oblique HTTP interceptor.
 *
 * @link ObliqueHttpInterceptor
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the Oblique HTTP interceptor, if imported as `HTTP_INTERCEPTORS` provider.
 */
@Injectable()
export class ObliqueHttpInterceptorConfig {
	/**
	 * This event is emitted *before* the request is sent
	 * @type {EventEmitter<ObliqueRequest>}
	 */
	requested = new EventEmitter<ObliqueRequest>();
	/**
	 * This is the observable that are feed with the `requested` events
	 * @type {Observable<ObliqueRequest>}
	 */
	requestIntercepted: Observable<ObliqueRequest> = this.requested.asObservable();

	responded = new EventEmitter<ObliqueResponse>();
	responseIntercepted: Observable<ObliqueResponse> = this.responded.asObservable();

	/**
	 * Configuration for application API.
	 *
	 * @type {object}
	 */
	api = {

		/**
		 * Default application API URL for matching API calls.
		 *
		 * @type {string}
		 */
		url: null,

		/**
		 * Defines if spinner should be activated whenever an API request starts.
		 *
		 * @type {boolean}
		 */
		spinner: true
	};

	/**
	 * The timeout delay to wait before a request will be considered as failed.
	 * A notification will be issued to warn the user about request timeout.
	 *
	 * @type {number}
	 */
	timeout = 15000;
}
