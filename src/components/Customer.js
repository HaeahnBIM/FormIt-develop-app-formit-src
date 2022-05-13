import React from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import CustomerDelete from "./CustomerDelete";
import CustomerEdit from "./CustomerEdit";
import ButtonGroup from "@mui/material/ButtonGroup";

class Customer extends React.Component {
  render() {
    return (
      <TableRow>
        <TableCell>{this.props.id}</TableCell>
        <TableCell>
          <img src={this.props.image} alt="profile" />
        </TableCell>
        <TableCell>{this.props.name}</TableCell>
        <TableCell>{this.props.birthday}</TableCell>
        <TableCell>{this.props.gender}</TableCell>
        <TableCell>{this.props.job}</TableCell>
        <TableCell>
          <ButtonGroup name="type">
            <CustomerDelete
              stateRefresh={this.props.stateRefresh}
              id={this.props.id}
            />
            <CustomerEdit
              stateRefresh={this.props.stateRefresh}
              id={this.props.id}
              name={this.props.name}
              fileName={this.props.image}
              birthday={this.props.birthday}
              gender={this.props.gender}
              job={this.props.job}
            />
          </ButtonGroup>
        </TableCell>
      </TableRow>
    );
  }
}

export default Customer;
