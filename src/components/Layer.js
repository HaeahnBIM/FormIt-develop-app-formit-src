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
import { DataGrid } from "@mui/x-data-grid";

const styles = (theme) => ({
  hidden: {
    display: "none",
  },
});

const columns = [
  { field: "col1", headerName: "사업", width: 150 },
  { field: "col2", headerName: "시설", width: 150 },
  { field: "col3", headerName: "레이어", width: 150 },
];

const rows = [
  { id: 1, col1: "Hello", col2: "World", col3: "hjh" },
  { id: 2, col1: "DataGridPro", col2: "is Awesome", col3: "jhj" },
  { id: 3, col1: "MUI", col2: "is Amazing", col3: "hgg" },
];

class Layer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      rowsLayer: [],
      selectionModel: [],
      data: [],
    };

    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    let layers = [];
    this.callApi("/api/layer")
      .then((res) => {
        //let keys = Object.keys(res[0]);
        for (let i = 0; i < res.length; i++) {
          let rs = res[i];
          //let key = keys[i];
          //console.log(key, rs);
          layers.push({
            id: rs.ID,
            col1: rs.NM_BUIS,
            col2: rs.NM_FCLTY,
            col3: rs.NM_LAYR,
          });
        }
      })
      .catch((err) => console.log(err));

    this.setState({ rowsLayer: layers.map((row) => ({ ...row })) });
  }

  callApi = async (api) => {
    const response = await fetch(api);
    const body = await response.json();
    return body;
  };

  handleClickOpen() {
    this.setState({
      open: true,
    });
  }

  handleClose() {
    this.setState({
      userName: "",
      birthday: "",
      gender: "",
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
          레이어조회
        </Button>

        <Dialog open={this.state.open} onClose={this.handleClose}>
          <DialogTitle>레이어추가</DialogTitle>
          <DialogContent>
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={this.state.rowsLayer}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
                disableSelectionOnClick
              />
            </div>
          </DialogContent>

          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleClose}
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

export default withStyles(styles)(Layer);
