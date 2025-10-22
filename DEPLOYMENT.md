# AlphaTON Capital IR Website Configuration

## GitHub Pages Settings

This website is configured to deploy automatically to GitHub Pages using GitHub Actions.

### Deployment Configuration

- **Source**: GitHub Actions
- **Branch**: main
- **Workflow**: `.github/workflows/deploy.yml`
- **Custom Domain**: (if applicable)

### Required GitHub Repository Settings

1. Go to repository Settings
2. Navigate to Pages section
3. Set Source to "GitHub Actions"
4. The workflow will automatically deploy on push to main branch

### Custom Domain (Optional)

If you have a custom domain, add a `CNAME` file to the root directory:

```
your-domain.com
```

### Environment Variables

No environment variables are required for this static website deployment.

### Build Process

This is a static website that doesn't require a build process. All files are served directly from the repository.

### File Structure

The website follows a standard HTML structure:
- Root HTML files for each page
- `assets/` directory for all static resources
- No build artifacts or compiled files

### Troubleshooting

If deployment fails:
1. Check GitHub Actions logs
2. Verify all files are committed
3. Ensure no syntax errors in HTML/CSS/JS
4. Check file permissions and paths
