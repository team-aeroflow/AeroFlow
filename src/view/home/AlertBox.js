// // @flow 

// import React from 'react'
// import SweetAlert from 'sweetalert2-react'

// type State = {
//   show: boolean
// }

// type Props = {
//   show: boolean
// }

// class AlertBox extends React.Component<Props, State> {
//   // constructor(props: {}) {
//   //   super(props)
//   //   this.state = {
//   //     show: true,
//   //   }
//   // }

//   // static getDerivedStateFromProps(props, state) {
//   //    return {
//   //      show: true
//   //    }
//   //  }
//   componentDidUpdate(prevProps, prevState) {
//     console.log(prevProps, prevState)
//     const { onOpen } = prevProps
//     if(!prevProps.show) {
//       onOpen()
//     }
//     // if (!prevState.length) {
//     //   this.setState({ projects: this.state.projects })
//     // }
//   }
//   // handleClose() {
//   //   this.setState({ show: false })
//   // }

//   // handleShow() {
//   //   this.setState({ show: true })
//   // }

//   render() {
//     const { show, onConfirm, onOpen } = this.props
//     // console.log(show)
//     return (
//       <div>
//         {/* <button onClick={() => this.setState({ show: true })}>Alert</button> */}
//         <SweetAlert
//           show={show}
//           title="Demo"
//           text="SweetAlert in React"
//           // onConfirm={() => this.setState({ show: false })}
//           onConfirm={onConfirm}
//         />
//       </div>
//     );
//   }
// }

// export default AlertBox