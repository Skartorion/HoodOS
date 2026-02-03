import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import St from 'gi://St';
import GObject from 'gi://GObject';
import Soup from 'gi://Soup';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

const IMAGE_BASE_URL = 'https://raw.githubusercontent.com/mdoksa76/sketch_scandal_ai/main/';
const JSON_URL = IMAGE_BASE_URL + 'caricatures.json';

// Localized messages
const MESSAGES = {
    loading: "Loading...",
    noData: "No caricature for this date",
    imageError: "Cannot load image",
    contentError: "Content display error",
    httpError: "Network error",
    today: "Today",
    oldest: "Oldest",
    newest: "Newest",
    refresh: "Refresh"
};

// ---------- SketchScandalIndicator ----------
const SketchScandalIndicator = GObject.registerClass(
class SketchScandalIndicator extends PanelMenu.Button {
    _init() {
        super._init(0.0, 'Sketch Scandal');

        this._icon = new St.Icon({
            icon_name: 'image-x-generic-symbolic',
            style_class: 'system-status-icon'
        });
        this.add_child(this._icon);

        this._currentDate = null;
        this._imageData = null;
        this._loading = false;

        this.connect('button-press-event', () => this._loadData());
    }

    _formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    _loadData() {
        if (this._loading) return;
        this._loading = true;

        this.menu.removeAll();
        this.menu.addMenuItem(new PopupMenu.PopupMenuItem(MESSAGES.loading));

        this._loadJsonData()
            .then(imageData => {
                this._imageData = imageData;
                // Pametno postavi početni datum
                this._currentDate = this._findValidStartDate();
                this._updateDisplay();
            })
            .catch(e => {
                console.error('Error loading JSON:', e);
                this._showError(MESSAGES.httpError + ': ' + e.message);
            })
            .finally(() => {
                this._loading = false;
            });
    }

    _findValidStartDate() {
        // Pokušaj naći najbliži validan datum
        const today = this._formatDate(new Date());
        
        // Ako današnji datum postoji, koristi ga
        if (this._imageData[today]) {
            return today;
        }
        
        // Inače, nađi najnoviji dostupan datum
        const availableDates = Object.keys(this._imageData).sort();
        if (availableDates.length === 0) {
            return today; // Fallback, pokazat će "no data"
        }
        
        // Vrati najnoviji datum koji nije u budućnosti
        for (let i = availableDates.length - 1; i >= 0; i--) {
            if (availableDates[i] <= today) {
                return availableDates[i];
            }
        }
        
        // Ako su svi datumi u budućnosti (neobično), vrati najstariji
        return availableDates[0];
    }

    _loadJsonData() {
        return new Promise((resolve, reject) => {
            const session = new Soup.Session();
            const message = Soup.Message.new('GET', JSON_URL);

            session.send_and_read_async(message, GLib.PRIORITY_DEFAULT, null, (session, res) => {
                try {
                    if (message.status_code !== 200) {
                        return reject(new Error('HTTP ' + message.status_code));
                    }
                    const bytes = session.send_and_read_finish(res);
                    const decoder = new TextDecoder('utf-8');
                    const data = JSON.parse(decoder.decode(bytes.get_data()));

                    const dataMap = {};
                    data.forEach(item => {
                        dataMap[item.date] = {
                            title: item.title,
                            description: item.description
                        };
                    });

                    resolve(dataMap);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }

    _updateDisplay() {
        try {
            const data = this._imageData ? this._imageData[this._currentDate] : null;
            this.menu.removeAll();

            if (!data) {
                this._showMessage(MESSAGES.noData);
                return;
            }

            const titleItem = new PopupMenu.PopupMenuItem(data.title);
            titleItem.label.style = 'font-weight: bold; font-size: 1.1em;';
            this.menu.addMenuItem(titleItem);

            // Image
            this._downloadAndCacheImage(this._currentDate)
                .then(localPath => {
                    const file = Gio.File.new_for_path(localPath);
                    const gicon = new Gio.FileIcon({ file });
                    const image = new St.Icon({
                        gicon,
                        icon_size: 512,
                        style_class: 'caricature-image'
                    });

                    const imageItem = new PopupMenu.PopupBaseMenuItem({ reactive: false });
                    imageItem.actor.add_child(image);
                    this.menu.addMenuItem(imageItem);

                    const descItem = new PopupMenu.PopupMenuItem(data.description, { reactive: false });
                    descItem.label.clutter_text.line_wrap = true;
                    descItem.label.clutter_text.line_wrap_mode = 2; // PANGO_WRAP_WORD
                    descItem.label.style = 'max-width: 512px;';
                    this.menu.addMenuItem(descItem);

                    this._addNavigation();
                })
                .catch(e => {
                    console.error('Error loading image:', e);
                    const errorItem = new PopupMenu.PopupMenuItem(MESSAGES.imageError);
                    this.menu.addMenuItem(errorItem);

                    const descItem = new PopupMenu.PopupMenuItem(data.description, { reactive: false });
                    descItem.label.clutter_text.line_wrap = true;
                    this.menu.addMenuItem(descItem);

                    this._addNavigation();
                });
        } catch (e) {
            console.error('Error displaying content:', e);
            this._showError(MESSAGES.contentError);
        }
    }

    _downloadAndCacheImage(date) {
        return new Promise((resolve, reject) => {
            const imageUrl = IMAGE_BASE_URL + date + '.png';
            const cacheDir = GLib.build_filenamev([GLib.get_user_cache_dir(), 'sketch-scandal']);
            const localPath = GLib.build_filenamev([cacheDir, date + '.png']);

            if (!GLib.file_test(cacheDir, GLib.FileTest.IS_DIR)) {
                GLib.mkdir_with_parents(cacheDir, 0o755);
            }

            if (GLib.file_test(localPath, GLib.FileTest.EXISTS)) {
                return resolve(localPath);
            }

            const session = new Soup.Session();
            const message = Soup.Message.new('GET', imageUrl);

            session.send_and_read_async(message, GLib.PRIORITY_DEFAULT, null, (session, res) => {
                try {
                    if (message.status_code !== 200) {
                        return reject(new Error('HTTP ' + message.status_code));
                    }
                    const bytes = session.send_and_read_finish(res);
                    const success = GLib.file_set_contents(localPath, bytes.get_data());
                    if (!success) throw new Error("Failed to save image to cache");
                    resolve(localPath);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }

    _addNavigation() {
        const navBox = new St.BoxLayout({ style_class: 'navigation-box', vertical: false });

        // Dobij sortirane dostupne datume
        const availableDates = Object.keys(this._imageData || {}).sort();
        const currentIndex = availableDates.indexOf(this._currentDate);
        const hasPrev = currentIndex > 0;
        const hasNext = currentIndex < availableDates.length - 1;

        const prevButton = new St.Button({
            child: new St.Icon({ icon_name: 'go-previous-symbolic', style_class: 'nav-icon' }),
            style_class: 'nav-button',
            reactive: hasPrev
        });
        prevButton.set_opacity(hasPrev ? 255 : 100);
        
        if (hasPrev) {
            prevButton.connect('clicked', () => {
                this._currentDate = availableDates[currentIndex - 1];
                this._updateDisplay();
            });
        }

        const dateLabel = new St.Label({ 
            text: this._currentDate, 
            style_class: 'date-label',
            style: 'padding: 0 10px;'
        });

        const nextButton = new St.Button({
            child: new St.Icon({ icon_name: 'go-next-symbolic', style_class: 'nav-icon' }),
            style_class: 'nav-button',
            reactive: hasNext
        });
        nextButton.set_opacity(hasNext ? 255 : 100);
        
        if (hasNext) {
            nextButton.connect('clicked', () => {
                this._currentDate = availableDates[currentIndex + 1];
                this._updateDisplay();
            });
        }

        // Oldest button
        const oldestButton = new St.Button({
            label: MESSAGES.oldest,
            style_class: 'nav-button'
        });
        oldestButton.connect('clicked', () => {
            if (availableDates.length > 0) {
                this._currentDate = availableDates[0];
                this._updateDisplay();
            }
        });

        // Today button
        const todayButton = new St.Button({
            label: MESSAGES.today,
            style_class: 'nav-button'
        });
        todayButton.connect('clicked', () => {
            const validDate = this._findValidStartDate();
            if (validDate !== this._currentDate) {
                this._currentDate = validDate;
                this._updateDisplay();
            }
        });

        // Newest button
        const newestButton = new St.Button({
            label: MESSAGES.newest,
            style_class: 'nav-button'
        });
        newestButton.connect('clicked', () => {
            if (availableDates.length > 0) {
                this._currentDate = availableDates[availableDates.length - 1];
                this._updateDisplay();
            }
        });

        // Refresh button
        const refreshButton = new St.Button({
            child: new St.Icon({ icon_name: 'view-refresh-symbolic', style_class: 'nav-icon' }),
            style_class: 'nav-button'
        });
        refreshButton.connect('clicked', () => {
            this._refresh();
        });

        navBox.add_child(prevButton);
        navBox.add_child(dateLabel);
        navBox.add_child(nextButton);
        navBox.add_child(oldestButton);
        navBox.add_child(todayButton);
        navBox.add_child(newestButton);
        navBox.add_child(refreshButton);

        const navItem = new PopupMenu.PopupBaseMenuItem({ reactive: false });
        navItem.actor.add_child(navBox);
        this.menu.addMenuItem(navItem);
    }

    _refresh() {
        // Reset sve
        this._imageData = null;
        this._currentDate = null;
        this._loading = false;
        
        // Ponovno učitaj podatke
        this._loadData();
    }

    _showMessage(message) {
        this.menu.removeAll();
        const item = new PopupMenu.PopupMenuItem(message);
        this.menu.addMenuItem(item);
    }

    _showError(message) {
        this.menu.removeAll();
        const item = new PopupMenu.PopupMenuItem(message);
        item.label.style = 'color: #ff0000;';
        this.menu.addMenuItem(item);
        
        // Dodaj refresh dugme u error stanju
        const refreshItem = new PopupMenu.PopupMenuItem(MESSAGES.refresh);
        refreshItem.connect('activate', () => this._refresh());
        this.menu.addMenuItem(refreshItem);
    }

    destroy() {
        // Clean up when extension is disabled
        this._imageData = null;
        super.destroy();
    }
});

// ---------- Extension class ----------
export default class SketchScandalExtension extends Extension {
    constructor(metadata) {
        super(metadata);
        this._indicator = null;
    }

    enable() {
        this._indicator = new SketchScandalIndicator();
        Main.panel.addToStatusArea(this.uuid, this._indicator);
    }

    disable() {
        if (this._indicator) {
            this._indicator.destroy();
            this._indicator = null;
        }
    }
}