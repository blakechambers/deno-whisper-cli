// accepts a stringand writes to it to the clipboard via pbcopy
async function pbcopy(text: string) {
  const command = new Deno.Command("pbcopy", {
    stdin: "piped",
  });

  const process = command.spawn();
  const writer = process.stdin.getWriter();

  writer.write(new TextEncoder().encode(text));
  await writer.close();

  await process.output();
}

export { pbcopy };
