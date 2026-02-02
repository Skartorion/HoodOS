/* -*- mode: js2; js2-basic-offset: 4; indent-tabs-mode: nil -*- */

import * as applicationsSearchProvider from "./applicationsSearchProvider.js";

export const PROVIDERS = [applicationsSearchProvider];

/**
 * Set states for each provider to true to refresh
 *
 * @return {Void}
 */
export const refresh = () => {
    disable();
    PROVIDERS.forEach((provider) => {
        provider.setState(true);
    });
};

/**
 * Disable all search providers
 *
 * @type {Void}
 */
export const disable = () => {
    PROVIDERS.forEach((provider) => {
        provider.setState(false);
    });
};
