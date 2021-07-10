import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchMembers, deleteSelected } from '../src/store/actions/member';
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
      searchValue: "",
      members: [],
      start: 1,
      end: 10,
      maxPages: 1,
      docLength: 0,
      selectedIndex: 1,
      selectedRecords: {}
    }
  }


  componentDidMount = () => {
    this.props.fetchMembers().then(() =>
      this.setData(this.props.members));
  }

  searchValue = (e) => {
    const { searchValue } = this.state;

    if (e.keyCode === 13) {
      console.log("search value", searchValue, e.keyCode);

      if (searchValue !== "") {
        const results = this.props.members.filter((member) => {
          return member.name.toUpperCase().includes(searchValue.toUpperCase()) ||
            member.email.toUpperCase().includes(searchValue.toUpperCase()) ||
            member.role.toUpperCase().includes(searchValue.toUpperCase());
        })
        this.setData(results);
      } else {
        this.setData(this.props.members);
      }
    }
  }

  setData = (results) => {
    const maxPages = Math.ceil(results.length / 10);
    const docLength = results.length;
    this.setState({
      maxPages, docLength, members: results, start: docLength === 0 ? 0 : 1,
      end: docLength <= 10 ? docLength : 10,
      selectedRecords: {}
    })
  }

  pages = () => {
    const { maxPages, selectedIndex } = this.state;
    const buttonPages = [];
    for (let i = 1; i <= maxPages; i++) {
      const newButton = <button className={`w-10 h-10 font-md cursor-pointer rounded-full shadow-lg hover:shadow-sm border-blue-500 mr-5 ${i === selectedIndex ? 'bg-white text-blue-500 border-2' : 'text-white bg-blue-500'}`} onClick={() => this.navigate(i)}>{i} </button>;

      buttonPages.push(newButton);

    }
    return buttonPages;
  }

  navigate = (page) => {
    if (page > 0) {
      const offset = (page - 1) * 10;
      this.setState({ selectedIndex: page, start: 1 + offset, end: 10 + offset });
    }
  }

  nextPage = () => {
    const { selectedIndex, maxPages } = this.state;
    if (selectedIndex < maxPages) {
      this.navigate(selectedIndex + 1);
    }
  }

  prevPage = () => {
    const { selectedIndex } = this.state;
    if (selectedIndex >= 2) {
      this.navigate(selectedIndex - 1);
    }
  }

  firstPage = () => {
    const { docLength, selectedIndex } = this.state;
    if (docLength > 0 && selectedIndex !== 1)
      this.navigate(1);
  }

  lastPage = () => {
    const { maxPages, selectedIndex } = this.state;
    if (maxPages !== 0 && selectedIndex !== maxPages)
      this.navigate(maxPages);
  }

  selectOne = (member) => {
    const { selectedRecords, selectedIndex } = this.state;

    const update = selectedRecords[selectedIndex] ? { ...selectedRecords[selectedIndex] } : {};
    if (!update[member.id]) {
      update[member.id] = true;
    } else {
      delete update[member.id];
    }
    const newUpdate = { ...selectedRecords };
    newUpdate[selectedIndex] = update;
    this.setState({ selectedRecords: newUpdate });
  }

  selectAll = () => {
    const { members, selectedIndex, start, end, selectedRecords } = this.state;
    if (this.checkSelectedRecord()) {
      const { ...update } = selectedRecords;
      delete update[selectedIndex];
      this.setState({ selectedRecords: update });
    } else {
      const records = {};
      members.slice(start - 1, end).map((member) => {
        records[member.id] = true;
      })
      const update = { ...selectedRecords };
      update[selectedIndex] = records;
      this.setState({ selectedRecords: update });
    }
  }

  currentPageLength = () => {
    const { start, end, members } = this.state;
    return members.slice(start - 1, end).length;
  }

  checkSelectedRecord = () => {
    const { selectedRecords, selectedIndex, start, end, members } = this.state;
    const records = selectedRecords[selectedIndex];

    if (records) {
      return Object.keys(records).length === this.currentPageLength() ? true : false;
    } else {
      return false;
    }
  }

  isSelected = (member) => {
    const { selectedRecords, selectedIndex } = this.state;
    return selectedRecords[selectedIndex] && selectedRecords[selectedIndex][member.id] ? true : false;
  }

  deleteSelected = () => {
    this.props.deleteSelected(this.state.selectedRecords);
  }

  render() {
    const { members, start, end } = this.state;

    return (

      <div className="flex flex-col flex-1  justify-center items-center px-10 py-10 xl:px-60 text-sm">

        <div className="flex  flex-1 w-full items-center justify-center ">
          <input type="text" placeholder="Search by name, email or role"
            className="flex-1 p-2 border-2 focus:border-blue"
            onChange={(e) => this.setState({ searchValue: e.target.value })}
            onKeyDown={this.searchValue}
          >
          </input>
        </div>
        <div className='divide-y w-full'>
          <div className="flex flex-row flex-1  p-4 space-x-4  font-medium w-full ">
            <div className="flex min-w-200 flex-1  items-center  ">
              <input type="checkbox" className="h-4 w-4 cursor-pointer " onClick={this.selectAll} checked={this.checkSelectedRecord()}></input>
            </div>
            {Object.values(this.keys).map(v =>
              <div className="min-w-200 flex-1">{v}</div>)}
          </div>
          {members.slice(start - 1, end).map((member, index) =>
            <div className={`flex flex-row flex-1  p-4 space-x-4 font-light w-full hover:bg-gray-200 cursor-pointer ${this.isSelected(member) ? 'bg-gray-200' : 'bg-white'}`} key={index.toString()}
              onClick={() => this.selectOne(member)}>
              <div className="flex flex-1 items-center" key="first" >
                <input type="checkbox" className="h-4 w-4 cursor-pointer" checked={this.isSelected(member)}></input>
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
            <div className="flex min-w-200  items-center  ">
              <button className=" w-100 h-10 bg-red-500 py-2 px-3 cursor-pointer rounded-3xl text-white shadow-md hover:shadow-sm" onClick={this.deleteSelected}> Delete Selected</button>
            </div>

            <div className="flex  flex-1 items-center justify-center ">
              <button className="w-10 h-10 bg-white  cursor-pointer rounded-full text-gray-500 shadow-lg hover:shadow-sm hover:bg-white hover:text-blue-500  hover:border-blue-500 border-2 
              mr-5 text-xl" onClick={this.firstPage}> {"<<"}</button>
              <button className="w-10 h-10 bg-white  cursor-pointer rounded-full text-gray-500 shadow-lg hover:shadow-sm hover:bg-white hover:text-blue-500  hover:border-blue-500 border-2 text-xl mr-5"
                onClick={this.prevPage}> {"<"}</button>

              {this.pages()}

              <button className="w-10 h-10 bg-blue-500  cursor-pointer rounded-full text-white shadow-lg hover:shadow-sm hover:bg-white hover:text-blue-500  hover:border-blue-500 border-2 text-xl mr-5"
                onClick={this.nextPage}>{">"} </button>
              <button className="w-10 h-10 bg-blue-500  cursor-pointer rounded-full text-white shadow-lg hover:shadow-sm hover:bg-white hover:text-blue-500  hover:border-blue-500 border-2 text-xl mr-5"
                onClick={this.lastPage}>{">>"} </button>
            </div>
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
    fetchMembers: fetchMembers(dispatch),
    deleteSelected: deleteSelected(dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
