import { isValidTitle, TITLE_MAX_LENGTH } from "./validate-title";

describe('isValidTitle', () => {
    // Equivalence partitioning: one representative per class
    describe('equivalence partitioning', () => {
        it('accepts a typical title (valid partition)', () => {
            expect(isValidTitle('Buy groceries')).toBe(true);
        });
    
        it('rejects an empty string (invalid partition: empty)', () => {
            expect(isValidTitle('')).toBe(false);
        });
    
        it('rejects whitespace only (invalid partition: blank)', () => {
            expect(isValidTitle('   ')).toBe(false);
        });
    });
});

// Boundary value analysis: values at and next to each boundary
describe('boundary values', () => {
    it.each([
        [0, false], // just below lower bound
        [1, true], // lower bound
        [TITLE_MAX_LENGTH, true], // upper bound
        [TITLE_MAX_LENGTH + 1, false], // just above upper bound
    ])('title of length %i -> %s', (length, expected) => {
        expect(isValidTitle('a'.repeat(length))).toBe(expected)
    });
});