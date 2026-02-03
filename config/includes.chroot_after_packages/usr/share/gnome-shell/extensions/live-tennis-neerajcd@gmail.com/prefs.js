// src/gnome/prefs.ts
import Adw from "gi://Adw";
import Gio from "gi://Gio";
import GObject from "gi://GObject";
import Gtk from "gi://Gtk";
import GdkPixbuf from "gi://GdkPixbuf";
import { ExtensionPreferences } from "resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js";

// src/common/countries.ts
var Countries = [
  { name: "Afghanistan", ioc: "AFG" },
  { name: "Albania", ioc: "ALB" },
  { name: "Algeria", ioc: "ALG" },
  { name: "Andorra", ioc: "AND" },
  { name: "Angola", ioc: "ANG" },
  { name: "Antigua and Barbuda", ioc: "ANT" },
  { name: "Argentina", ioc: "ARG" },
  { name: "Armenia", ioc: "ARM" },
  { name: "Aruba", ioc: "ARU" },
  { name: "American Samoa", ioc: "ASA" },
  { name: "Australia", ioc: "AUS" },
  { name: "Austria", ioc: "AUT" },
  { name: "Azerbaijan", ioc: "AZE" },
  { name: "Bahamas", ioc: "BAH" },
  { name: "Bangladesh", ioc: "BAN" },
  { name: "Barbados", ioc: "BAR" },
  { name: "Burundi", ioc: "BDI" },
  { name: "Belgium", ioc: "BEL" },
  { name: "Benin", ioc: "BEN" },
  { name: "Bermuda", ioc: "BER" },
  { name: "Bhutan", ioc: "BHU" },
  { name: "Bosnia and Herzegovina", ioc: "BIH" },
  { name: "Belize", ioc: "BIZ" },
  { name: "Belarus", ioc: "BLR" },
  { name: "Bolivia", ioc: "BOL" },
  { name: "Botswana", ioc: "BOT" },
  { name: "Brazil", ioc: "BRA" },
  { name: "Bahrain", ioc: "BRN" },
  { name: "Brunei", ioc: "BRU" },
  { name: "Bulgaria", ioc: "BUL" },
  { name: "Burkina Faso", ioc: "BUR" },
  { name: "Central African Republic", ioc: "CAF" },
  { name: "Cambodia", ioc: "CAM" },
  { name: "Canada", ioc: "CAN" },
  { name: "Cayman Islands", ioc: "CAY" },
  { name: "Republic of the Congo", ioc: "CGO" },
  { name: "Chad", ioc: "CHA" },
  { name: "Chile", ioc: "CHI" },
  { name: "People's Republic of China", ioc: "CHN" },
  { name: "Ivory Coast", ioc: "CIV" },
  { name: "Cameroon", ioc: "CMR" },
  { name: "Democratic Republic of the Congo", ioc: "COD" },
  { name: "Cook Islands", ioc: "COK" },
  { name: "Colombia", ioc: "COL" },
  { name: "Comoros", ioc: "COM" },
  { name: "Cape Verde", ioc: "CPV" },
  { name: "Costa Rica", ioc: "CRC" },
  { name: "Croatia", ioc: "CRO" },
  { name: "Cuba", ioc: "CUB" },
  { name: "Cyprus", ioc: "CYP" },
  { name: "Czech Republic Czechia", ioc: "CZE" },
  { name: "Denmark", ioc: "DEN" },
  { name: "Djibouti", ioc: "DJI" },
  { name: "Dominica", ioc: "DMA" },
  { name: "Dominican Republic", ioc: "DOM" },
  { name: "Ecuador", ioc: "ECU" },
  { name: "Egypt", ioc: "EGY" },
  { name: "Eritrea", ioc: "ERI" },
  { name: "El Salvador", ioc: "ESA" },
  { name: "Spain", ioc: "ESP" },
  { name: "Estonia", ioc: "EST" },
  { name: "Ethiopia", ioc: "ETH" },
  { name: "Fiji", ioc: "FIJ" },
  { name: "Finland", ioc: "FIN" },
  { name: "France", ioc: "FRA" },
  { name: "Federated States of Micronesia", ioc: "FSM" },
  { name: "Gabon", ioc: "GAB" },
  { name: "The Gambia", ioc: "GAM" },
  { name: "Great Britain", ioc: "GBR" },
  { name: "Guinea-Bissau", ioc: "GBS" },
  { name: "Georgia", ioc: "GEO" },
  { name: "Equatorial Guinea", ioc: "GEQ" },
  { name: "Germany", ioc: "GER" },
  { name: "Ghana", ioc: "GHA" },
  { name: "Greece", ioc: "GRE" },
  { name: "Grenada", ioc: "GRN" },
  { name: "Guatemala", ioc: "GUA" },
  { name: "Guinea", ioc: "GUI" },
  { name: "Guam", ioc: "GUM" },
  { name: "Guyana", ioc: "GUY" },
  { name: "Haiti", ioc: "HAI" },
  { name: "Hong Kong", ioc: "HKG" },
  { name: "Honduras", ioc: "HON" },
  { name: "Hungary", ioc: "HUN" },
  { name: "Indonesia", ioc: "INA" },
  { name: "India", ioc: "IND" },
  { name: "Iran", ioc: "IRI" },
  { name: "Ireland", ioc: "IRL" },
  { name: "Iraq", ioc: "IRQ" },
  { name: "Iceland", ioc: "ISL" },
  { name: "Israel", ioc: "ISR" },
  { name: "Virgin Islands", ioc: "ISV" },
  { name: "Italy", ioc: "ITA" },
  { name: "British Virgin Islands", ioc: "IVB" },
  { name: "Jamaica", ioc: "JAM" },
  { name: "Jordan", ioc: "JOR" },
  { name: "Japan", ioc: "JPN" },
  { name: "Kazakhstan", ioc: "KAZ" },
  { name: "Kenya", ioc: "KEN" },
  { name: "Kyrgyzstan", ioc: "KGZ" },
  { name: "Kiribati", ioc: "KIR" },
  { name: "South Korea", ioc: "KOR" },
  { name: "Kosovo", ioc: "KOS" },
  { name: "Saudi Arabia", ioc: "KSA" },
  { name: "Kuwait", ioc: "KUW" },
  { name: "Laos", ioc: "LAO" },
  { name: "Latvia", ioc: "LAT" },
  { name: "Libya", ioc: "LBA" },
  { name: "Lebanon", ioc: "LBN" },
  { name: "Liberia", ioc: "LBR" },
  { name: "Saint Lucia", ioc: "LCA" },
  { name: "Lesotho", ioc: "LES" },
  { name: "Liechtenstein", ioc: "LIE" },
  { name: "Lithuania", ioc: "LTU" },
  { name: "Luxembourg", ioc: "LUX" },
  { name: "Madagascar", ioc: "MAD" },
  { name: "Morocco", ioc: "MAR" },
  { name: "Malaysia", ioc: "MAS" },
  { name: "Malawi", ioc: "MAW" },
  { name: "Moldova", ioc: "MDA" },
  { name: "Maldives", ioc: "MDV" },
  { name: "Mexico", ioc: "MEX" },
  { name: "Mongolia", ioc: "MGL" },
  { name: "Marshall Islands", ioc: "MHL" },
  { name: "North Macedonia", ioc: "MKD" },
  { name: "Mali", ioc: "MLI" },
  { name: "Malta", ioc: "MLT" },
  { name: "Montenegro", ioc: "MNE" },
  { name: "Monaco", ioc: "MON" },
  { name: "Mozambique", ioc: "MOZ" },
  { name: "Mauritius", ioc: "MRI" },
  { name: "Mauritania", ioc: "MTN" },
  { name: "Myanmar", ioc: "MYA" },
  { name: "Namibia", ioc: "NAM" },
  { name: "Nicaragua", ioc: "NCA" },
  { name: "Netherlands", ioc: "NED" },
  { name: "Nepal", ioc: "NEP" },
  { name: "Nigeria", ioc: "NGR" },
  { name: "Niger", ioc: "NIG" },
  { name: "Norway", ioc: "NOR" },
  { name: "Nauru", ioc: "NRU" },
  { name: "New Zealand", ioc: "NZL" },
  { name: "Oman", ioc: "OMA" },
  { name: "Pakistan", ioc: "PAK" },
  { name: "Panama", ioc: "PAN" },
  { name: "Paraguay", ioc: "PAR" },
  { name: "Peru", ioc: "PER" },
  { name: "Philippines", ioc: "PHI" },
  { name: "Palestine", ioc: "PLE" },
  { name: "Palau", ioc: "PLW" },
  { name: "Papua New Guinea", ioc: "PNG" },
  { name: "Poland", ioc: "POL" },
  { name: "Portugal", ioc: "POR" },
  { name: "North Korea", ioc: "PRK" },
  { name: "Puerto Rico", ioc: "PUR" },
  { name: "Qatar", ioc: "QAT" },
  { name: "Romania", ioc: "ROU" },
  { name: "South Africa", ioc: "RSA" },
  { name: "Russia", ioc: "RUS" },
  { name: "Rwanda", ioc: "RWA" },
  { name: "Samoa", ioc: "SAM" },
  { name: "Senegal", ioc: "SEN" },
  { name: "Seychelles", ioc: "SEY" },
  { name: "Singapore", ioc: "SGP" },
  { name: "Saint Kitts and Nevis", ioc: "SKN" },
  { name: "Sierra Leone", ioc: "SLE" },
  { name: "Slovenia", ioc: "SLO" },
  { name: "San Marino", ioc: "SMR" },
  { name: "Solomon Islands", ioc: "SOL" },
  { name: "Somalia", ioc: "SOM" },
  { name: "Serbia", ioc: "SRB" },
  { name: "Sri Lanka", ioc: "SRI" },
  { name: "South Sudan", ioc: "SSD" },
  { name: "S\xE3o Tom\xE9 and Pr\xEDncipe", ioc: "STP" },
  { name: "Sudan", ioc: "SUD" },
  { name: "Switzerland", ioc: "SUI" },
  { name: "Suriname", ioc: "SUR" },
  { name: "Slovakia", ioc: "SVK" },
  { name: "Sweden", ioc: "SWE" },
  { name: "Eswatini Eswatini", ioc: "SWZ" },
  { name: "Syria", ioc: "SYR" },
  { name: "Tanzania", ioc: "TAN" },
  { name: "Tonga", ioc: "TGA" },
  { name: "Thailand", ioc: "THA" },
  { name: "Tajikistan", ioc: "TJK" },
  { name: "Turkmenistan", ioc: "TKM" },
  { name: "Timor-Leste", ioc: "TLS" },
  { name: "Togo", ioc: "TOG" },
  { name: "Republic of China", ioc: "TPE" },
  { name: "Trinidad and Tobago", ioc: "TTO" },
  { name: "Tunisia", ioc: "TUN" },
  { name: "Turkey", ioc: "TUR" },
  { name: "Tuvalu", ioc: "TUV" },
  { name: "United Arab Emirates", ioc: "UAE" },
  { name: "Uganda", ioc: "UGA" },
  { name: "Ukraine", ioc: "UKR" },
  { name: "Uruguay", ioc: "URU" },
  { name: "United States", ioc: "USA" },
  { name: "Uzbekistan", ioc: "UZB" },
  { name: "Vanuatu", ioc: "VAN" },
  { name: "Venezuela", ioc: "VEN" },
  { name: "Vietnam", ioc: "VIE" },
  { name: "Saint Vincent and the Grenadines", ioc: "VIN" },
  { name: "Yemen", ioc: "YEM" },
  { name: "Zambia", ioc: "ZAM" },
  { name: "Zimbabwe", ioc: "ZIM" }
];

// src/gnome/prefs.ts
var CountryItem = GObject.registerClass({
  GTypeName: "CountryItem",
  Properties: {
    "name": GObject.ParamSpec.string("name", "name", "Country Name", GObject.ParamFlags.READWRITE, null),
    "ioc": GObject.ParamSpec.string("ioc", "ioc", "IOC Code", GObject.ParamFlags.READWRITE, null),
    "flag": GObject.ParamSpec.object("flag", "flag", "Flag Pixbuf", GObject.ParamFlags.READWRITE, GdkPixbuf.Pixbuf),
    "selected": GObject.ParamSpec.boolean("selected", "selected", "Selection State", GObject.ParamFlags.READWRITE, false)
  }
}, class CountryItem2 extends GObject.Object {
});
var LiveScorePreferences = class extends ExtensionPreferences {
  _addCheckBoxSettingRow(group, key, settings, schema) {
    const keyObject = schema.get_key(key);
    const row = new Adw.ActionRow({
      title: keyObject.get_summary(),
      subtitle: keyObject.get_description()
    });
    group.add(row);
    const checkButton = new Gtk.CheckButton({
      halign: Gtk.Align.CENTER,
      // Prevent horizontal expansion
      valign: Gtk.Align.CENTER
      // Prevent vertical expansion
    });
    row.add_suffix(checkButton);
    settings.bind(key, checkButton, "active", Gio.SettingsBindFlags.DEFAULT);
  }

  _addIntBasedEntry(group, key, settings, schema) {
    const keyObject = schema.get_key(key);
    const entryRow = new Adw.EntryRow({
      title: keyObject.get_summary(),
      text: String(settings.get_int(key))
    });
    entryRow.set_tooltip_text(keyObject.get_description());
    group.add(entryRow);
    const errorIcon = new Gtk.Image({
      icon_name: "dialog-error-symbolic",
      visible: false
    });
    entryRow.add_suffix(errorIcon);
    const rangeVariant = keyObject.get_range();
    const innerRangeVariant = rangeVariant.get_child_value(1).get_variant();
    const [minValue, maxValue] = innerRangeVariant.deep_unpack();
    entryRow.connect("changed", () => {
      const text = entryRow.get_text();
      const value = parseInt(text, 10);
      if (!isNaN(value) && value >= minValue && value <= maxValue) {
        settings.set_int(key, value);
        entryRow.remove_css_class("error-input");
        errorIcon.set_visible(false);
      } else {
        entryRow.add_css_class("error-input");
        errorIcon.set_visible(true);
      }
    });
  }

  _addSpinBoxSettingRow(group, key, min, max, settings, schema, increment = 5) {
    const keyObject = schema.get_key(key);
    const durationRow = new Adw.ActionRow({
      title: keyObject.get_summary(),
      subtitle: keyObject.get_description()
    });
    group.add(durationRow);
    const spinner = new Gtk.SpinButton({
      adjustment: new Gtk.Adjustment({
        lower: min,
        upper: max,
        step_increment: increment
      }),
      valign: Gtk.Align.CENTER
    });
    durationRow.add_suffix(spinner);
    durationRow.activatable_widget = spinner;
    settings.bind(key, spinner, "value", Gio.SettingsBindFlags.DEFAULT);
  }

  _addTourSettings(page, settings, schema) {
    const tourGroup = new Adw.PreferencesGroup({
      title: "Enable tours",
      description: "Control which tours are enabled and processed."
    });
    page.add(tourGroup);
    this._addCheckBoxSettingRow(tourGroup, "enable-atp", settings, schema);
    this._addCheckBoxSettingRow(tourGroup, "enable-wta", settings, schema);
    this._addCheckBoxSettingRow(tourGroup, "enable-atp-challenger", settings, schema);
    this._addCheckBoxSettingRow(tourGroup, "enable-tennis-temple", settings, schema);
  }

  _addLiveViewSettings(page, settings, schema) {
    const liveViewGroup = new Adw.PreferencesGroup({
      title: "Live Score Window",
      description: "Control Live Score Window behaviour"
    });
    page.add(liveViewGroup);
    this._addIntBasedEntry(liveViewGroup, "live-window-size-x", settings, schema);
    this._addIntBasedEntry(liveViewGroup, "live-window-size-y", settings, schema);
    this._addCheckBoxSettingRow(liveViewGroup, "auto-hide-no-live-matches", settings, schema);
    this._addCheckBoxSettingRow(liveViewGroup, "only-show-live-matches", settings, schema);
    this._addSpinBoxSettingRow(liveViewGroup, "keep-completed-duration", 0, 120, settings, schema);
  }

  _addMultiCountrySelection(group, key, settings, schema) {
    const keyObject = schema.get_key(key);
    const selectedCodes = new Set(settings.get_strv(key));
    const model = new Gio.ListStore({ item_type: CountryItem.$gtype });
    Countries.forEach((country) => {
      try {
        const flagPath = this.path + `/flags/${country.ioc.toLowerCase()}.svg`;
        const pixbuf = GdkPixbuf.Pixbuf.new_from_file_at_scale(flagPath, 24, 18, true);
        const isSelected = selectedCodes.has(country.ioc);
        model.append(new CountryItem({ ...country, flag: pixbuf, selected: isSelected }));
      } catch (e) {
        console.error(`Failed to load flag for ${country.name}: ${e.message}`);
        const isSelected = selectedCodes.has(country.ioc);
        model.append(new CountryItem({ ...country, flag: null, selected: isSelected }));
      }
    });
    const factory = new Gtk.SignalListItemFactory();
    factory.connect("setup", (f, listItem) => {
      const check = new Gtk.CheckButton({
        halign: Gtk.Align.END
      });
      const box = new Gtk.Box({ spacing: 6, orientation: Gtk.Orientation.HORIZONTAL, homogeneous: false });
      const flagImage = new Gtk.Image();
      const label = new Gtk.Label({ xalign: 0, hexpand: true });
      box.append(check);
      box.append(flagImage);
      box.append(label);
      listItem.set_child(box);
    });
    factory.connect("bind", (f, listItem) => {
      const countryItem = listItem.get_item();
      const box = listItem.get_child();
      const check = box.get_first_child();
      const flagImage = check.get_next_sibling();
      const label = flagImage.get_next_sibling();
      check.set_active(countryItem.selected);
      check.connect("toggled", () => {
        countryItem.selected = check.get_active();
        const selectedCodes2 = [];
        for (let i = 0; i < model.get_n_items(); i++) {
          const item = model.get_item(i);
          if (item.selected) {
            selectedCodes2.push(item.ioc);
          }
        }
        settings.set_strv(key, selectedCodes2);
      });
      if (countryItem.flag) {
        flagImage.set_from_pixbuf(countryItem.flag);
      }
      label.set_text(countryItem.name);
    });
    const listView = new Gtk.ListView({
      model: Gtk.NoSelection.new(model),
      // Use NoSelection since we handle it manually
      factory
    });
    const scrollView = new Gtk.ScrolledWindow({
      height_request: 300,
      hexpand: true,
      vexpand: true
    });
    scrollView.set_child(listView);
    const row = new Adw.ActionRow({
      title: keyObject.get_summary(),
      subtitle: keyObject.get_description()
    });
    row.add_suffix(scrollView);
    group.add(row);
  }

  _addPlayerNamesEntry(group, key, settings, schema) {
    const keyObject = schema.get_key(key);
    const currentNames = settings.get_strv(key).join(", ");
    const entryRow = new Adw.EntryRow({
      title: keyObject.get_summary(),
      text: currentNames
    });
    entryRow.set_tooltip_text(keyObject.get_description());
    group.add(entryRow);
    const errorIcon = new Gtk.Image({
      icon_name: "dialog-error-symbolic",
      visible: false
    });
    entryRow.add_suffix(errorIcon);
    const regex = /^([a-zA-Z]+(,\s*[a-zA-Z]+)*)?$/;
    entryRow.connect("changed", () => {
      const text = entryRow.get_text();
      if (text === "" || regex.test(text.trim())) {
        const names = text.split(",").map((s) => s.trim()).filter(Boolean);
        settings.set_strv(key, names);
        entryRow.remove_css_class("error-input");
        errorIcon.set_visible(false);
      } else {
        entryRow.add_css_class("error-input");
        errorIcon.set_visible(true);
      }
    });
  }

  _addAutoSelectSettings(page, settings, schema) {
    const group = new Adw.PreferencesGroup({
      title: "Live View Match Selection",
      description: "Control how Live View match selection works."
    });
    page.add(group);
    this._addCheckBoxSettingRow(group, "auto-select-live-matches", settings, schema);
    this._addMultiCountrySelection(group, "auto-select-country-codes", settings, schema);
    this._addPlayerNamesEntry(group, "auto-select-player-names", settings, schema);
  }

  _addDeveloperSettings(page, settings, schema) {
    const group = new Adw.PreferencesGroup({
      title: "Developer Options",
      description: "Control developer mode used to debug this extension."
    });
    page.add(group);
    this._addCheckBoxSettingRow(group, "enable-debug-logging", settings, schema);
  }

  fillPreferencesWindow(window) {
    const settings = this.getSettings();
    const schema = settings.settings_schema;
    const page = new Adw.PreferencesPage();
    window.add(page);
    this._addTourSettings(page, settings, schema);
    this._addLiveViewSettings(page, settings, schema);
    this._addAutoSelectSettings(page, settings, schema);
    this._addDeveloperSettings(page, settings, schema);
  }
};
export {
  LiveScorePreferences as default
};
