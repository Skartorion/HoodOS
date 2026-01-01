import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import * as QuickSettings from 'resource:///org/gnome/shell/ui/quickSettings.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

const UpbToggle = GObject.registerClass(
class UpbToggle extends QuickSettings.QuickToggle {
    constructor() {
        super({
            title: 'Panic',
            iconName: 'dialog-warning-symbolic',
            toggleMode: true,
        });

        this._syncState();

        this.connect('toggled', () => {
            this._onToggled();
        });
    }

    _runUpb(args) {
        try {
            Gio.Subprocess.new(
                ['upb', args],
                Gio.SubprocessFlags.NONE
            );
        } catch (e) {
            logError(e, 'Failed to run upb');
        }
    }

    _syncState() {
        try {
            let proc = Gio.Subprocess.new(
                ['upb', 'status'],
                Gio.SubprocessFlags.STDOUT_PIPE
            );

            let stdout = proc.communicate_utf8(null, null)[1];
            this.checked = stdout.trim() === 'on';
        } catch (e) {
            logError(e, 'Failed to read upb status');
        }
    }

    _onToggled() {
        if (this.checked)
            this._runUpb('on');
        else
            this._runUpb('off');
    }
});

export default class Extension {
    enable() {
        this._toggle = new UpbToggle();
        this._indicator = new QuickSettings.SystemIndicator();
        this._indicator.quickSettingsItems.push(this._toggle);
        Main.panel.statusArea.quickSettings.addExternalIndicator(this._indicator);
    }

    disable() {
        this._indicator.destroy();
        this._toggle.destroy();
    }
}
