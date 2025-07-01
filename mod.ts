#!/usr/bin/env -S deno serve -A
import { Hono } from "hono";
import assert from "node:assert/strict";
import { serveStatic } from "hono/deno";
import data from "./data.json" with { type: "json" };
import arrayShuffle from "array-shuffle";
import { logger } from "hono/logger";
import { cors } from "hono/cors";

assert(data.length > 0, "No items found in data.json");

const data2 = data.map((item) => ({
  ...item,
  aspect_ratio: item.raw_width / item.raw_height,
}));

const app = new Hono();
export { app as default };

app.use(logger());

app.use("/", serveStatic({ path: "./index.md.html" }));

app.get("/favicon.ico", (c) => c.notFound());
app.get("/.well-known/*", (c) => c.notFound());
app.get("/robots.txt", (c) => c.notFound());
app.get("/sitemap.xml", (c) => c.notFound());
app.get("/llms.txt", (c) => c.notFound());

app.get("/:width/:height", cors(), (c) => {
  const width = Number.parseInt(c.req.param("width"));
  if (Number.isNaN(width)) {
    c.status(400);
    return c.text("Width must be a number.");
  }
  if (!(width >= 10 && width <= 4000)) {
    c.status(400);
    return c.text("Width must be between 10 and 4000 pixels.");
  }

  const height = Number.parseInt(c.req.param("height"));
  if (Number.isNaN(height)) {
    c.status(400);
    return c.text("Height must be a number.");
  }
  if (!(height >= 10 && height <= 4000)) {
    c.status(400);
    return c.text("Height must be between 10 and 4000 pixels.");
  }

  const requestedAspectRatio = width / height;
  const data3 = arrayShuffle(data2);
  const larger = data3
    .filter((item) => item.raw_height >= height && item.raw_width >= width);
  const bestFit = larger
    .reduce((prev, curr) => {
      const prevDiff = Math.abs(prev.aspect_ratio - requestedAspectRatio);
      const currDiff = Math.abs(curr.aspect_ratio - requestedAspectRatio);
      return currDiff < prevDiff ? curr : prev;
    });

  const destURL = new URL(bestFit.regular_url);
  destURL.searchParams.set("w", width.toString());
  destURL.searchParams.set("h", height.toString());
  destURL.searchParams.set("fit", "crop");
  destURL.searchParams.set("ar", `${width}:${height}`);
  return c.redirect(destURL, 302);
});
