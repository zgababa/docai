# DocAi

DocAi is a tool that allows you to automatically generate markdown-formatted documentation for your code.

## Prerequisites

Your code will be sent to ChatGPT; ensure that you have the rights to do so.

## Installation

```bash
npm install --save-dev docai
```

## Usage Examples:

### Module

To document only some files:

```javascript
import docai from 'docai'

await docai({
  openAi: {
    apiKey: 'YOUR_OPENAI_API_KEY'
  },
  outputDir: './generated',
  files: ['./test2.ts', './test.js']
})
```

To document your entire project, provide an entrypoint:

```javascript
await docai({
  openAi: {
    apiKey: 'YOUR_OPENAI_API_KEY'
  },
  outputDir: './generated',
  entryPoint: './index.js'
})
```

To document routes from your serverless project:

```javascript
await docai({
  openAi: {
    apiKey: 'YOUR_OPENAI_API_KEY'
  },
  outputDir: './generated',
  serverlessEntryPoint: './serverless.yml'
})
```

### Optional Options

- `baseDir`: Defaults to the current directory. Otherwise, provide the directory path.
- `openAi.temperature`: Temperature setting for the used model (0 by default).
- `openAi.modelName`: Name of the OpenAI model to be used (defaults to gpt-4). [List here.](#)
- `deleteTmpFolder`: Flag to decide whether or not to delete the temporary folder.
- `tmpFolderPath`: Path for the temporary folder.

### CLI

Minimal Configuration:
Run these commands at the root of your project:

```bash
OPENAI_API_KEY="YOUR_API_KEY" docai --output ./documentation --entrypoint ./src/index.js
```

For a serverless project:

```bash
OPENAI_API_KEY="YOUR_API_KEY" docai --output ./documentation --modelName chatgpt --serverless ./serverless.yml
```

Specifying a model:

```bash
OPENAI_API_KEY="YOUR_API_KEY" docai --output ./documentation --modelName gpt-3.5-turbo --entrypoint ./src/index.js
```

### Parameters:

- `entrypoint`: Entry point of your application. (Required)
- `serverless`: Path to the serverless.yml file for parsing routes in serverless projects. (Required)
- `output`: Destination folder path. (Required)
- `baseDir`: Defaults to the current directory. Otherwise, provide the directory path. (Optional)
- `temperature`: Temperature setting for the used model (0 by default). (Optional)
- `modelName`: Name of the OpenAI model to be used (defaults to gpt-4). [List here.](https://platform.openai.com/docs/guides/text-generation) (Optional)
- `noDeleteTmp`: Flag to decide whether or not to delete the temporary folder. (Optional)
- `tmpFolderPath`: Path for the temporary folder. (Optional)

### Environment Variables:

Only the `OPENAI_API_KEY` environment variable is required. It will be loaded automatically with the dotenv package if present in a .env file.

## Examples

You can examine the code found in \_mock/test/raw/src and compare it to the documented version in \_mock/test/generated/src.

## Upcoming Features:

- Templating.
- Support for multiple LLMs.
- Multiple entry points.
- Multilingual capabilities.
- Frontend application documentation.
- ...

## Feedback and Contribution:

We value your feedback and contributions! If you encounter any issues or have suggestions for improvements, please feel free to submit an issue on our [GitHub repository](https://github.com/zgababa/docai).
