import { withSentryConfig } from "@sentry/nextjs";
import { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

import fs from "fs";
import path from "path";

const engines = [
  {
    version: "stockfish-16",
    src: "node_modules/stockfish-16/src",
    files: [
      "nn-5af11540bbfe.nnue",
      "stockfish-nnue-16.js",
      "stockfish-nnue-16-single.js",
      "stockfish-nnue-16-single.wasm",
      "stockfish-nnue-16.wasm"
    ]
  },
  {
    version: "stockfish-16.1",
    src: "node_modules/stockfish-16.1/src",
    files: [
      "stockfish-16.1.js",
      "stockfish-16.1-lite.js",
      "stockfish-16.1-lite-single.js",
      "stockfish-16.1-lite-single.wasm",
      "stockfish-16.1-lite.wasm",
      "stockfish-16.1-single.js",
      "stockfish-16.1-single.wasm",
      "stockfish-16.1.wasm"
    ]
  },
  {
    version: "stockfish-17",
    src: "node_modules/stockfish-17/src",
    files: [
      "stockfish-17.js",
      "stockfish-17-part-0.wasm",
      "stockfish-17-part-1.wasm",
      "stockfish-17-part-2.wasm",
      "stockfish-17-part-3.wasm",
      "stockfish-17-part-4.wasm",
      "stockfish-17-part-5.wasm",
      "stockfish-17-lite.js",
      "stockfish-17-lite.wasm"
    ]
  }
];

const enginesPublicDir = path.resolve("public/engines");

fs.mkdirSync(enginesPublicDir, { recursive: true });

fs.copyFileSync(
  path.resolve("node_modules/stockfish.js/stockfish.js"),
  path.join(enginesPublicDir, "stockfish-11.js")
);

engines.forEach(({ version, src, files }) => {
  const destDir = path.join(enginesPublicDir, version);
  fs.mkdirSync(destDir, { recursive: true });

  files.forEach((file) => {
    const srcFile = path.join(src, file);
    const destFile = path.join(destDir, file);

    if (fs.existsSync(srcFile)) {
      fs.copyFileSync(srcFile, destFile);
      console.log(`✅ Copied: ${file} → ${destDir}`);
    } else {
      console.warn(`⚠️ File not found: ${file}`);
    }
  });
});

console.log("🚀 Stockfish engines copied.");

const nextConfig = (phase: string): NextConfig => ({
  output: phase === PHASE_PRODUCTION_BUILD ? "export" : undefined,
  trailingSlash: false,
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  headers:
    phase === PHASE_PRODUCTION_BUILD
      ? undefined
      : async () => [
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
            source: "/engines/:blob*",
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
            source: "/play",
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
            source: "/database",
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

export default withSentryConfig(nextConfig, {
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
  org: process.env.SENTRY_ORG,
  project: "javascript-nextjs",
  widenClientFileUpload: true,
  reactComponentAnnotation: {
    enabled: true,
  },
  hideSourceMaps: true,
  disableLogger: true,
});
