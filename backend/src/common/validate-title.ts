export const TITLE_MAX_LENGTH = 255;

/**
 * Checks whether a task title is valid (FR1: title required).
 *
 * @param title - raw title as received from the client
 * @returns true if the trimmed title is 1..TITLE_MAX_LENGTH characters
 */
export function isValidTitle(title: string): boolean {
    const trimmed = title.trim();
    return trimmed.length >= 1 && trimmed.length <= TITLE_MAX_LENGTH;
}