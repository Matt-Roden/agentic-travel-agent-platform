import { describe, it, expect, vi } from "vitest";

vi.mock("node:fs/promises", () => ({
  readFile: vi.fn(),
}));

describe("readPolicyFile", () => {
  it("returns the file contents as a string", async () => {
    const { readFile } = await import("node:fs/promises");
    const mockReadFile = vi.mocked(readFile);
    mockReadFile.mockResolvedValue("Lodging cap: $200/night");

    const { readPolicyFile } = await import("./policyService.js");
    const result = await readPolicyFile();

    expect(result).toBe("Lodging cap: $200/night");
  });

  it("throws when the file does not exist", async () => {
    const { readFile } = await import("node:fs/promises");
    const mockReadFile = vi.mocked(readFile);
    mockReadFile.mockRejectedValue(new Error("ENOENT: no such file or directory"));

    const { readPolicyFile } = await import("./policyService.js");

    await expect(readPolicyFile()).rejects.toThrow("ENOENT");
  });
});
