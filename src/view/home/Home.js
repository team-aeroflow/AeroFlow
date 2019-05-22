// @flow
import React from 'react'
import { connect } from 'react-redux'
import { homeActions } from '../../state/home/actions'
import CreateProject from './CreateProject'
import AlertBox from './AlertBox'
import './Home.css'

type State = {
  showDialog: boolean,
  isProject: boolean,
  alert: boolean,
  showCreateProject: boolean,
}

type Props = {
  status: Object,
  openProject: () => void,
}

class Home extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      showDialog: false,
      isProject: true,
      alert: true,
      showCreateProject: false,
    }
  }

  componentDidMount() {
    // อย่าลืมเอาออก
    // this.props.openProject()

    document.addEventListener('keydown', this.keydownHandler.bind(this), false)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keydownHandler.bind(this), false)
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
  }

  onOpen() {
    this.setState({
      alert: true
    })
  }

  onConfirm() {
    this.setState({
      alert: false,
    })
  }

  handleShow() {
    this.setState({
      showCreateProject: true
    })
  }

  handleClose() {
    this.setState({
      showCreateProject: false
    })
  }

  render() {
    const { showDialog, isProject, alert, showCreateProject } = this.state
    const { success } = this.props.status

    return (
      <div className="home">
        <span id="span-head">Aero Flow</span>
        <div className="home-block">
          <button id="create-project"
            onClick={this.handleShow.bind(this)}
          >
            New Project
        </button>
          {showCreateProject ?
            <CreateProject handleClose={this.handleClose.bind(this)}
              show={showCreateProject}
            />
            : null}
          {/* <div></div> */}
            <hr className="line"></hr>
          {!success ?
            <AlertBox onOpen={this.onOpen.bind(this)}
              onConfirm={this.onConfirm.bind(this)}
              alert={alert}
            />
            : null}
          <button id="open-project"
            onClick={this.onOpenExistProjectClick.bind(this)}
          >
            Open Existing...
        </button>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { status } = state.home
  return {
    status,
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