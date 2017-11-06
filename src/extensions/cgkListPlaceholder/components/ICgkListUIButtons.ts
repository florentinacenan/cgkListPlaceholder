import ApplicationCustomizerContext from "@microsoft/sp-application-base/lib/extensibility/ApplicationCustomizerContext";
import {IButtonProps} from 'office-ui-fabric-react/lib/Button';


export interface ICgkListUIButtonsProps 
{ 
    context: ApplicationCustomizerContext;
}

export interface ICgkListUIButtonsState {
    showCallout: boolean ;
  }
  