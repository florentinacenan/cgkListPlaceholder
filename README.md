## cgk-list-placeholder

```
Before deploying the solution you need to update following files to match your environment variables:
/config/write-manifests.json
        update value for "cdnBasePath" to match your CDN
/gulpfile-upload-to-sharepoint.js
        this task uploads the neccessary files to your Office365 CDN
        you need to update the environmentInfo for this file 
/gulpfile-upload-app-package.js
        this task uploads the App Package to your App Catalog Site
        you need to update the environmentInfo for this file 
/gulpfile-deploy-app-package.js
        this task deploys you app package
        you need to update the environmentInfo for this file 
      
```
### Building the code

```bash
git clone the repo
npm i
npm i -g gulp
gulp
```

This package produces the following:

* lib/* - intermediate-stage commonjs build artifacts
* dist/* - the bundled script, along with other resources
* deploy/* - all resources which should be uploaded to a CDN.

### Build options
```
gulp clean - TODO
gulp test - TODO
gulp serve - TODO
gulp bundle - TODO
gulp package-solution - TODO
```

##Debbugging URL
gulp serve --nobrowser
?loadSPFX=true&debugManifestsFile=https://localhost:4321/temp/manifests.js&customActions={"fc6643c2-2726-4643-a921-4b2ff8746f25":{"location":"ClientSideExtension.ApplicationCustomizer","properties":{}}}

##Deploy to SharePoint
```
gulp bundle --ship
gulp package-solution --ship
gulp upload-to-sharepoint --ship
gulp upload-app-pkg
gulp deploy-sppkg
```
##PS Script to add Web Property to SPO Web for testing:
```
$webUrl = "https://cgk.sharepoint.com/sites/devflorentina/dutch"
$username = "florentinac@cgk.onmicrosoft.com"
$password = Read-Host -Prompt "Enter your password: " -AsSecureString
$ctx = New-Object Microsoft.SharePoint.Client.ClientContext($webUrl)
$ctx.Credentials = New-Object Microsoft.SharePoint.Client.SharePointOnlineCredentials($username,$password)
$allProperties = $ctx.Site.RootWeb.AllProperties
$ctx.Load($allProperties)
$ctx.ExecuteQuery()
$allProperties['CGKListQueueEndpoint']= "https://dummyAzureEndpointUrl"
$ctx.Site.RootWeb.Update()
$ctx.ExecuteQuery()
```

##Steps to host extension from CDN
https://docs.microsoft.com/en-us/sharepoint/dev/spfx/extensions/get-started/hosting-extension-from-office365-cdn