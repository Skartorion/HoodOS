import GdkPixbuf from "gi://GdkPixbuf";
import St from "gi://St";
import Gio from 'gi://Gio';
import * as Main from "resource:///org/gnome/shell/ui/main.js";
const THEME_PALETTE = [
    // --- 莫蘭迪色系 & 高級灰 ---
    { name: 'Dusty Rose (煙灰粉)', original: [188, 143, 143], light: [0, 25, 92], dark: [358, 20, 30] },
    { name: 'Terracotta (赤陶棕)', original: [204, 119, 88], light: [25, 45, 90], dark: [28, 30, 25] },
    { name: 'Muted Ochre (赭石黃)', original: [203, 153, 106], light: [35, 40, 88], dark: [30, 25, 35] },
    { name: 'Sage Green (鼠尾草綠)', original: [138, 154, 137], light: [115, 15, 90], dark: [118, 15, 28] },
    { name: 'Misty Blue (霧霾藍)', original: [133, 153, 170], light: [205, 25, 92], dark: [210, 20, 30] },
    { name: 'Slate Blue (灰藍)', original: [106, 114, 128], light: [220, 10, 88], dark: [220, 12, 25] },
    { name: 'Muted Lavender (薰衣草灰)', original: [181, 165, 185], light: [285, 15, 90], dark: [290, 10, 35] },

    // --- 溫暖色系 (低飽和度) ---
    { name: 'Pale Apricot (杏色)', original: [255, 224, 190], light: [33, 100, 94], dark: [22, 40, 45] },
    { name: 'Warm Beige (暖米)', original: [245, 245, 220], light: [60, 40, 95], dark: [40, 20, 30] },
    { name: 'Burnt Sienna (熟赭)', original: [160, 82, 45], light: [19, 56, 88], dark: [19, 56, 28] },

    // --- 冷靜色系 (低飽和度) ---
    { name: 'Powder Blue (粉藍)', original: [176, 224, 230], light: [187, 40, 93], dark: [190, 30, 38] },
    { name: 'Steel Teal (鋼青色)', original: [90, 145, 149], light: [184, 25, 90], dark: [184, 28, 30] },
    { name: 'Indigo Dye (靛藍)', original: [75, 0, 130], light: [275, 100, 90], dark: [275, 70, 25] },

    // --- 自然色系 ---
    { name: 'Olive Drab (橄欖綠)', original: [107, 142, 35], light: [80, 60, 88], dark: [80, 60, 25] },
    { name: 'Forest Green (森林綠)', original: [34, 139, 34], light: [120, 60, 85], dark: [120, 60, 20] },
    { name: 'Chocolate (巧克力色)', original: [123, 63, 0], light: [30, 100, 85], dark: [30, 100, 18] },

    // --- 鮮活跳色 (作為點綴) ---
    { name: 'Vibrant Red (活力紅)', original: [210, 4, 45], light: [0, 80, 90], dark: [0, 85, 35] },
    { name: 'Bright Blue (明亮藍)', original: [28, 128, 255], light: [215, 90, 92], dark: [215, 90, 40] },
    { name: 'Gold (金色)', original: [255, 215, 0], light: [51, 100, 90], dark: [45, 80, 40] },

    // --- 基礎中性色 ---
    { name: 'Warm Grey (暖灰)', original: [128, 128, 118], light: [60, 5, 88], dark: [60, 5, 25] },
    { name: 'Charcoal (炭灰)', original: [54, 69, 79], light: [205, 20, 85], dark: [205, 20, 20] },
];
export default class Colors {
    static rgbToHsl(r, g, b) {
        r /= 255, g /= 255, b /= 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max == min) {
            h = s = 0; // achromatic
        } else {
            let d = max - min;
            s = l > 0
            .5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
    }
    static hslToRgb(h, s, l) {
        // 確保 hsl 值在有效範圍內
        h = Math.max(0, Math.min(360, h));
        s = Math.max(0, Math.min(100, s));
        l = Math.max(0, Math.min(100, l));

        // 将 hsl 值转换为 0-1 范围
        h /= 360;
        s /= 100;
        l /= 100;

        let r, g, b;

        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
    }
    static getCustomColor(settings) {
        let D_BGC = settings.get_string('dark-bg-color');
        let D_FGC = settings.get_string('dark-fg-color');
        let L_BGC = settings.get_string('light-bg-color');
        let L_FGC = settings.get_string('light-fg-color');
        D_BGC = D_BGC.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
        D_FGC = D_FGC.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
        L_BGC = L_BGC.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
        L_FGC = L_FGC.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
        return [
            {
                dark: {
                    r: D_BGC[1],
                    g: D_BGC[2],
                    b: D_BGC[3]
                },
                light: {
                    r: L_BGC[1],
                    g: L_BGC[2],
                    b: L_BGC[3]
                }
            },
            {
                dark: {
                    r: D_FGC[1],
                    g: D_FGC[2],
                    b: D_FGC[3]
                },
                light: {
                    r: L_FGC[1],
                    g: L_FGC[2],
                    b: L_FGC[3]
                }
            }
        ]
    }

    /**
     * 計算兩個 RGB 顏色之間的歐幾里得距離
     * @param {number[]} rgb1 - 第一個顏色 [r, g, b]
     * @param {number[]} rgb2 - 第二個顏色 [r, g, b]
     * @returns {number} 顏色之間的距離
     */
    static calculateColorDistance(rgb1, rgb2) {
        const [r1, g1, b1] = rgb1;
        const [r2, g2, b2] = rgb2;
        return Math.sqrt(
            Math.pow(r1 - r2, 2) +
            Math.pow(g1 - g2, 2) +
            Math.pow(b1 - b2, 2)
        );
    }

    /**
     * 從 RGB 顏色計算其飽和度(S)和亮度(L)
     * @param {number} r - 紅色分量 (0-255)
     * @param {number} g - 綠色分量 (0-255)
     * @param {number} b - 藍色分量 (0-255)
     * @returns {{s: number, l: number}} 飽和度和亮度 (百分比)
     */
    static getSLFromRgb(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let s;
        const l = (max + min) / 2;

        if (max === min) {
            s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        }
        return { s: s * 100, l: l * 100 };
    }

    /**
      * 從圖片中提取主題顏色，並根據預設調色盤返回一個搭配色
      * (優化：忽略黑白灰，優先提取彩色作為主色調)
      * @param {string} imagePath - 圖片檔案的路徑
      * @param {"light" | "dark"} modifier - 需要的顏色模式 ('light' 為明亮色, 'dark' 為暗色)
      * @returns {object} 最終搭配色的 RGB 物件 {r, g, b}
      */
    static getThemeColor(imagePath, modifier) {
        // --- 1. 從圖片中統計所有顏色 ---
        const source = GdkPixbuf.Pixbuf.new_from_file(imagePath);
        const pixels = source.get_pixels();
        const rowstride = source.get_rowstride();
        const n_channels = source.get_n_channels();
        const H = source.get_height();
        const W = source.get_width();
        const allColors = new Map();

        for (let y = 0; y < H; y += Math.max(1, Math.round(H / 100))) {
            for (let x = 0; x < W; x += Math.max(1, Math.round(W / 100))) {
                const offset = y * rowstride + x * n_channels;
                const r = pixels[offset];
                const g = pixels[offset + 1];
                const b = pixels[offset + 2];
                const strRGB = [r, g, b].join(",");
                allColors.set(strRGB, (allColors.get(strRGB) || 0) + 1);
            }
        }

        if (allColors.size === 0) {
            const fallbackHsl = modifier === "light" ? [0, 0, 75] : [0, 0, 45];
            const [h, s, l] = fallbackHsl;
            return Colors.hslToRgb(h, s, l);
        }

        // --- 2. 尋找最主要的主題色 (優先選擇彩色) ---
        const sortedColors = Array.from(allColors.entries()).sort((a, b) => b[1] - a[1]);

        let dominantRgb = null;

        for (const [strRGB, count] of sortedColors) {
            const [r, g, b] = strRGB.split(',').map(Number);
            const { s, l } = Colors.getSLFromRgb(r, g, b);
            const isAchromatic = s < 15 || l > 95 || l < 10;
            if (!isAchromatic) {
                dominantRgb = [r, g, b];
                break; // 找到後立刻跳出
            }
        }

        if (!dominantRgb) {
            dominantRgb = sortedColors[0][0].split(',').map(Number);
        }

        // --- 3. 在預設調色盤中尋找最符合的顏色 (BUG修復：使用加權評分) ---
        let closestColor = null;
        let minScore = Infinity;
        const [dominantHue, dominantSat, dominantLight] = Colors.rgbToHsl(...dominantRgb);

        for (const paletteColor of THEME_PALETTE) {
            // 從調色盤中取出 HSL 值用於比較
            const [paletteHue, paletteSat, paletteLight] = paletteColor.light;

            // 計算色相距離 (環狀，350度 和 10度 之間距離是20度，而不是340度)
            const hueDistance = Math.min(Math.abs(dominantHue - paletteHue), 360 - Math.abs(dominantHue - paletteHue));
            // 計算飽和度距離
            const satDistance = Math.abs(dominantSat - paletteSat);
            // 計算亮度距離
            const lightDistance = Math.abs(dominantLight - paletteLight);

            // 加權計算總分。
            // 如果圖片顏色飽和度很低，我們會降低色相的影響，提高飽和度和亮度的影響，使其更容易匹配到灰色。
            let score;
            if (dominantSat < 20) {
                // 對於灰階顏色，飽和度和亮度更重要
                score = (hueDistance * 0.5) + (satDistance * 2) + lightDistance;
            } else {
                // 對於彩色，色相最重要
                score = (hueDistance * 3) + satDistance + lightDistance;
            }

            if (score < minScore) {
                minScore = score;
                closestColor = paletteColor;
            }
        }

        if (!closestColor) { // 安全起見的後備方案
            closestColor = THEME_PALETTE.find(p => p.name === 'Blue Grey');
        }

        // --- 4. 根據 modifier 返回對應的搭配色 ---
        const finalHsl = modifier === "light" ? closestColor.light : closestColor.dark;
        const [h, s, l] = finalHsl;
        return Colors.hslToRgb(h, s, l);
    }


    static gaussianBlur(settings, imagePath, radius = 30) {
        let pixbuf;
        try {
            pixbuf = GdkPixbuf.Pixbuf.new_from_file(imagePath);
        } catch (e) {
            return;
        }
        const scale = St.ThemeContext.get_for_stage(global.stage).scale_factor;
        const panelHeight = Main.panel.get_height();
        const maxHeight = (settings.get_int("top-margin") + panelHeight + 5) * scale;

        const wallpaperSettings = new Gio.Settings({ schema_id: 'org.gnome.desktop.background' });
        const wallpaperMode = wallpaperSettings.get_string('picture-options');

        const screenWidth = Main.layoutManager.primaryMonitor.width;
        const screenHeight = Main.layoutManager.primaryMonitor.height;
        let imageWidth = pixbuf.get_width();
        let imageHeight = pixbuf.get_height();
        let imageAspectRatio = imageWidth / imageHeight;
        let screenAspectRatio = screenWidth / screenHeight;
        let startX = 0;
        let startY = 0;

        switch (wallpaperMode) {
            case "zoom": // 放大并裁剪
                if (imageAspectRatio > screenAspectRatio) {
                    // 图片更宽，左右两侧被裁剪，水平方向偏移 (X 轴)
                    startX = Math.round((imageWidth - (imageHeight * screenAspectRatio)) / 2); // 计算图片 X 方向的偏移量
                } else {
                    // 图片更高或比例相同，上下两侧被裁剪，垂直方向偏移 (Y 轴)
                    startY = Math.round((imageHeight - (imageWidth / screenAspectRatio)) / 2); // 计算图片 Y 方向的偏移量
                }
                break;
            case "centered": // 居中
            case "scaled": // 缩放
            case "stretched": // 拉伸
            case "wallpaper": // 壁纸 (Centered and Tiled) -  假设 Centered
            case "spanned": // 跨屏 - 假设 Scaled
            case "none": // 无
            default:
                startX = 0;
                startY = 0;
                break;
        }

        pixbuf = pixbuf.new_subpixbuf(startX, startY, imageWidth - (startX * 2), Math.min(Math.round(imageWidth / (screenWidth / maxHeight)), imageHeight - (startY * 2)));

        let pixbuf_fill = GdkPixbuf.Pixbuf.new(GdkPixbuf.Colorspace.RGB, pixbuf.get_has_alpha(), 8, pixbuf.get_width(), pixbuf.get_height() + 20);
        pixbuf.copy_area(0, 0, pixbuf.get_width(), pixbuf.get_height(), pixbuf_fill, 0, 0);
        pixbuf.copy_area(0, 0, pixbuf.get_width(), pixbuf.get_height(), pixbuf_fill, 0, 20);
        pixbuf = pixbuf_fill;


        let width = pixbuf.get_width();
        let height = pixbuf.get_height();
        let hasAlpha = pixbuf.get_has_alpha();
        let rowstride = pixbuf.get_rowstride();
        let pixels = pixbuf.get_pixels();
        // let newPixels = new Uint8Array(pixels.length); //Change to Float32Array

        // 生成高斯核 (预先计算, 并优化)
        let kernel = [];
        let sigma = radius / 3;
        let sum = 0;
        for (let x = -radius; x <= radius; x++) {
            let g = Math.exp(-(x * x) / (2 * sigma * sigma));
            kernel.push(g);
            sum += g;
        }
        // 歸一化
        for (let i = 0; i < kernel.length; i++) {
            kernel[i] /= sum;
        }

        // 使用 Float32Array 存储中间结果
        let newPixels = new Float32Array(pixels.length);

        let trueRadius = Math.floor(kernel.length / 2);

        // 水平方向模糊
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let r = 0, g = 0, b = 0, a = 0;
                for (let i = -trueRadius; i <= trueRadius; i++) {
                    // 复制边界
                    let x1 = x + i;
                    if (x1 < 0) {
                        x1 = 0;
                    } else if (x1 >= width) {
                        x1 = width - 1;
                    }
                    let offset = (y * rowstride) + (x1 * (hasAlpha ? 4 : 3));
                    r += pixels[offset] * kernel[i + trueRadius];
                    g += pixels[offset + 1] * kernel[i + trueRadius];
                    b += pixels[offset + 2] * kernel[i + trueRadius];
                    if (hasAlpha) {
                        a += pixels[offset + 3] * kernel[i + trueRadius];
                    }
                }
                let offset = (y * rowstride) + (x * (hasAlpha ? 4 : 3));
                newPixels[offset] = r; // 存储 Float32 值
                newPixels[offset + 1] = g;
                newPixels[offset + 2] = b;
                if (hasAlpha) {
                    newPixels[offset + 3] = a;
                }
            }
        }

        // 垂直方向模糊 (复用 newPixels, 先复制)

        let tempPixels = new Float32Array(newPixels); // 复制水平模糊后的结果
        newPixels = new Float32Array(pixels.length);


        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                let r = 0, g = 0, b = 0, a = 0;
                for (let i = -trueRadius; i <= trueRadius; i++) {
                    // 复制边界
                    let y1 = y + i;
                    if (y1 < 0) {
                        y1 = 0;
                    } else if (y1 >= height) {
                        y1 = height - 1;
                    }
                    let offset = (y1 * rowstride) + (x * (hasAlpha ? 4 : 3));
                    r += tempPixels[offset] * kernel[i + trueRadius];
                    g += tempPixels[offset + 1] * kernel[i + trueRadius];
                    b += tempPixels[offset + 2] * kernel[i + trueRadius];
                    if (hasAlpha) {
                        a += tempPixels[offset + 3] * kernel[i + trueRadius];
                    }
                }
                let offset = (y * rowstride) + (x * (hasAlpha ? 4 : 3));
                newPixels[offset] = r; // 存储 Float32 值
                newPixels[offset + 1] = g;
                newPixels[offset + 2] = b;
                if (hasAlpha) {
                    newPixels[offset + 3] = a;
                }
            }
        }

        // 转换回 Uint8Array 并创建新的 Pixbuf
        let finalPixels = new Uint8Array(newPixels.length);
        for (let i = 0; i < newPixels.length; i++) {
            finalPixels[i] = Math.max(0, Math.min(255, Math.round(newPixels[i]))); // 截断并取整
        }

        let newPixbuf = GdkPixbuf.Pixbuf.new_from_data(
            finalPixels,
            GdkPixbuf.Colorspace.RGB,
            hasAlpha,
            8,
            width,
            height,
            rowstride,
            null,
            null
        );

        return newPixbuf;
    }

    static colorMix(color = { r: 0, g: 0, b: 0, a: 0.5 }, imagePath = "/tmp/vel-dynamic-panel-blurred-bg.jpg") {
        let pixbuf;
        try {
            pixbuf = GdkPixbuf.Pixbuf.new_from_file(imagePath);
        } catch (e) {
            return;
        }
        let width = pixbuf.get_width();
        let height = pixbuf.get_height();
        let hasAlpha = pixbuf.get_has_alpha();
        let rowstride = pixbuf.get_rowstride();
        let pixels = pixbuf.get_pixels();
        let newPixels = new Uint8Array(pixels.length);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let r, g, b, a = 0;
                let offset = (y * rowstride) + (x * (hasAlpha ? 4 : 3));

                r = pixels[offset];
                g = pixels[offset + 1];
                b = pixels[offset + 2];
                if (hasAlpha) {
                    a = pixels[offset + 3];
                }

                // 混合顏色，這裡使用簡單的 alpha 混合
                r = (1 - color.a) * r + (color.a * color.r);
                g = (1 - color.a) * g + (color.a * color.g);
                b = (1 - color.a) * b + (color.a * color.b);

                newPixels[offset] = Math.round(r);
                newPixels[offset + 1] = Math.round(g);
                newPixels[offset + 2] = Math.round(b);
                if (hasAlpha) {
                    newPixels[offset + 3] = Math.round(a);
                }
            }
        }

        let newPixbuf = GdkPixbuf.Pixbuf.new_from_data(
            newPixels,
            GdkPixbuf.Colorspace.RGB,
            hasAlpha,
            8,
            width,
            height,
            rowstride,
            null,
            null
        );

        return newPixbuf
    }
}