/* -*- mode: js2; js2-basic-offset: 4; indent-tabs-mode: nil -*- */

import * as providers from "./providers.js";

import { Extension } from "resource:///org/gnome/shell/extensions/extension.js";

export default class GnomeFuzzyAppSearch extends Extension {
    /**
     * Extension enable
     *
     * @return {Void}
     */
    enable() {
        providers.refresh();
    }

    /**
     * Extension disable
     *
     * @return {Void}
     */
    disable() {
        providers.disable();
    }
}
