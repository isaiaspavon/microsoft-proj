# 🚀 Azure Web Apps Deployment Guide

This guide will help you deploy your CloudInsight dashboard to Azure Web Apps for a production-ready hosting solution.

## 📋 Prerequisites

1. **Azure Account**: You'll need an active Azure subscription
2. **Azure CLI**: Install the Azure CLI for local deployment
3. **Git**: Ensure your project is in a Git repository
4. **Node.js**: Version 16 or higher

## 🔧 Step 1: Install Azure CLI

### Windows (PowerShell)
```powershell
# Download and install from Microsoft
winget install Microsoft.AzureCLI
# OR
choco install azure-cli
```

### macOS
```bash
brew install azure-cli
```

### Linux
```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

## 🔐 Step 2: Azure Authentication

```bash
# Login to Azure
az login

# Set your subscription (if you have multiple)
az account set --subscription "Your-Subscription-Name"
```

## 🏗️ Step 3: Create Azure Resources

### Create Resource Group
```bash
az group create --name cloudinsight-rg --location "East US"
```

### Create App Service Plan
```bash
# Free tier (F1) - good for testing
az appservice plan create --name cloudinsight-plan --resource-group cloudinsight-rg --sku F1

# OR Production tier (B1) - recommended for production
az appservice plan create --name cloudinsight-plan --resource-group cloudinsight-rg --sku B1
```

### Create Web App
```bash
# Create the web app
az webapp create --name cloudinsight-dashboard --resource-group cloudinsight-rg --plan cloudinsight-plan --runtime "NODE|18-lts"
```

## ⚙️ Step 4: Configure Environment Variables

```bash
# Set environment variables for your app
az webapp config appsettings set --name cloudinsight-dashboard --resource-group cloudinsight-rg --settings \
  NODE_ENV=production \
  PORT=8080 \
  WEBSITE_NODE_DEFAULT_VERSION=18.17.0
```

## 🔧 Step 5: Configure Build Settings

Create a `.deployment` file in your project root:

```ini
[config]
command = npm run build && npm start
```

## 📦 Step 6: Prepare Your App for Deployment

### Update package.json
Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "build": "cd client && npm install && npm run build",
    "start": "node server/index.js",
    "postinstall": "cd client && npm install"
  }
}
```

### Create web.config (for Windows hosting)
Create `web.config` in your project root:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <handlers>
      <add name="iisnode" path="server/index.js" verb="*" modules="iisnode" />
    </handlers>
    <rewrite>
      <rules>
        <rule name="NodeInspector" patternSyntax="ECMAScript" stopProcessing="true">
          <match url="^server/index.js\/debug[\/]?" />
        </rule>
        <rule name="StaticContent">
          <action type="Rewrite" url="client/build{REQUEST_URI}" />
        </rule>
        <rule name="DynamicContent">
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="True" />
          </conditions>
          <action type="Rewrite" url="server/index.js" />
        </rule>
      </rules>
    </rewrite>
    <security>
      <requestFiltering>
        <hiddenSegments>
          <remove segment="bin" />
        </hiddenSegments>
      </requestFiltering>
    </security>
    <httpErrors existingResponse="PassThrough" />
  </system.webServer>
</configuration>
```

## 🚀 Step 7: Deploy Your App

### Option A: Deploy from Local Git
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit"

# Add Azure remote
az webapp deployment source config-local-git --name cloudinsight-dashboard --resource-group cloudinsight-rg

# Get the git URL
az webapp deployment list-publishing-credentials --name cloudinsight-dashboard --resource-group cloudinsight-rg

# Add remote and push
git remote add azure <GIT_URL_FROM_ABOVE>
git push azure main
```

### Option B: Deploy from GitHub (Recommended)
```bash
# Connect to GitHub repository
az webapp deployment source config --name cloudinsight-dashboard --resource-group cloudinsight-rg --repo-url "https://github.com/yourusername/cloudinsight-dashboard" --branch main --manual-integration
```

## 🌐 Step 8: Access Your App

Your app will be available at:
```
https://cloudinsight-dashboard.azurewebsites.net
```

## 🔧 Step 9: Custom Domain (Optional)

```bash
# Add custom domain
az webapp config hostname add --webapp-name cloudinsight-dashboard --resource-group cloudinsight-rg --hostname "yourdomain.com"

# Configure SSL certificate
az webapp config ssl bind --certificate-thumbprint <THUMBPRINT> --ssl-type SNI --name cloudinsight-dashboard --resource-group cloudinsight-rg
```

## 📊 Step 10: Monitoring and Scaling

### Enable Application Insights
```bash
# Create Application Insights resource
az monitor app-insights component create --app cloudinsight-insights --location "East US" --resource-group cloudinsight-rg --application-type web

# Connect to your web app
az webapp config appsettings set --name cloudinsight-dashboard --resource-group cloudinsight-rg --settings \
  APPINSIGHTS_INSTRUMENTATIONKEY=<INSTRUMENTATION_KEY>
```

### Scale Your App
```bash
# Scale to multiple instances
az appservice plan update --name cloudinsight-plan --resource-group cloudinsight-rg --sku S1

# Set auto-scaling rules
az monitor autoscale create --resource-group cloudinsight-rg --resource cloudinsight-plan --resource-type Microsoft.Web/serverFarms --name cloudinsight-autoscale --min-count 1 --max-count 3 --count 1
```

## 🔒 Step 11: Security Best Practices

### Enable HTTPS Only
```bash
az webapp update --name cloudinsight-dashboard --resource-group cloudinsight-rg --https-only true
```

### Configure Authentication (Optional)
```bash
# Enable Azure AD authentication
az webapp auth update --name cloudinsight-dashboard --resource-group cloudinsight-rg --enabled true --action LoginWithAzureActiveDirectory
```

## 📈 Step 12: Performance Optimization

### Enable CDN
```bash
# Create CDN profile
az cdn profile create --name cloudinsight-cdn --resource-group cloudinsight-rg --sku Standard_Microsoft

# Add CDN endpoint
az cdn endpoint create --name cloudinsight-cdn-endpoint --profile-name cloudinsight-cdn --resource-group cloudinsight-rg --origin cloudinsight-dashboard.azurewebsites.net
```

## 🛠️ Troubleshooting

### Common Issues:

1. **Build Failures**: Check the build logs in Azure Portal
2. **Port Issues**: Ensure your app listens on `process.env.PORT`
3. **Environment Variables**: Verify all required env vars are set
4. **Node Version**: Ensure Azure supports your Node.js version

### View Logs:
```bash
# Stream logs
az webapp log tail --name cloudinsight-dashboard --resource-group cloudinsight-rg

# Download logs
az webapp log download --name cloudinsight-dashboard --resource-group cloudinsight-rg
```

## 💰 Cost Estimation

- **F1 (Free)**: $0/month - 1GB RAM, 60 minutes/day CPU
- **B1 (Basic)**: ~$13/month - 1.75GB RAM, unlimited CPU
- **S1 (Standard)**: ~$73/month - 1.75GB RAM, unlimited CPU, auto-scaling

## 🔄 Continuous Deployment

### GitHub Actions Workflow
Create `.github/workflows/azure-deploy.yml`:

```yaml
name: Deploy to Azure
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Set up Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: |
        npm install
        cd client && npm install
        
    - name: Build application
      run: npm run build
      
    - name: Deploy to Azure
      uses: azure/webapps-deploy@v2
      with:
        app-name: 'cloudinsight-dashboard'
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
```

## 🎉 Success!

Your CloudInsight dashboard is now deployed and accessible worldwide! 

### Next Steps:
1. Set up monitoring and alerts
2. Configure custom domains
3. Implement CI/CD pipelines
4. Set up backup and disaster recovery
5. Monitor costs and optimize

---

**Need Help?**
- [Azure Web Apps Documentation](https://docs.microsoft.com/en-us/azure/app-service/)
- [Azure CLI Documentation](https://docs.microsoft.com/en-us/cli/azure/)
- [Azure Support](https://azure.microsoft.com/en-us/support/)
