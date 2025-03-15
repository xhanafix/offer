# Product/Service Offer Generator

A web-based tool that generates compelling product or service offers using the Value Stack and Valuable Bonus formula. This tool helps marketers and business owners create persuasive offers that highlight the value of their products.

## Features

- **Value Stack Formula**: Automatically creates a stack of valuable items/features with price values in RM
- **Valuable Bonus**: Adds a compelling bonus offer to increase perceived value
- **Bilingual Support**: Generate offers in English or Bahasa Malaysia
- **Dark/Light Mode**: Toggle between dark and light themes
- **Copy to Clipboard**: Easily copy the generated offer for use in marketing materials
- **Responsive Design**: Works on desktop and mobile devices

## How to Use

1. Enter your product or service name
2. Input the approximate price in RM (Malaysian Ringgit)
3. Select your preferred language (English or Bahasa Malaysia)
4. Enter your OpenRouter API key
5. Click "Generate Offer"
6. Review the generated offer
7. Copy the offer or regenerate if needed

## API Integration

This tool uses the OpenRouter API to connect to the `google/learnlm-1.5-pro-experimental:free` model. To use the generator:

1. Sign up for an account at [OpenRouter.ai](https://openrouter.ai)
2. Generate an API key from your dashboard
3. Copy and paste the API key into the "OpenRouter API Key" field
4. Your API key is stored in your browser's local storage for convenience

## Installation

No installation required! Simply open the `index.html` file in a web browser.

For developers:
1. Clone this repository
2. Open `index.html` in your browser
3. No build process or dependencies required

## Privacy

- Your API key is stored locally in your browser and is never sent to our servers
- The product/service information is only sent to the OpenRouter API for generating the offer

## Changelog

### Version 1.2.0 (Current)
- Added dark mode toggle
- Added price values in RM for value stack items
- Optimized JavaScript code for better performance
- Improved error handling

### Version 1.1.0
- Added Bahasa Malaysia language support
- Added price input field
- Improved UI responsiveness
- Added local storage for language preference

### Version 1.0.0
- Initial release
- Basic offer generation functionality
- Copy to clipboard feature
- OpenRouter API integration

## License

MIT License - Feel free to use, modify, and distribute this code for personal or commercial purposes. 