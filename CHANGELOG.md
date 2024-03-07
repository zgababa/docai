# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.1.0] - 2024-03-07

### Added

- Support for using Groq for document generation. This allows users to choose groq for content generation by specifying `groq` as the `modelProvider`.

## [2.0.0] - 2024-02-26

### Added

- Support for using Mistral as an alternative to ChatGPT for document generation. This allows users to choose Mistral for content generation by specifying `mistral` as the `modelProvider`.

### Changed

- **Breaking Change**: `modelName` is now required. The previous default value of `gpt-4` has been removed to encourage users to explicitly specify the model they wish to use.
- **Breaking Change**: `modelProvider` is required. Users must choose between `mistral` and `openAI` as the model provider. This change aims to clarify the source of the language model being used and to offer more flexibility.
- The `openAi` configuration has been deleted and replaced with a new `llm` structure, which includes `apiKey` for specifying your API key, and `modelProvider` and `modelName` for defining the model provider and model name, respectively. This approach streamlines the configuration for better consistency and ease of use.

### Deprecations

- The `openAi` object is officially deprecated and replaced by `llm` for better representation of the language model configuration.

### Environment Updates

- The `OPEN_API_KEY` environment variable has been renamed to `API_KEY` for the CLI version, to standardize the naming of environment variables and clarify their use.
