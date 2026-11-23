import { describe, expect, it } from "vitest";
import { isUnindexableDeploy } from "../src/data/site";

describe("placeholder deploy guard (odd/tasks/seo-gaps.md S1)", () => {
  it("blocks indexing of a deploy build without a real SITE_URL", () => {
    expect(isUnindexableDeploy({ DEPLOY_BUILD: "1" })).toBe(true);
    expect(isUnindexableDeploy({ DEPLOY_BUILD: "1", SITE_URL: "" })).toBe(true);
    expect(isUnindexableDeploy({ DEPLOY_BUILD: "1", SITE_URL: "https://example.com" })).toBe(true);
    expect(isUnindexableDeploy({ DEPLOY_BUILD: "1", SITE_URL: "not a url" })).toBe(true);
  });

  it("allows a deploy build with a real domain", () => {
    expect(isUnindexableDeploy({ DEPLOY_BUILD: "1", SITE_URL: "https://plexustyping.dev" })).toBe(false);
  });

  it("keeps local builds and tests unchanged", () => {
    expect(isUnindexableDeploy({})).toBe(false);
    expect(isUnindexableDeploy({ SITE_URL: "https://example.com" })).toBe(false);
  });
});
