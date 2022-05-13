import React from "react";
import { post } from "axios";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { withStyles } from "@mui/styles";

const styles = (theme) => ({
  hidden: {
    display: "none",
  },
});

class CustomerEdit extends React.Component {
  constructor(props) {
    super(props);

    console.log(this.props.fileName);

    this.state = {
      file: null,
      userName: this.props.name,
      birthday: this.props.birthday,
      gender: this.props.gender,
      job: this.props.job,
      fileName: "",
      open: false,
    };

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.editCustomer = this.editCustomer.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleFormSubmit(e, id) {
    console.log(id);
    e.preventDefault();
    this.editCustomer(id).then((response) => {
      console.log(response.data);
      this.props.stateRefresh();
    });

    this.setState({
      //file: null,
      //userName: "",
      //birthday: "",
      //gender: "",
      //job: "",
      //fileName: "",
      open: false,
    });
  }

  handleFileChange(e) {
    console.log(
      e.target.value,
      e.target.files[0].name
    );
    this.setState({
      file: e.target.files[0],
      fileName: e.target.value,
    });

    //document.getElementById(<img src={testImg} alt );
  }

  handleValueChange(e) {
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  }

  editCustomer(id) {
    const url = "/api/customers/" + id;
    const formData = new FormData();
    formData.append("image", this.state.file);
    formData.append("name", this.state.userName);
    formData.append("birthday", this.state.birthday);
    formData.append("gender", this.state.gender);
    formData.append("job", this.state.job);

    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    return post(url, formData, config);
  }

  handleClickOpen() {
    this.setState({
      open: true,
    });
  }

  handleClose() {
    this.setState({
      //   file: null,
      //   userName: "",
      //   birthday: "",
      //   gender: "",
      //   job: "",
      //   fileName: "",
      open: false,
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={this.handleClickOpen}
        >
          수정
        </Button>

        <Dialog open={this.state.open} onClose={this.handleClose}>
          <DialogTitle>고객 정보 수정</DialogTitle>

          <DialogContent>
            <input
              className={classes.hidden}
              accept="image/*"
              id="raised-button-file"
              type="file"
              file={this.state.file}
              value={this.state.fileName}
              onChange={this.handleFileChange}
            />
            <img src={this.props.fileName} alt="profile" />
            <br></br>
            <label htmlFor="raised-button-file">
              <Button
                variant="contained"
                color="primary"
                component="span"
                name="file"
              >
                이미지 선택
              </Button>
            </label>
            <br />
            <br />

            <TextField
              label="이름"
              type="text"
              name="userName"
              value={this.state.userName}
              onChange={this.handleValueChange}
            />
            <br />
            <br />

            <TextField
              label="생년월일"
              type="text"
              name="birthday"
              value={this.state.birthday}
              onChange={this.handleValueChange}
            />
            <br />
            <br />

            <TextField
              label="성별"
              type="text"
              name="gender"
              value={this.state.gender}
              onChange={this.handleValueChange}
            />
            <br />
            <br />

            <TextField
              label="직업"
              type="text"
              name="job"
              value={this.state.job}
              onChange={this.handleValueChange}
            />
          </DialogContent>

          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              onClick={(e) => {
                this.handleFormSubmit(e, this.props.id);
              }}
              //onClick={this.handleFormSubmit(this.props.id)}
            >
              수정
            </Button>

            <Button
              variant="outlined"
              color="primary"
              onClick={this.handleClose}
            >
              취소
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(CustomerEdit);
