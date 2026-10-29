// Returns true if the dueDate is less than current day; otherwise return false.
export function isOverdue(dueDate) {
    const today = new Date().toLocaleDateString("en-CA");
    return dueDate < today;
}