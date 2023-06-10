import { buildTask, main, OpenAI, signal } from "./deps.ts";
import { pbcopy } from "./pbcopy.ts";
const openAI = new OpenAI(Deno.env.get("OPENAI_API_KEY")!);

async function whisperCli() {
  const recordFileName = "temp.mp3";
  const confirmation = prompt("Confirm recording with 'y': ");

  if (confirmation !== "y") {
    console.log(
      `Expected 'y' but received '${confirmation}'. Program terminated.`,
    );
    Deno.exit(0);
  }

  console.log("Recording now! Press ctrl-c to stop...");

  const command = new Deno.Command("sox", {
    args: ["-d", recordFileName],
    stdout: "piped",
    stderr: "piped",
  });

  const soxProcess = command.spawn();

  const sig = signal("SIGUSR1", "SIGINT");

  for await (const _ of sig) {
    soxProcess.kill("SIGINT");

    break;
  }

  sig.dispose();

  const { code, stderr } = await soxProcess.output();

  if (code !== 0) {
    console.log("sox process failed: ", { code, stderr });
    Deno.exit(1);
  }

  console.log("Recording finished.  Sending to Whisper for transcription...");
  const transcription = await openAI.createTranscription({
    model: "whisper-1",
    file: `./${recordFileName}`,
  });

  console.log("Transcribed.  Copying to clipboard...");
  await pbcopy(transcription.text);

  console.log("Copied.  Deleting temp file...");
  await Deno.remove(recordFileName);
  console.log("done!");
}

const task = buildTask(whisperCli, (t) => {
  t.desc =
    "Transcribes spoken language into written text using OpenAI's Whisper API and copies it to the clipboard.";
});

export default whisperCli;
export { task };

if (import.meta.main) {
  main(task);
}
