import { defineConfig }  from "vite";

export default defineConfig({
    // By default Vite writes asset paths like /assets/app.js, which would point at the bucket root. The app will live under blue/ or green/, so base: "./" makes the paths relative and works under either prefix.
    base: "./",
});