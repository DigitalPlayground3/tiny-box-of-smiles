# The Little Happiness Box

A small, private surprise website. Plain HTML, CSS and JavaScript. No backend, no login, no external requests.

```
little-happiness-box/
  index.html
  style.css
  script.js
  assets/
    favicon.svg
    fonts/   (Fraunces, Varela Round, Caveat, bundled so it works offline)
```

## Run it on your computer

Easiest: double-click `index.html`. It opens in your browser and works offline.

Or, to test it the way GitHub will serve it, open a terminal in this folder and run:

    python3 -m http.server 8000

Then visit http://localhost:8000

## Change a message

Open `script.js`. The four lists of messages are at the very top, under `MESSAGES`.
Edit, add or remove lines. The site shows every message once before repeating any.
The letter text is in `index.html`, inside `<article class="letter">`.

## Put it online with GitHub Pages (free)

1. On github.com, create a **new repository**. Choose a plain name that is hard to guess
   (not her name). Free GitHub Pages needs the repository to be **Public**.
2. Click **uploading an existing file** and drag in **the contents of this folder**
   (`index.html`, `style.css`, `script.js` and the `assets` folder).
   `index.html` must sit at the top level of the repository, not inside another folder.
   Click **Commit changes**.
3. Go to **Settings > Pages**. Under **Build and deployment**, set **Source** to
   **Deploy from a branch**, pick the **main** branch and the **/ (root)** folder, then **Save**.
4. Wait a minute or two. The address appears at the top of that page:
   `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`
5. Open it on a phone to check, then send her the link.

To update later, upload the changed file again and commit. The site refreshes in about a minute.

Privacy note: anyone who has the link can open the site. The page asks search engines not to list it
(`noindex`), but that is a request, not a lock.

## Fonts

Fraunces, Varela Round and Caveat are free under the SIL Open Font License.
