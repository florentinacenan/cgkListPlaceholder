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
import * as strings from 'CgkListPlaceholderApplicationCustomizerStrings';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Icon, IconType } from 'office-ui-fabric-react/lib/Icon';
import CGKListUIButtonSplit from './components/CgkListUIButtons';
import CGKListUIContextualMenuIconExample from './components/CgkListUIContextualMenu';
import { IButtonProps} from 'office-ui-fabric-react/lib/Button';
import {ICgkListUIButtonsProps} from "./components/ICgkListUIButtons";

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
        const element: React.ReactElement<ICgkListUIButtonsProps> = React.createElement(
          CGKListUIContextualMenuIconExample,
          {
            context: this.context
          }
        );
        ReactDOM.render(element, this._topPlaceholder.domElement);
      }      
    }

  }
  private _saveSite(cgkListUrl):void{
console.log("Clicked Save button");
var action = "GetSite";
var url = this.context.pageContext.web.absoluteUrl;    
var restUrl = cgkListUrl + "/webjob/"+action+"?fullurl="+url;
this.context.httpClient.get(restUrl, HttpClient.configurations.v1,{}).then((response: HttpClientResponse) => {
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
this.context.httpClient.get(restUrl, HttpClient.configurations.v1,{}).then((response: HttpClientResponse) => {
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
this.context.httpClient.get(restUrl, HttpClient.configurations.v1,{}).then((response: HttpClientResponse) => {
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


