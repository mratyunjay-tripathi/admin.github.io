import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchMembers } from '../src/store/actions/member';
import Edit from '../src/assets/edit.png';
import Trash from '../src/assets/trash.png';

class App extends Component {
  constructor(props) {
    super(props);
    this.keys = {
      name: "Name",
      email: "Email",
      role: "Role",
      actions: "Actions"
    }

    this.state = {
      members: []
    }
  }
  static getDerivedStateFromProps(props, current_state) {
    console.log("derieved state called", props.members, "current state", current_state);
    return {
      members: props.members.length > 0 ?
        props.members.slice(0,10) : current_state.members,
    }
  }

  componentDidMount = () => {
    this.props.fetchMembers();
  }

  render() {
    const { members } = this.state;
    console.log("members", members);
    return (

      <div className="flex flex-col flex-1  justify-center items-center px-10 py-10 xl:px-60 text-sm">
        <div className='divide-y w-full'>
          <div className="flex flex-row flex-1  p-4 space-x-4  font-medium w-full ">
            <div className="flex min-w-200 flex-1  items-center  ">
              <input type="checkbox" className="h-4 w-4 cursor-pointer"></input>
            </div>
            {Object.values(this.keys).map(v =>
              <div className="min-w-200 flex-1">{v}</div>)}
          </div>
          {members.map((member, index) =>

            <div className="flex flex-row flex-1  p-4 space-x-4 font-light w-full hover:bg-gray-200 cursor-pointer" key={index.toString()}>
              <div className="flex flex-1 items-center" key="first">
                <input type="checkbox" className="h-4 w-4 cursor-pointer"></input>
              </div>
              {Object.keys(this.keys).map((v, index) =>
                (member[v] ? <div className="flex-1 " key={index.toString()}><p>{member[v]}</p></div> : null))}
              <div className="flex flex-1 items-center" key="last">
                <img src={Edit} className="h-5 w-5"></img>
                <img src={Trash} className="ml-5 h-5 w-5"></img>
              </div>
            </div>
          )}
      <div className="flex flex-row flex-1  p-4 space-x-4  font-medium w-full ">
            <div className="flex min-w-200 flex-1  items-center  ">
              <button  className="bg-red-500 py-2 px-3 cursor-pointer rounded-2xl text-white shadow-md hover:shadow-sm"> Delete Selected</button>
            </div>
            {Object.values(this.keys).map(v =>
              <div className="min-w-200 flex-1">{v}</div>)}
          </div>

        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { members } = state;
  return {
    members
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchMembers: fetchMembers(dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
