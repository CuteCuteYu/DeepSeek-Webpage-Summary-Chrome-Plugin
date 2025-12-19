# DeepSeek Webpage Summary Chrome Extension

[中文版本 (Chinese Version)](readme-zh.md)

## Features

This Chrome browser extension can automatically identify the content of the current webpage and generate a Chinese summary through the DeepSeek API, helping users quickly understand the core content of the webpage.

## Installation

1. Download or clone this project to your local machine
2. Open Chrome browser and go to the extensions management page (chrome://extensions/)
3. Enable "Developer mode" (usually in the top right corner of the page)
4. Click "Load unpacked extension" and select the folder where this project is located
5. After successful installation, the extension icon will appear in the top right corner of the Chrome browser

## Usage

1. On first use, click the extension icon and enter your DeepSeek API Key in the pop-up interface
2. Navigate to the webpage you want to summarize
3. Click the extension icon, then click the "Summarize current page" button
4. Wait a few seconds, and the extension will display the Chinese summary result of the webpage

## API Key Management

- You must enter an API Key when using it for the first time
- You can modify the API Key through the extension options page
- Please visit the DeepSeek official website to obtain your own API Key

## Technical Principles

1. **Content Extraction**: The extension uses the `content.js` script to extract the main text content of the webpage, filtering out irrelevant elements such as scripts, styles, and advertisements
2. **API Call**: The `background.js` script calls the DeepSeek API, sending the extracted content to the API server
3. **Result Display**: After the API returns the summary result, it is displayed to the user in `popup.html`

## Notes

- The extension requires internet access to call the DeepSeek API
- To protect your API Key security, the extension uses Chrome's secure storage mechanism to save the API Key
- The extension only works on the currently active tab
- For very long webpages, the extension will automatically truncate the content and only send the first 5000 characters to the API

## File Structure

```
├── manifest.json      # Extension configuration file
├── background.js      # Background script, handles API requests
├── content.js         # Webpage content extraction script
├── popup.html         # Extension popup interface
├── popup.js           # Popup interface logic
├── options.html       # Options page for API Key management
├── options.js         # Options page logic
├── README.md          # English documentation
└── readme-zh.md       # Chinese documentation
```

## Browser Compatibility

- Chrome browser 88.0+ (supports Manifest V3)

## Update Log

### v1.0.0 (2025-12-19)
- Initial version release
- Implemented automatic webpage content extraction
- Integrated DeepSeek API for Chinese summarization
- Added API Key management

## Contact

If you have any questions or suggestions, please feel free to raise an Issue or Pull Request.