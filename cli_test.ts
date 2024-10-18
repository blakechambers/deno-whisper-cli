import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import whisperCli from "./cli.ts"; // Adjusted import

Deno.test("whisperCli exits when confirmation is not 'y'", async () => {
  // Mock the prompt function to return 'n'
  const originalPrompt = globalThis.prompt;
  globalThis.prompt = (_message?: string, _defaultValue?: string) => "n";

  // Mock Deno.exit to capture the exit code
  const originalExit = Deno.exit;
  let exitCode: number | null = null;
  Deno.exit = (code?: number) => {
    exitCode = code ?? 0;
    throw new Error("Process exited");
  };

  try {
    await whisperCli();
  } catch (error) {
    // Expected error due to Deno.exit
    if (error instanceof Error && error.message !== "Process exited") {
      throw error;
    }
  } finally {
    // Restore the original functions
    globalThis.prompt = originalPrompt;
    Deno.exit = originalExit;
  }

  assertEquals(exitCode, 0, "Expected exit code to be 0");
});
