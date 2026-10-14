// Truncates and modifies text that exceeds the maxLength.
export function truncate(text, maxLength) {
    if (text.length <= maxLength) {
        return text;
    }
    return text.slice(0, maxLength).trimEnd() + "...";
}