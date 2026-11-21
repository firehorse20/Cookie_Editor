

<br/>

# Cookie-Editor

## Description

Cookie Editor – Manage, Edit & Secure Your Cookies Easily

Cookie Editor is a powerful yet easy-to-use tool designed for seamless cookie management. Whether you're a developer testing web pages or need manual control over cookies for privacy reasons, this extension provides all the essential cookie operations in a simple interface.

⚠️ Stay Safe! Never share your cookies with anyone you don’t trust. Cookies can store sensitive data, including login credentials. If someone gains access to your cookies, they may take full control of your account.

🔹 Key Features of Cookie Editor:

✅ View all cookies for the current tab

✅ Search, create, edit, and delete cookies effortlessly

✅ Import and export cookies in multiple formats (JSON)

✅ Instantly clear all cookies for the current tab

✅ Support customizing Clear browsing data

💡 This build ships without ads and without the original author's
account, upgrade and donation prompts: the sidebar ad banner, the
wetab.org ad script, the "No Ads" upsell, the paid upgrade prompts,
the Buy Me a Coffee button, the account login and the cookie-link
sharing feature have all been removed. Usage analytics are not
collected either.

## Install

### Install on Google Chrome

Find this extension on the [Chrome Web Store.](https://chromewebstore.google.com/detail/cookie-editor/ookdjilphngeeeghgngjabigmpepanpl)

### Install on Firefox

The extension is submitted to Firefox Add-ons (AMO) and awaiting review: https://addons.mozilla.org/firefox/addon/cookie-editor-firefox/ — until it is listed there, install it as a temporary add-on from a local build (Firefox 140+ required), or grab the zip from [Releases](https://github.com/firehorse20/Cookie_Editor/releases). Full details are in [FIREFOX.md](FIREFOX.md).

1. Build the Firefox package:
   ```bash
   npm install
   npm run build:firefox
   ```
   This produces the `dist-firefox/` folder.
2. In Firefox, open `about:debugging#/runtime/this-firefox`.
3. Click **Load Temporary Add-on…** and select any file inside `dist-firefox/` (for example `dist-firefox/manifest.json`).
4. Click the Cookie Editor toolbar icon (or the sidebar icon) to open it in the Firefox sidebar.

> ⚠️ Temporary add-ons are removed when Firefox restarts — repeat step 3 after a restart, or install the signed `.xpi` from AMO once it is published there. Your cookies and settings are not affected by reinstalling.

## How to build

```bash
git clone https://github.com/firehorse20/Cookie_Editor.git
cd Cookie_Editor
```

```bash
npm install
```

```bash
# Chrome / Edge (output: dist/)
npm run build:extension

# Firefox (output: dist-firefox/)
npm run build:firefox
```

## Info
Project: [https://github.com/firehorse20/Cookie_Editor](https://github.com/firehorse20/Cookie_Editor)
