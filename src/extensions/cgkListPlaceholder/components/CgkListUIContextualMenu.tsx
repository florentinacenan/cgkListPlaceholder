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
import { DefaultButton, IconButton, IButtonProps, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import {ICgkListUIButtonsProps, ICgkListUIButtonsState} from './ICgkListUIButtons';
import * as strings from 'CgkListPlaceholderApplicationCustomizerStrings';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';


export default class CGKListUIContextualMenuIconExample extends React.Component<ICgkListUIButtonsProps, ICgkListUIButtonsState> {

  constructor(props: ICgkListUIButtonsProps) {
    super(props);
    this.state = {
      showMessage: false,
      message:" ",
      greyButton:false,
      hasPermission: props.hasPermission,
      hideDialog:true,
    };
    
  }

  componentWillMount()
  {
    this._verifyCgkListStatus();
  }

 public _verifyCgkListStatus():void{
switch(this.props.cgkListStatus)
{
  case 'actief':
    this.setState({ greyButton: false });
    break;
  case 'archief':
    this.setState({ greyButton: true, message: strings.SiteIsArchivedMessage, showMessage: true });
    console.log( strings.SiteIsArchivedMessage);
    break;  
    default:
    this.setState({ greyButton: false });
    break;
}

 }

  public render() {
    let { showMessage } = this.state;
    let  {hideDialog }=this.state;
    //this.verifyCgkListStatus();
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
                  //this._callCGkListAzureEndpoint(this.props.context,this.props.cgkListUrlEndpoint,"GetSite");
                  this._showDialog()
                  //this.setState({ hideDialog: false });
                },
                iconProps: {
                  iconName: 'Pinned'
                },
                name: strings.SaveButton,
                disabled: this.state.greyButton
              },
              {
                key: strings.UpgradeButton,
                onClick: () => {
                  //this.setState({ showMessage: true });
                  // this._callCGkListAzureEndpoint(this.props.context,this.props.cgkListUrlEndpoint,"UpgradeSite");
                  this._showDialog()                  
                },
                iconProps: {
                  iconName: 'Pinned'
                },
                name: strings.UpgradeButton,
                disabled: this.state.greyButton
                
              },
              {
                key: strings.ArchiveButton,
                onClick: () => {
                  //this.setState({ showMessage: true });
                  //this._callCGkListAzureEndpoint(this.props.context,this.props.cgkListUrlEndpoint,"ArchiveSite");
                  this._showDialog()
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
        
        <Dialog
          hidden={ this.state.hideDialog }
          onDismiss={ this._closeDialog }
          dialogContentProps={ {
            type: DialogType.normal,
            title: 'Are you sure',
            subText: 'You are about to save this site as a template. To proceed click yes, to cancel click no'
          } }
          modalProps={ {
            titleAriaId: 'myLabelId',
            subtitleAriaId: 'mySubTextId',
            isBlocking: false,
            containerClassName: 'ms-dialogMainOverride'
          } }
        >
          
          <DialogFooter>
            <PrimaryButton onClick={ ()=>
            this._callCGkListAzureEndpoint(this.props.context,this.props.cgkListUrlEndpoint,"ArchiveSite")
              } text='Yes' />
            <DefaultButton onClick={ this._closeDialog } text='No' />
          </DialogFooter>
        </Dialog>
      
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

  @autobind
  private _showDialog() {
    this.setState({ hideDialog: false });
  }

  @autobind
  private _closeDialog() {
    this.setState({ hideDialog: true });
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
          this._closeDialog();
      } 
        else {
        this.setState({ message: strings.FailMessage });
        this.setState({ showMessage: true });
        this._closeDialog();
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