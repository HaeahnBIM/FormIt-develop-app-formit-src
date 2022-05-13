import React from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import ButtonGroup from "@mui/material/ButtonGroup";
import CustomerDelete from "./CustomerDelete";
import CustomerEdit from "./CustomerEdit";

class Project extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      cd: "",
      name: "",
    };

    //this.handleFormSubmit = this.handleFormSubmit.bind(this);
    //this.handleFileChange = this.handleFileChange.bind(this);
    //this.handleValueChange = this.handleValueChange.bind(this);
    //this.addCustomer = this.addCustomer.bind(this);
    //this.handleClickOpen = this.handleClickOpen.bind(this);
    //this.handleClose = this.handleClose.bind(this);
  }

  handleRetrieve(e) {
    e.preventDefault();
    let _content = null;
    _content = <div>lkjkjoi[j[iofwHEOFhwefp</div>;

    this.setState({
      content: _content,
    });
  }

  handleClick = (e, id, name) => {
    e.preventDefault();
    //let _content = null;
    //_content = <div>lkjkjoi[j[iofwHEOFhwefp</div>;

    //this.setState({
    //  content: _content,
    //});

    //return () => {
    //console.log(`You clicked on row with id ${id}, in column ${name}.`);
    //};
    this.props.onRowClick(e, id, name);
  };

  render() {
    return (
      <TableRow name="row" key={this.props.id}>
        <TableCell
          key={this.props.id}
          onClick={(event) => {
            this.handleClick(event, this.props.id, this.props.name);
          }}
        >
          {this.props.id}
        </TableCell>
        <TableCell
          key={this.props.cd}
          onClick={(event) => {
            this.handleClick(event, this.props.id, this.props.name);
          }}
        >
          {this.props.cd}
        </TableCell>
        <TableCell
          key={this.props.name}
          onClick={(event) => {
            this.handleClick(event, this.props.id, this.props.name);
          }}
        >
          {this.props.name}
        </TableCell>
      </TableRow>
    );
  }
}

export default Project;
