// @flow
import React from 'react'
import './Home.css'
import CreateProject from './CreateProject'
import { connect } from 'react-redux'
import { homeActions } from '../../state/home/actions'

type State = {
  showDialog: boolean,
  isProject: boolean,
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

  render() {
    const { showDialog, isProject } = this.state
    const { success } = this.props.status

    return (
      <div>
        <button onClick={this.isOpenNewProject.bind(this)}>New Project</button>
        {showDialog ? <CreateProject /> : null}
        <div>__________</div>
        {!success ? "This project not support" : null}
        <button onClick={this.onOpenExistProjectClick.bind(this)}>Open Existing...</button>
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