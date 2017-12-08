import * as React from 'react';import {
  SPHttpClient,
  SPHttpClientConfiguration,
  SPHttpClientResponse,
  HttpClient,
  HttpClientConfiguration,
  HttpClientResponse
} from '@microsoft/sp-http';
import { ContextualMenuItemType } from 'office-ui-fabric-react/lib/ContextualMenu';
import { Callout } from 'office-ui-fabric-react/lib/Callout';
import { DefaultButton, IconButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import {ICgkListUIButtonsProps, ICgkListUIButtonsState} from './ICgkListUIButtons';
import * as strings from 'CgkListPlaceholderApplicationCustomizerStrings';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';


export default class CGKListUIContextualMenuIconExample extends React.Component<ICgkListUIButtonsProps, ICgkListUIButtonsState> {

  constructor(props: ICgkListUIButtonsProps) {
    super(props);
    this.state = {
      showMessage: false,
      message:" ",
      cgkListStatus:props.cgkListStatus,
      greyButton:false,
      hasPermission: props.hasPermission,
    };
  }

 public verifyCgkListStatus(cgkListStatus):void{
switch(cgkListStatus)
{
  case 'actief':
    this.setState({ greyButton: false });
    return;
  case 'archief':
    this.setState({ greyButton: true });
    this.setState({ message: strings.SiteIsArchivedMessage });
    this.setState({ showMessage: true });
    console.log( strings.SiteIsArchivedMessage);
    return;
   

}

 }

  public render() {
    let { showMessage } = this.state;
    this.verifyCgkListStatus(this.props.cgkListStatus);
    if (this.state.hasPermission){
    return (
      <div>
        <DefaultButton
        
          id='ContextualMenuButton2'
          text = {strings.RootButton.toString()}
          menuProps={ {
            shouldFocusOnMount: true,
            items: [
              {
                key: strings.SaveButton,
                onClick: () => {
                  //this.setState({ showMessage: true });
                  this._callCGkListAzureEndpoint(this.props.context,this.props.cgkListUrlEndpoint,"GetSite");
                },
                iconProps: {
                  iconName: 'Pinned'
                },
                name: strings.SaveButton
              },
              {
                key: strings.UpgradeButton,
                onClick: () => {
                  //this.setState({ showMessage: true });
                  this._callCGkListAzureEndpoint(this.props.context,this.props.cgkListUrlEndpoint,"UpgradeSite");                  
                },
                iconProps: {
                  iconName: 'Pinned'
                },
                name: strings.UpgradeButton,
                
              },
              {
                key: strings.ArchiveButton,
                onClick: () => {
                  //this.setState({ showMessage: true });
                  this._callCGkListAzureEndpoint(this.props.context,this.props.cgkListUrlEndpoint,"ArchiveSite");
                },
                iconProps: {
                  iconName: 'Pinned'                 
                },
                name: strings.ArchiveButton,
                disabled: this.state.greyButton
              }             
            ]
          }
          }
        />
        { showMessage && (
          <MessageBar            
            onDismiss={ () => this.setState({ showMessage: false })} 
            onClick={ () => this.setState({ showMessage: false }) } >
            {this.state.message}}      
          </MessageBar>
        ) }
      </div>
    );
  }
  else{
    return (
      <div>        
        { showMessage && (
          <MessageBar            
            onDismiss={ () => this.setState({ showMessage: false })}>
            {this.state.message}}      
          </MessageBar>
        ) }
      </div>
    );

  }
  }

     private _callCGkListAzureEndpoint(context,cgkListUrl,action):void{
      console.log("Clicked "+action+" button");    
      var url = context.pageContext.web.absoluteUrl;    
      var restUrl = cgkListUrl + "webjob/"+action+"?fullurl="+url;
      var response;
      context.httpClient.get(restUrl, HttpClient.configurations.v1,{}).then((response: HttpClientResponse) => {
         if (response.ok) {
          this.setState({ message: strings.SuccessMessage });
          this.setState({ showMessage: true });
          console.log(strings.SuccessMessage);
      } 
        else {
        this.setState({ message: strings.FailMessage });
        this.setState({ showMessage: true });
        console.log(response.statusText + strings.FailMessage);
      }
      
   
  })
      .catch ((response: any) => {
      let errMsg: string = `${strings.FailMessage} ${restUrl}. Error = ${response.message}`;
      this.setState({ message: errMsg });
      this.setState({ showMessage: true });
      console.log(errMsg);
    });
                 
      
        } 
}