// Quick test to verify getPublicUrl works correctly
import { getPublicUrl, getStoragePath } from './lib/utils/screenshot-config.js';
import { generateUniqueFilename } from './lib/utils/filename-generator.js';

console.log('=== Testing Screenshot URL Generation ===\n');

// Test 1: Generate filename
const filename = generateUniqueFilename('post_1');
console.log('1. Generated filename:', filename);

// Test 2: Get storage path
const storagePath = getStoragePath(filename);
console.log('2. Storage path:', storagePath);

// Test 3: Get public URL
const publicUrl = getPublicUrl(filename);
console.log('3. Public URL:', publicUrl);

// Test 4: Expected format
console.log('\n=== Expected Results ===');
console.log('Storage path should be: public/screenshots/[filename].png');
console.log('Public URL should be: /screenshots/[filename].png');

console.log('\n=== Actual Results ===');
console.log('Storage path:', storagePath);
console.log('Public URL:', publicUrl);

// Test 5: Verify format
const isCorrectFormat = publicUrl.startsWith('/screenshots/') && publicUrl.endsWith('.png');
console.log('\n=== Validation ===');
console.log('URL format correct?', isCorrectFormat ? '✅ YES' : '❌ NO');

if (!isCorrectFormat) {
    console.error('ERROR: Public URL format is incorrect!');
    console.error('Expected: /screenshots/[filename].png');
    console.error('Got:', publicUrl);
}
