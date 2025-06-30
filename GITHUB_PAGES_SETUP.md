# GitHub Pages Setup Instructions

## 🔧 Repository Settings Required

After pushing your code to GitHub, you need to configure GitHub Pages:

### 1. Enable GitHub Pages
1. Go to your repository on GitHub: `https://github.com/script-hermit/bookShelves`
2. Click on **Settings** tab
3. Scroll down to **Pages** section (left sidebar)
4. Under **Source**, select **GitHub Actions**
5. Save the settings

### 2. Set Repository Permissions (Important!)
1. Still in repository **Settings**
2. Go to **Actions** → **General** (left sidebar)
3. Under **Workflow permissions**, select:
   - ✅ **Read and write permissions**
   - ✅ **Allow GitHub Actions to create and approve pull requests**
4. Click **Save**

### 3. Add Environment Variables (Optional)
If you want Google Books search functionality:
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `VITE_GOOGLE_BOOKS_API_KEY`
4. Value: Your Google Books API key
5. Click **Add secret**

### 4. Trigger Deployment
1. Make any commit to the `main` branch
2. Push to GitHub
3. Check **Actions** tab to see the deployment progress
4. Your site will be available at: `https://script-hermit.github.io/bookShelves/`

## 🚨 Common Issues & Solutions

### Issue: "Permission denied to github-actions[bot]"
**Solution**: Make sure you've enabled "Read and write permissions" in Actions settings (step 2 above).

### Issue: "404 Not Found" on deployed site
**Solution**: 
- Check that GitHub Pages source is set to "GitHub Actions"
- Verify the base path in `vite.config.ts` matches your repository name

### Issue: Blank page after deployment
**Solution**: 
- Check browser console for errors
- Verify all assets are loading correctly
- Make sure Firebase config is accessible

### Issue: Build fails
**Solution**:
- Check the Actions tab for detailed error logs
- Ensure all dependencies are properly listed in package.json
- Verify TypeScript compilation passes locally

## 🎉 Success Indicators

✅ Green checkmark in Actions tab
✅ Site accessible at GitHub Pages URL
✅ All functionality works (authentication, book search, drag & drop)
✅ Mobile responsive design

## 📱 Mobile Access

Once deployed, your bookshelf will be accessible from any device at:
`https://script-hermit.github.io/bookShelves/`

You can bookmark this URL or add it to your phone's home screen for quick access!
