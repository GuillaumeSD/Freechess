const { PHASE_PRODUCTION_BUILD } = require("next/constants");

const nextConfig = (phase) =>
  /** @type {import('next').NextConfig} */ ({
    output: phase === PHASE_PRODUCTION_BUILD ? "export" : undefined,
    trailingSlash: false,
    reactStrictMode: true,
    images: {
      unoptimized: true,
    },
    headers:
      phase === PHASE_PRODUCTION_BUILD
        ? undefined
        : () => [
            {
              source: "/",
              headers: [
                {
                  key: "Cross-Origin-Embedder-Policy",
                  value: "require-corp",
                },
                {
                  key: "Cross-Origin-Opener-Policy",
                  value: "same-origin",
                },
              ],
            },
            {
              source: "/engines/stockfish-wasm/stockfish-nnue-16.js",
              headers: [
                {
                  key: "Cross-Origin-Embedder-Policy",
                  value: "require-corp",
                },
                {
                  key: "Cross-Origin-Opener-Policy",
                  value: "same-origin",
                },
              ],
            },
          ],
  });

module.exports = nextConfig;
