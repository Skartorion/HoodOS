import GLib from 'gi://GLib';
export function sliderToVariant(settings) {
    return GLib.Variant.new('a{sv}', {
        target: GLib.Variant.new_uint16(settings.target),
        customApp: GLib.Variant.new_string(settings.customApp),
        inverted: GLib.Variant.new_boolean(settings.inverted),
        min: GLib.Variant.new_uint16(settings.min),
        max: GLib.Variant.new_uint16(settings.max)
    });
}
