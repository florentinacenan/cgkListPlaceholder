import ApplicationCustomizerContext from "@microsoft/sp-application-base/lib/extensibility/ApplicationCustomizerContext";
import {IButtonProps} from 'office-ui-fabric-react/lib/Button';


export interface ICgkListUIButtonsProps 
{ 
    context: ApplicationCustomizerContext;
    cgkListUrlEndpoint: string;
    cgkListStatus:string;
    hasPermission: boolean;
}

export interface ICgkListUIButtonsState {
    showMessage: boolean ;
    message:string;
    // cgkListStatus:string;
    greyButton:boolean;
    hasPermission: boolean;
    hideDialog:boolean;
  }
  