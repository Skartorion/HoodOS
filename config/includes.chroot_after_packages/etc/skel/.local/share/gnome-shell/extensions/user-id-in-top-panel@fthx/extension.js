/*
    Add user id in top panel
    GNOME Shell 45+ extension
    (c) fthx 2025
    License: GPL v3
*/


import Clutter from 'gi://Clutter';
import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import St from 'gi://St';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as Util from 'resource:///org/gnome/shell/misc/util.js';


const UserIdMenu = GObject.registerClass(
class UserIdMenu extends PanelMenu.Button {
    _init() {
        super._init()

        this._box = new St.BoxLayout({style_class: 'panel-status-menu-box'});

        this._user_id = new St.Label({
            text: GLib.get_real_name() + " :: " + GLib.get_user_name() + "@" + GLib.get_host_name(),
            y_align: Clutter.ActorAlign.CENTER, style_class: "user-label"
        });

        this._box.add_child(this._user_id);
        this.add_child(this._box);

        this.connectObject('button-release-event',
            () => Util.trySpawnCommandLine('gnome-control-center system users'), this);
    }
});

export default class UserIdExtension {
    enable() {
        this._user_id_indicator = new UserIdMenu();
        Main.panel.addToStatusArea('user-id-menu', this._user_id_indicator);
    }

    disable() {
        this._user_id_indicator?.destroy();
        this._user_id_indicator = null;
    }
}
