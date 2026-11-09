// Feature Flags
// Flags are read once at startup so behavior can't change mid-run.
// Unset or any value other than "true" means the feature is off.
export const features = {
    createTask: process.env.FEATURE_CREATE_TASK === "true",
}