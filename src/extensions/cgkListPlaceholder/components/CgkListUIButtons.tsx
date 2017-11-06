import * as React from 'react';
import { DefaultButton, IconButton, IButtonProps} from 'office-ui-fabric-react/lib/Button';
import { Label } from 'office-ui-fabric-react/lib/Label';


const alertClicked = (): void => {
  alert('Clicked');
};

export default class CGKListUIButtonSplit extends React.Component<IButtonProps, {}> {
  public constructor() {
    super();
  }

  public render() {
    let { disabled, checked } = this.props;

    return (
      <div className='ms-BasicButtonsTwoUp'>
        <div>
          <Label>Standard</Label>
          <DefaultButton
            data-automation-id='test'
            disabled={ disabled }
            checked={ checked }
            text='Create account'
            onClick={ alertClicked }
            split={ true }
            style={ { height: '35px' } }
            menuProps={ {
              items: [
                {
                  key: 'emailMessage',
                  name: 'Email message',
                  icon: 'Mail'
                },
                {
                  key: 'calendarEvent',
                  name: 'Calendar event',
                  icon: 'Calendar'
                }
              ]
            } }
          />
        </div>        
      </div>
    );
  }
}


