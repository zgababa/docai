# DocAi

DocAi is a tool that allows you to automatically generate markdown-formatted documentation for your code.

## Prerequisites

Your code gonna be send to ChatGPT, ensure that you have rights to do so.

## Installation

```bash
npm install --save-dev docai
```

## Usage Examples:

**Minimal Configuration:**

Run these commands at the root of your project

```bash
OPENAI_API_KEY="YOUR_API_KEY" docai --output ./documentation --entrypoint ./src/index.js
```

**For Serverless project:**

```bash
OPENAI_API_KEY="YOUR_API_KEY" docai --output ./documentation --modelName chatgpt --serverless ./serverless.yml
```

**Specifying a model:**

```bash
OPENAI_API_KEY="YOUR_API_KEY" docai --output ./documentation --modelName gpt-3.5-turbo --entrypoint ./src/index.js
```

## Parameters:

- `entrypoint`: Entry point of your application. (Required)
- `serverless`: If present, it should contain the path to the `serverless.yml` file and will parse it to fetch your routes. (Required)
- `output`: Destination folder path. (Required)
- `baseDir`: Defaults to the current directory, otherwise, provide the directory path. (Optional)
- `temperature`: Temperature setting for the used model (0 by default). (Optional)
- `modelName`: Name of the OpenAI model to be used (default to `gpt-4`). List [here](https://platform.openai.com/docs/guides/gpt). (Optional)
- `noDeleteTmp`: Flag to decide whether or not to delete the temporary folder. (Optional)
- `tmpFolderPath`: Path for the temporary folder. (Optional)
- `files`: Files from this array will be generated into markdown documentation. However the documentation generated will be less precise that with an entrypoint, it's because only files from this array will be documented, and context from import contained into "child" files will not be parsed. Not available with CLI.

## Environment Variables:

Only the `OPENAI_API_KEY` environment variable is required. You can provide it via the command line, or if it's present in a `.env` file, it will be loaded automatically with the package `dotenv`.

## Examples

You can examine the code found in `_mock/test/raw/src` and compare it to the documented version in `_mock/test/generated/src`.

## Upcoming Features:

- Templating.
- Support for multiple LLMs.
- Multiple entry points.
- Multilingual capabilities.
- Frontend application documentation.
- ...

## Feedback and Contribution:

We value your feedback and contributions! If you encounter any issues or have suggestions for improvements, please feel free to submit an issue on our GitHub repository.
