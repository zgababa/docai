# DocAi

DocAi is a tool that allows you to automatically generate markdown-formatted documentation for your code.

## Installation

```bash
npm install --save-dev docai
```

## External LLM Mode

### Prerequisites

Your code will be sent to an external provider; ensure that you have the rights to do so.

### Usage Examples

### Module

To document only some files:

```javascript
import docai from 'docai'

await docai({
  llm: {
    apiKey: 'YOUR_API_KEY'
    modelProvider: 'mistral' | 'openAI' | 'groq'
    modelName: 'mistral-tiny' | 'gpt-4' | ...
  },
  outputDir: './generated',
  files: ['./test2.ts', './test.js']
})
```

To document your entire project, provide an entrypoint:

```javascript
await docai({
  llm: {
    apiKey: 'YOUR_API_KEY'
    modelProvider: 'mistral' | 'openAI' | 'groq'
    modelName: 'mistral-tiny' | 'gpt-4' | ...
  },
  outputDir: './generated',
  entryPoint: './index.js'
})
```

To document routes from your serverless project:

```javascript
await docai({
  llm: {
    apiKey: 'YOUR_API_KEY'
    modelProvider: 'mistral' | 'openAI'| 'groq'
    modelName: 'mistral-tiny' | 'gpt-4' | ...
  },
  outputDir: './generated',
  serverlessEntryPoint: './serverless.yml'
})
```

### Optional Options

- `baseDir`: Defaults to the current directory. Otherwise, provide the directory path.
- `llm`:
  - `temperature`: Temperature setting for the used model (0 by default).
- `deleteTmpFolder`: Flag to decide whether or not to delete the temporary folder.
- `tmpFolderPath`: Path for the temporary folder.

### CLI

Minimal Configuration:
Run these commands at the root of your project:

```bash
API_KEY="YOUR_API_KEY" docai --output ./documentation --entrypoint ./src/index.js --modelProvider openAI --modelName gpt-3.5-turbo
```

or with Mistral

```bash
API_KEY="YOUR_API_KEY" docai --output ./documentation --entrypoint ./src/index.js --modelProvider mistral --modelName mistral-tiny
```

or with Groq

```bash
API_KEY="YOUR_API_KEY" docai --output ./documentation --entrypoint ./src/index.js --modelProvider groq --modelName mixtral-8x7b-32768
```

For a serverless project:

```bash
API_KEY="YOUR_API_KEY" docai --output ./documentation --modelProvider openAI --modelName gpt-3.5-turbo --serverless ./serverless.yml
```

### Parameters:

- `entrypoint`: Entry point of your application. (Required)
- `serverless`: Path to the serverless.yml file for parsing routes in serverless projects. (Required)
- `output`: Destination folder path. (Required)
- `modelName`: Name of the LLM model to use. (Required)
- `modelProvider`: Name of the LLM Provider to use - openAI, mistral, groq. (Required)
- `baseDir`: Defaults to the current directory. Otherwise, provide the directory path. (Optional)
- `temperature`: Temperature setting for the used model (0 by default). (Optional)
- `noDeleteTmp`: Flag to decide whether or not to delete the temporary folder. (Optional)
- `tmpFolderPath`: Path for the temporary folder. (Optional)

### Environment Variables:

Only the `API_KEY` environment variable is required.

## Local Mode

You can run DocAi in local, with [Ollama](https://github.com/ollama/ollama).

Please follow instructions from the Ollama documentation to install and run a model.

### Usage :

Open a terminal tab, and run a model with [Ollama](https://github.com/ollama/ollama).

Ex: `ollama run llama2`

Then run DocAI with _CLI_ or _Module_

#### CLI

```bash
docai --output ./documentation --entrypoint ./src/index.js --modelName llama2 --local --baseUrl http://localhost:11434
```

### Parameters:

- `entrypoint`: Entry point of your application. (Required)
- `serverless`: Path to the serverless.yml file for parsing routes in serverless projects. (Required)
- `output`: Destination folder path. (Required)
- `local`: Flag to local mode. (Required)
- `modelName`: Name of the LLM model to use. (Required)
- `baseDir`: Defaults to the current directory. Otherwise, provide the directory path. (Optional)
- `baseUrl`: Ollama REST API endpoint, default to http://localhost:11434 (Optional)

#### Module

```javascript
import docai from 'docai'

 await docai({
   local: {
     modelName: 'llama2'
     baseUrl: 'http://localhost:11434' // default value, optional field
   },
   outputDir: './generated',
   files: ['./test2.ts', './test.js']
 })
```

Note: If you work in local mode, you can not pass llm object parameter.

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
