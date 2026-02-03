/* -*- mode: js2; js2-basic-offset: 4; indent-tabs-mode: nil -*- */

import * as utils from "./applicationsUtils.js";
import metadata from "./metadata.js";

/**
 * Application search provider instance in registered providers
 *
 * @type {AppSearchProvider}
 */
let provider = utils.provider();

/**
 * Search instance: null on fuzzy search disabled, utils.Search on enabled
 *
 * @type {null | utils.Search}
 */
let search = null;

// getInitialResultSet method in AppSearchProvider
let getInitialResultSet, fuzzyGetInitialResultSet;
if (provider) {
    /**
     * Original getInitialResultSet method
     *
     * @type {Function}
     */
    getInitialResultSet = provider.__proto__.getInitialResultSet;

    // getInitialResultSet.length is the amount of parameters getInitialResultSet takes
    if (getInitialResultSet.length > 2) {
        // GNOME <43 uses a callback for reporting when results are available

        /**
         * New getInitialResultSet method:
         * return fuzzy results if indexed, otherwise default ones
         *
         * @param  {Array}           terms
         * @param  {Function}        callback
         * @param  {Gio.Cancellable} cancellable
         * @return {Void}
         */
        fuzzyGetInitialResultSet = (terms, callback, cancellable) => {
            if (search.isReady()) {
                search
                    .find(terms)
                    .then(callback)
                    .catch((error) => {
                        logError(
                            error,
                            `${metadata.uuid}: search failed due to error:`,
                        );

                        getInitialResultSet.call(
                            provider,
                            terms,
                            callback,
                            cancellable,
                        );
                    });
            } else
                getInitialResultSet.call(
                    provider,
                    terms,
                    callback,
                    cancellable,
                );
        };
    } else {
        // GNOME >=43 uses promises to report when results are available

        /**
         * New getInitialResultSet method:
         * return fuzzy results if indexed, otherwise default ones
         *
         * @param  {Array}           terms
         * @param  {Gio.Cancellable} cancellable
         *
         * @return {Promise<string[]>} A promise that resolves to an array of appInfo IDs
         */
        fuzzyGetInitialResultSet = (terms, cancellable) => {
            if (search.isReady()) {
                return search.find(terms).catch((error) => {
                    logError(
                        error,
                        `${metadata.uuid}: search failed due to error:`,
                    );

                    return getInitialResultSet.call(
                        provider,
                        terms,
                        cancellable,
                    );
                });
            } else
                return getInitialResultSet.call(provider, terms, cancellable);
        };
    }
}

/**
 * Provider description
 *
 * @return {String}
 */
export const description = () => {
    return "Applications";
};

/**
 * Can fuzzy search be added to
 * this provider
 *
 * @return {Boolean}
 */
export const enabled = () => {
    return true;
};

/**
 * Get search state
 * (is fuzzy search enabled)
 *
 * @return {Boolean}
 */
export const getState = () => {
    if (provider)
        return (
            provider.__proto__.getInitialResultSet === fuzzyGetInitialResultSet
        );

    return false;
};

/**
 * Set search state
 *
 * @param  {Boolean} state
 * @return {Void}
 */
export const setState = (state) => {
    if (!provider) return;

    if (state) {
        search = new utils.Search();
        provider.__proto__.getInitialResultSet = fuzzyGetInitialResultSet;
    } else {
        provider.__proto__.getInitialResultSet = getInitialResultSet;
        if (search) search.destroy();
        search = null;
    }
};
