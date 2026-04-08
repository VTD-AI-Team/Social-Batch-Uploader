// Hashtag validation

import { MANDATORY_HASHTAGS, ValidationResult, ValidationStatus } from '@/types';
import { logger } from '../utils/logger';

export function validateHashtags(content: string): Pick<ValidationResult, 'isValid' | 'missingHashtags'> {
    const missingHashtags: string[] = [];

    for (const hashtag of MANDATORY_HASHTAGS) {
        if (!content.includes(hashtag)) {
            missingHashtags.push(hashtag);
        }
    }

    const isValid = missingHashtags.length === 0;

    if (!isValid) {
        logger.debug(`Missing hashtags: ${missingHashtags.join(', ')}`);
    }

    return {
        isValid,
        missingHashtags
    };
}

export function getHashtagStatus(hasAllHashtags: boolean, isPrivate: boolean, isDuplicate: boolean, hasError: boolean): ValidationStatus {
    if (hasError) {
        return ValidationStatus.ERROR;
    }
    if (isPrivate) {
        return ValidationStatus.PRIVATE;
    }
    if (isDuplicate) {
        return ValidationStatus.DUPLICATE;
    }
    if (!hasAllHashtags) {
        return ValidationStatus.MISSING_HASHTAGS;
    }
    return ValidationStatus.COMPLETE;
}
