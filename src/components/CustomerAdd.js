import React from "react";
import { post } from "axios";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { withStyles } from "@mui/styles";
import {
  FormIt,
  WSM,
} from "https://formit3d.github.io/SharedPluginUtilities/FormIt.mod.js";
import { FormItPluginUtils } from "https://haeahn-dukhyun.github.io/FormItExamplePlugins/SharedPluginFiles/FormItPluginUtils.mod.js";
import axios from "axios";
import fileDownload from "js-file-download";

const styles = (theme) => ({
  hidden: {
    display: "none",
  },
});

class CustomerAdd extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      file: null,
      userName: "",
      birthday: "",
      gender: "",
      job: "",
      fileName: "",
      open: false,
      x: 0,
      y: 0,
    };

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.addCustomer = this.addCustomer.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.createBlock = this.createBlock.bind(this);
    this.newSketch = this.newSketch.bind(this);
    this.saveSketch = this.saveSketch.bind(this);
    this.openSketch = this.openSketch.bind(this);
  }

  handleFormSubmit(e) {
    e.preventDefault();
    this.addCustomer().then((response) => {
      console.log(response.data);
      this.props.stateRefresh();
    });

    this.setState({
      file: null,
      userName: "",
      birthday: "",
      gender: "",
      job: "",
      fileName: "",
      open: false,
      //x: 0,
      //y: 0,
    });
  }

  handleFileChange(e) {
    this.setState({
      file: e.target.files[0],
      fileName: e.target.value,
    });

    console.log(e.target.files[0]);
    var CryptoJS = require("crypto-js");
    var reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onloadend = function () {
      var hash = CryptoJS.SHA256(reader.result).toString();
      console.log("MD5 Checksum", hash);
    };
  }

  handleValueChange(e) {
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  }

  addCustomer() {
    const url = "/api/customers";
    const formData = new FormData();

    //console.log(this.state.file, " | ", this.state.fileName);

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
      file: null,
      userName: "",
      birthday: "",
      gender: "",
      job: "",
      fileName: "",
      open: false,
    });
  }

  async createBlock() {
    console.log("async createBlock(): ", this.state.x);
    const w = this.state.x + 30,
      h = this.state.y + 20,
      l = 60;
    const pt1 = WSM.Geom.Point3d(this.state.x, this.state.y, 0);
    const pt2 = WSM.Geom.Point3d(w, h, l);
    const histID = await FormIt.GroupEdit.GetEditingHistoryID();
    const blockID = await WSM.APICreateBlock(histID, await pt1, await pt2);

    console.log("createBlock(): histID: ", histID);
    console.log("createBlock(): blockID: ", blockID);

    this.setState({
      x: w,
      y: h,
    });
  }

  async newSketch() {
    console.log("newSketch(): start");
    const rst = await FormIt.NewFile();
    console.log("newSketch(): end: ", rst);
  }

  async saveSketch() {
    console.log("saveSketch(): start");
    const rst = await FormIt.SaveFile("d:\\ccc.axm");
    console.log("saveSketch(): end: ", rst);
  }

  async openSketch() {
    console.log("openSketch(): start");
    const rst = await FormIt.OpenFile("d:\\aaa.axm");
    console.log("openSketch(): end: ", rst);
  }

  async openFolder() {
    console.log("openFolder(): start");

    //const path = request("path");
    //const fs = require("fs");

    //const dirPath = path.join("D:\\Study-Test\\a");

    //fs.readdir(dirPath, function (err, files) {
    //  if (err) {
    //    return console.log("err");
    // }

    // files.forEach(function (file) {
    //   console.log(file);
    // });
    //});

    //const rst = await FormIt.OpenFile("d:\\aaa.axm");
    console.log("openSketch(): end: ");
  }

  async download() {
    console.log("download(): start");

    //const path = request("path");
    //const fs = require("fs");

    //const dirPath = path.join("D:\\Study-Test\\a");

    //fs.readdir(dirPath, function (err, files) {
    //  if (err) {
    //    return console.log("err");
    // }

    // files.forEach(function (file) {
    //   console.log(file);
    // });
    //});

    //const rst = await FormIt.OpenFile("d:\\aaa.axm");
    console.log("download(): end: ");
  }

  async downloadFile() {
    console.log("download(): start");

    //const url = "http://ueapi.haeahn.com/unl/rvtmdls/21011/21011_01.zip";
    //const { user } = await axios(url, (req, res) => {
    //  res.header("Access-Control-Allow-Origin", true);
    //});

    const url = "models/test01.axm";
    const filename = "test01.axm";

    axios
      .get(url, {
        headers: { "Access-Control-Allow-Origin": true },
        responseType: "blob",
      })
      .then((res) => {
        console.log("fileDownload");
        fileDownload(res.data, filename);
      });

    //const rst = await FormIt.OpenFile("d:\\aaa.axm");
    console.log("download(): end: ");
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
          새 프로젝트
        </Button>
        <Button variant="contained" color="primary" onClick={this.createBlock}>
          create block
        </Button>
        <Button variant="contained" color="primary" onClick={this.newSketch}>
          new sketch
        </Button>
        <input
          className={classes.hidden}
          accept="model/x-formit, .axm"
          id="raised-button-file-axm"
          type="file"
          file={this.state.file}
          value={this.state.fileName}
          onChange={this.handleFileChange}
        />
        <label htmlFor="raised-button-file-axm">
          <Button
            variant="contained"
            color="primary"
            component="span"
            name="file"
          >
            선택
          </Button>
        </label>
        <Button variant="contained" color="primary" onClick={this.saveSketch}>
          save sketch
        </Button>
        <Button variant="contained" color="primary" onClick={this.openSketch}>
          open sketch
        </Button>
        <Button variant="contained" color="primary" onClick={this.downloadFile}>
          downloadFile
        </Button>
        <Dialog open={this.state.open} onClose={this.handleClose}>
          <DialogTitle>추가</DialogTitle>
          <DialogContent>
            <input
              className={classes.hidden}
              accept="*"
              id="raised-button-file"
              type="file"
              file={this.state.file}
              value={this.state.fileName}
              onChange={this.handleFileChange}
            />

            <label htmlFor="raised-button-file">
              <Button
                variant="contained"
                color="primary"
                component="span"
                name="file"
              >
                {this.state.fileName === ""
                  ? "프로필 이미지 선택"
                  : this.state.fileName}
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
            <br />
          </DialogContent>

          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleFormSubmit}
            >
              추가
            </Button>

            <Button
              variant="outlined"
              color="primary"
              onClick={this.handleClose}
            >
              닫기
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(CustomerAdd);
