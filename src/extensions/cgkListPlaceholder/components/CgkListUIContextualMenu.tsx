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


export default class CGKListUIContextualMenuIconExample extends React.Component<ICgkListUIButtonsProps, ICgkListUIButtonsState> {

  constructor(props: ICgkListUIButtonsProps) {
    super(props);
    this.state = {
      showCallout: false
    };
  }

  public render() {
    let { showCallout } = this.state;
    
    return (
      <div>
        <DefaultButton
        
          id='ContextualMenuButton2'
          text='CGKListUIFeatures'
          menuProps={ {
            shouldFocusOnMount: true,
            items: [
              {
                key: 'Save Site As Template',
                onClick: () => {
                  this._callCGkListAzureEndpoint(this.props.context,this.props.cgkListUrlEndpoint,"GetSite");
                },
                iconProps: {
                  iconName: 'Pinned'
                },
                name: 'Save Site as Template'
              },
              {
                key: 'Upgrade Site',
                onClick: () => {
                  this._callCGkListAzureEndpoint(this.props.context,this.props.cgkListUrlEndpoint,"UpgradeSite");
                },
                iconProps: {
                  iconName: 'Pinned'
                },
                name: 'Upgrade Site',
                title: 'Upgrade Site'
              },
              {
                key: 'Archive Site',
                onClick: () => {
                  this._callCGkListAzureEndpoint(this.props.context,this.props.cgkListUrlEndpoint,"ArchiveSite");
                },
                iconProps: {
                  iconName: 'Savings'                 
                },
                name: 'Archive Site'
              }             
            ]
          }
          }
        />
        { showCallout && (
          <Callout
            setInitialFocus={ true }
            // tslint:disable-next-line:jsx-no-lambda
            onDismiss={ () => this.setState({ showCallout: false }) }
          >
            <DefaultButton
              // tslint:disable-next-line:jsx-no-lambda
              onClick={ () => this.setState({ showCallout: false }) }
              text='Hello Popup'
            />
          </Callout>
        ) }
      </div>
    );
  }

 
        private _callCGkListAzureEndpoint(context,cgkListUrl,action):void{
    console.log("Clicked "+action+" button");    
    var url = context.pageContext.web.absoluteUrl;    
    var restUrl = cgkListUrl + "/webjob/"+action+"?fullurl="+url;
    context.httpClient.get(restUrl, HttpClient.configurations.v1,{}).then((response: HttpClientResponse) => {
            response.json().then((responseJSON: any) => {
              this.setState({ showCallout: true });
              console.log(responseJSON);
            });
    });
      }   
}