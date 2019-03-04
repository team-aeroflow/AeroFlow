import React from 'react'
import './Home.css'
import CreateProject from './CreateProject'
import { connect } from 'react-redux'
import { homeActions } from '../../state/home/actions'

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showDialog: false,
      isProject: true,
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.keydownHandler.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keydownHandler.bind(this));
  }

  keydownHandler(e) {
    // CMD + O, CTRL + O to open project
    if (((e.keyCode === 91 || e.metaKey) && e.keyCode === 79) || (e.ctrlKey && e.keyCode === 79)) { 
      this.props.openProject()
    }
  }

  isOpenNewProject() {
    this.setState(prevState => {
      return {
        ...prevState,
        showDialog: !this.state.showDialog
      }
    })
  }

  onOpenExistProjectClick() {
    this.props.openProject()
    // ipcRenderer.on('open-project-response', (event, arg) => {
    //   const { success } = arg
    //   if (!success) {
    //     console.log('This project not support')
    //     this.setState(prevState => {
    //       return {
    //         ...prevState,
    //         isProject: !this.state.isProject
    //       }
    //     })
    //     return;
    //   }
    //   router.navigate('dashboard')
    // })
  }

  render() {
    const { showDialog, isProject } = this.state
    return (
      <div>
        <button onClick={this.isOpenNewProject.bind(this)}>New Project</button>
        {showDialog ? <CreateProject /> : null}
        <div>__________</div>
        {!isProject ? "This project not support" : null}
        <button onClick={this.onOpenExistProjectClick.bind(this)}>Open Existing...</button>
      </div>
    )
  }
}

function mapStateToProps(staet) {
  return {

  }
}

function mapDispatchToProps(dispatch) {
  return {
    openProject: () => {
      dispatch(homeActions.openProject())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)