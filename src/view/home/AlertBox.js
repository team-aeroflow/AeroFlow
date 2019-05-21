// @flow 

import React from 'react'
import SweetAlert from 'sweetalert2-react'

type Props = {
  alert: boolean,
  onOpen: () => void,
  onConfirm: () => void,
}

class AlertBox extends React.Component<Props, {}> {

  componentDidUpdate(prevProps: Props, prevState: {}) {
    console.log(prevProps, prevState)
    const { onOpen } = prevProps
    if(!prevProps.alert) {
      onOpen()
    }
  }

  render() {
    const { alert, onConfirm } = this.props

    return (
      <div>
        <SweetAlert
          show={alert}
          title="Oh my god!"
          text="Please choose project or This project is not supported :("
          onConfirm={onConfirm}
        />
      </div>
    )
  }
}

export default AlertBox