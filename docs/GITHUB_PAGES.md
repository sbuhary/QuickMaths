# GitHub Pages Deployment

QuickMaths is a static site. Publish the repository root from the `main` branch.

## Steps
1. Push this repository to GitHub.
2. Open the repository on GitHub.
3. Go to **Settings**.
4. In the sidebar, open **Pages**.
5. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
6. Set **Branch** to `main` and the folder to `/(root)`.
7. Click **Save**.
8. Open the Pages URL after GitHub finishes the deployment run.

## Screenshot References
GitHub keeps the current UI screenshots in its official Pages documentation:
- Settings tab screenshot: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-from-a-branch
- Branch and folder dropdown screenshots: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-from-a-branch

## Notes
- GitHub Pages looks for an `index.html` file at the top level of the selected publishing source.
- The `.nojekyll` file is included so GitHub Pages serves the static files directly.
- The app cache version is tracked in `assets/js/version.js`; keep the query strings in `index.html` aligned with that value.
