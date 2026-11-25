// Feature Flags
// Flags are read once at startup so behavior can't change mid-run.
// Unset or any value other than "true" means the feature is off.
//
// To add a flag:
//   1. Add an entry here:  myFeature: process.env.FEATURE_MY_FEATURE === "true",
//   2. Add FEATURE_MY_FEATURE=false to .env.example
//   3. Add FEATURE_MY_FEATURE=false to vitest.config.ts
//   4. Gate the route:     if (features.myFeature) { router.post(...) }
//   5. Delete all four once the feature is finished.
export const features = {
};