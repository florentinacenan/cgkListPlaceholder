import ApplicationCustomizerContext from "@microsoft/sp-application-base/lib/extensibility/ApplicationCustomizerContext";
import {IButtonProps} from 'office-ui-fabric-react/lib/Button';


export interface ICgkListUIButtonsProps 
{ 
    context: ApplicationCustomizerContext;
    cgkListUrlEndpoint: string;
}

export interface ICgkListUIButtonsState {
    showMessage: boolean ;
  }
  