import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';
import { SPPermission } from '@microsoft/sp-page-context';
import {
  SPHttpClient,
  SPHttpClientConfiguration,
  SPHttpClientResponse,
  HttpClient,
  HttpClientConfiguration,
  HttpClientResponse
} from '@microsoft/sp-http';
import { SPComponentLoader } from '@microsoft/sp-loader';
import styles from './AppCustomizer.module.scss';
import { loadStyles } from '@microsoft/load-themed-styles'; 
import { escape } from '@microsoft/sp-lodash-subset';
import * as $ from 'jquery';
//import * as bootstrap from 'bootstrap';
//import * as dropdown from 'bootstrap';
// require('../../../node_modules/jquery/dist/jquery.min.js');
//require('../../../node_modules/bootstrap/dist/js/bootstrap.min.js');
//require('../../../node_modules/bootstrap/js/dropdown.js');
//SPComponentLoader.loadScript('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js', { globalExportsName: 'jQuery' }).then((jQuery: any): void => {
// SPComponentLoader.loadScript('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js',  { globalExportsName: 'jQuery' }).then((): void => {        
      // });
    //});
//SPComponentLoader.loadCss('https://publiccdn.sharepointonline.com/techmikael.sharepoint.com/11510075fe4212d19d3e6d07c91981263dd697bf111cb1e5f0efb15de0ec08b382cde399/5.0.1/office-ui-fabric.min.css');
SPComponentLoader.loadCss('https://appsforoffice.microsoft.com/fabric/2.2.0/fabric.components.min.css');
//SPComponentLoader.loadCss('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css');
import * as strings from 'CgkListPlaceholderApplicationCustomizerStrings';
//import * as React from 'react';
//import * as ReactDOM from 'react-dom';
//import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
//import * as fabric from 'office-ui-fabric';
//import { DefaultButton, IconButton, IButtonProps,  PrimaryButton, CommandButton, Button, Label } from 'office-ui-fabric-react';
//import { DefaultButton } from 'office-ui-fabric/lib/Button';

const LOG_SOURCE: string = 'CgkListPlaceholderApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ICgkListPlaceholderApplicationCustomizerProperties {
  // This is an example; replace with your own property
 Top : string;
}



/** A Custom Action which can be run during execution of a Client Side Application */
export default class CgkListPlaceholderApplicationCustomizer
  extends BaseApplicationCustomizer<ICgkListPlaceholderApplicationCustomizerProperties> {

 private _topPlaceholder: PlaceholderContent | undefined;
  

  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);
    var cgkListUrl; 
    //Check the Permissions and webProperties
    console.log('The web template for this site is: ' + this.context.pageContext.web.templateName.toString());
    console.log('This user has ManageWeb permission on this web: ' + this.context.pageContext.web.permissions.hasPermission(SPPermission.manageWeb));
    this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/AllProperties?$select=CGKListQueueEndpoint`,
      SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        response.json().then((responseJSON: any) => {
          console.log(responseJSON);
          if (this.context.pageContext.web.permissions.hasPermission(SPPermission.manageWeb) && responseJSON['CGKListQueueEndpoint'] != null) {
            cgkListUrl = responseJSON['CGKListQueueEndpoint'];
            // Added to handle possible changes on the existence of placeholders.
            //this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders;            
            // Call render method for generating the HTML elements.
            this._renderPlaceHolders(cgkListUrl);

          }
        });
      });


    return Promise.resolve<void>();
  }

  private _renderPlaceHolders(cgkListUrl): void {


    console.log('CGKListHeaderApplicationCustomizer._renderPlaceHolders()');
    console.log('Available placeholders: ',
      this.context.placeholderProvider.placeholderNames.map(name => PlaceholderName[name]).join(', '));

    // Handling the top placeholder
    if (!this._topPlaceholder) {
      this._topPlaceholder =
        this.context.placeholderProvider.tryCreateContent(
          PlaceholderName.Top,
          { onDispose: this._onDispose });

      // The extension should not assume that the expected placeholder is available.
      if (!this._topPlaceholder) {
        console.error('The expected placeholder (Top) was not found.');
        return;
      }

      if (this._topPlaceholder.domElement) {
        this._topPlaceholder.domElement.innerHTML = `
              <div class="${styles.app}">
                <div class="ms-bgColor-themeDark ms-fontColor-white ms-Grid-row ${styles.top}">
                  
                  
                          <button class="ms-Button ms-Grid-col ms-sm6 ms-md4 ms-lg2" id="saveSiteBtn"> 
                                    <span class="ms-Button-label">Save as template</span>
                                    <span class="ms-Button-description">Saves current CGKList Site as a template</span> 
                          </button>
                          <button class="ms-Button ms-Grid-col ms-sm6 ms-md4 ms-lg2" id="upgradeSiteBtn"> 
                                    <span class="ms-Button-label">Upgrade Site</span>
                                    <span class="ms-Button-description">Upgrades current CGKList Site</span> 
                          </button>
								          <button class="ms-Button ms-Grid-col ms-sm6 ms-md4 ms-lg2" id="archiveSiteBtn"> 
                                    <span class="ms-Button-label">Archive Site</span>
                                    <span class="ms-Button-description">Archives current CGKList Site</span> 
                          </button>
                                 
                                
                  </div>
                </div>`;
                this._topPlaceholder.domElement.querySelector('#saveSiteBtn').addEventListener('click', ()=>{this._saveSite(cgkListUrl);});
                this._topPlaceholder.domElement.querySelector('#upgradeSiteBtn').addEventListener('click', ()=>{this._upgradeSite(cgkListUrl);});
                this._topPlaceholder.domElement.querySelector('#archiveSiteBtn').addEventListener('click', ()=>{this._archiveSite(cgkListUrl);});
                
      }      
    }

  }
  private _saveSite(cgkListUrl):void{
console.log("Clicked Save button");
var action = "GetSite";
var url = this.context.pageContext.web.absoluteUrl;    
var restUrl = cgkListUrl + "/webjob/"+action+"?fullurl="+url;
this.context.httpClient.post(restUrl, HttpClient.configurations.v1,{}).then((response: HttpClientResponse) => {
        response.json().then((responseJSON: any) => {
          console.log(responseJSON);
        });
});
  }
    private _upgradeSite(cgkListUrl):void{
console.log("Clicked Upgrade button");
var action = "UpgradeSite";
var url = this.context.pageContext.web.absoluteUrl;    
var restUrl = cgkListUrl + "/webjob/"+action+"?fullurl="+url;
this.context.httpClient.post(restUrl, HttpClient.configurations.v1,{}).then((response: HttpClientResponse) => {
        response.json().then((responseJSON: any) => {
          console.log(responseJSON);
        });
});
  }
    private _archiveSite(cgkListUrl):void{
console.log("Clicked Archive button");
var action = "ArchiveSite";
var url = this.context.pageContext.web.absoluteUrl;    
var restUrl = cgkListUrl + "/webjob/"+action+"?fullurl="+url;
this.context.httpClient.post(restUrl, HttpClient.configurations.v1,{}).then((response: HttpClientResponse) => {
        response.json().then((responseJSON: any) => {
          console.log(responseJSON);
        });
});
  }  
  

// jQuery('#saveSiteBtn').on('click', function(event) {
//   event.preventDefault(); // To prevent following the link (optional)
//  console.log("Clicked Save button");
//   var restUrl = cgkListUrl;
//   this.context.HttpClient
// });
// jQuery('#upgradeSiteBtn').on('click', function(event) {
//   event.preventDefault(); // To prevent following the link (optional)
//  console.log("Clicked Upgrade button");
// });
// jQuery('#archiveSiteBtn').on('click', function(event) {
//   event.preventDefault(); // To prevent following the link (optional)
//  console.log("Clicked Archive button");
// });

 // }
  private _onDispose(): void {
    console.log('[CgkListPlaceholderApplicationCustomizer._onDispose] Disposed custom top and bottom placeholders.');
  }

}
