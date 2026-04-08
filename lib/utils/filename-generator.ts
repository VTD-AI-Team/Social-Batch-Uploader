// Generate unique filenames with timestamp + random 6-character suffix

export function generateUniqueFilename(prefix: string = 'screenshot'): string {
    const timestamp = Date.now();
    const randomSuffix = generateRandomString(6);
    return `${prefix}_${timestamp}_${randomSuffix}.png`;
}

function generateRandomString(length: number): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export function getScreenshotPath(filename: string): string {
    return `/screenshots/${filename}`;
}

export function getFullScreenshotPath(filename: string): string {
    return `public/screenshots/${filename}`;
}
