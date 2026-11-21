<div align="center">

<br/>

<table>
<tr>
<td align="center" width="100%">

### 🏆 Project Sponsor

**[Ads.extension.vn](https://ads.extension.vn)**

*An advertising platform for browser extensions that helps extension developers monetize their products. Sponsor of Cookie Editor.*

<br/>

[![Visit Ads.extension.vn](https://img.shields.io/badge/Ads.extension.vn-Visit-6366f1?style=for-the-badge)](https://ads.extension.vn)

</td>
</tr>
</table>

<br/>

---

</div>

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

💡 This build ships without ads: the sidebar ad banner, the wetab.org ad
script and the "No Ads" upsell have been removed. The premium upgrade
prompt for the extension's own paid tier is still present.

## Install

### Install on Google Chrome

Find this extension on the [Chrome Web Store.](https://chromewebstore.google.com/detail/cookie-editor/ookdjilphngeeeghgngjabigmpepanpl)

### Install on Firefox

The extension is not published on Firefox Add-ons (AMO) yet, so install it as a temporary add-on from a local build (Firefox 140+ required). Full details, including how to submit it to AMO, are in [FIREFOX.md](FIREFOX.md).

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
git clone git@github.com:buigiathanh/Cookie_Editor.git
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
Website: [https://cookieeditor.org](https://cookieeditor.org)
