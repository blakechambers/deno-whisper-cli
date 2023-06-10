# Deno Whisper CLI

Deno Whisper CLI is a command-line interface tool that records audio using
`sox`, converts it into text via the OpenAI Whisper API, and copies the
resulting text to your clipboard for further use. This utility leverages local
tools such as `sox` for audio recording and `pbcopy` for transferring text to
the clipboard. An environment key is required to facilitate the translation
process. Currently, support for this tool has only been tested on the latest
versions of MacOS. While there's potential for future extensions to Windows,
there are no immediate plans for such support.

## Installation

You'll need `deno` and `sox` locally:

```bash
brew install deno
brew install sox
```

Then, make sure you have an `OPENAI_API_KEY` environment variable:

```bash
export OPENAI_API_KEY=your_openai_api_key
```

Then you can install via deno.land:

```bash
deno install \
--name your_custom_executable_name
--allow-env=OPENAI_API_KEY \
--allow-run=sox,pbcopy     \
--allow-read=./temp.wav      \
--allow-write=./temp.wav     \
--allow-net=api.openai.com \
https://deno.land/x/whisper_cli/cli.ts
```

From there, run:

```bash
your_custom_executable_name
```

## Usage

```bash
> deno run main.ts --help
```

## Future ideas

- add quiet option to configure the logger to not prompt as much
- detect stdout and route prompt text stderr
- accept an option to write content to a file (instead of requiring stdout)
- use a configurable temp directory to store the file
- enable/disable cleanup of the audio file
- colorize and organize output
