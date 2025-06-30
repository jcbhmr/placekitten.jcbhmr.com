#!/usr/bin/env -S deno run -A
import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";

const maxLength = 1000;
const seen = new Set<string>();
const accumulated = [];

let page = 1;
loop: while (true) {
  const url = new URL(
    "https://unsplash.com/napi/search/photos?page=2&per_page=20&plus=none&query=kittens",
  );
  url.searchParams.set("page", page.toString());

  console.log(`Fetching ${url}...`);
  const response = await fetch(url);
  assert(response.ok, `${response.status} ${response.url}`);

  const json = await response.json();
  assert(typeof json === "object" && json != null);
  assert(Array.isArray(json.results));
  for (const result of json.results) {
    const rawWidth = result.width;
    assert(Number.isSafeInteger(rawWidth), `${rawWidth} is not a safe integer`);
    assert(rawWidth > 0, `${rawWidth} is not greater than 0`);

    const rawHeight = result.height;
    assert(
      Number.isSafeInteger(rawHeight),
      `${rawHeight} is not a safe integer`,
    );
    assert(rawHeight > 0, `${rawHeight} is not greater than 0`);

    assert(
      typeof result === "object" && result != null,
      `${JSON.stringify(result)} is not an object`,
    );
    assert(
      typeof result.urls === "object" && result.urls != null,
      `${JSON.stringify(result.urls)} is not an object`,
    );
    assert(
      typeof result.urls.regular === "string",
      `${JSON.stringify(result.urls.regular)} is not a string`,
    );
    const regularURL = new URL(result.urls.regular);

    assert(
      typeof result.links === "object" && result.links != null,
      `${JSON.stringify(result.links)} is not an object`,
    );
    assert(
      typeof result.links.html === "string",
      `${JSON.stringify(result.links.html)} is not a string`,
    );
    const htmlURL = new URL(result.links.html);

    if (seen.has(htmlURL.toString())) {
      console.warn(`Skipping duplicate ${htmlURL}`);
      continue;
    }
    seen.add(htmlURL.toString());

    accumulated.push({
      regular_url: regularURL,
      html_url: htmlURL,
      raw_width: rawWidth,
      raw_height: rawHeight,
    });
    console.log(`Added ${htmlURL} (${rawWidth}x${rawHeight})`);

    if (accumulated.length >= maxLength) {
      break loop;
    }
  }

  page++;

  await new Promise((resolve) => setTimeout(resolve, 1000));
}

await writeFile("data.json", JSON.stringify(accumulated, null, 2));
console.log(`Wrote ${accumulated.length} entries to data.json`);
