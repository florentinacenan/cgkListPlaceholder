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
//import CGKListUIButtonSplit from './components/CgkListUIButtons';
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
    var tenantRoot = this.context.pageContext.site.absoluteUrl.replace(this.context.pageContext.site.serverRelativeUrl,"");
    console.log(tenantRoot);
    this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/AllProperties?$select=CGK_WEBCONNECTION`,
      SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        response.json().then((responseJSON: any) => {
          console.log(responseJSON);
          if (this.context.pageContext.web.permissions.hasPermission(SPPermission.manageWeb) && responseJSON['CGK_x005f_WEBCONNECTION'] != null) {
            // cgkListUrl = responseJSON['CGK_x005f_WEBCONNECTION'];

            this.context.spHttpClient.get(tenantRoot + `/_api/web/AllProperties?$select=CGKListQueueEndpoint`,
            SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse) => {
              response.json().then((responseJSON: any) => {
                console.log(responseJSON);
                if (responseJSON['CGKListQueueEndpoint'] != null) {
                  console.log(responseJSON['CGKListQueueEndpoint']);
                  cgkListUrl = responseJSON['CGKListQueueEndpoint'];
                  // Added to handle possible changes on the existence of placeholders.
                  //this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders;            
                  // Call render method for generating the HTML elements.
                  this._renderPlaceHolders(cgkListUrl);
      
                }
              });
            }); 



            // Added to handle possible changes on the existence of placeholders.
            //this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders;            
            // Call render method for generating the HTML elements.
            // this._renderPlaceHolders(cgkListUrl);

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
            context: this.context,
            cgkListUrlEndpoint: cgkListUrl

          }
        );
        ReactDOM.render(element, this._topPlaceholder.domElement);
      }      
    }

  }



  private _onDispose(): void {
    console.log('[CgkListPlaceholderApplicationCustomizer._onDispose] Disposed custom top and bottom placeholders.');
  }

}


