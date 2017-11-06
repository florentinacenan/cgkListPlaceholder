import * as React from 'react';
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
                iconProps: {
                  iconName: 'Pinned'
                },
                name: 'Save Site as Template'
              },
              {
                key: 'Upgrade Site',
                onClick: () => {
                  this.setState({ showCallout: true });
                },
                iconProps: {
                  iconName: 'Pinned'
                },
                name: 'Upgrade Site',
                title: 'Upgrade Site'
              },
              {
                key: 'Archive Site',
                iconProps: {
                  iconName: 'Package'                 
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
}