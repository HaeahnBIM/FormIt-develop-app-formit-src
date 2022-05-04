import React, { Component } from "react";
import Project from "./components/Project";
import "./App.css";
import { createTheme } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { withStyles } from "@mui/styles";
import { styled } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import CustomerAdd from "./components/CustomerAdd";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import { purple } from "@mui/material/colors";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import {
  FormIt,
  WSM,
} from "https://formit3d.github.io/SharedPluginUtilities/FormIt.mod.js";
import DataTable from "./components/DataTable";

const th = createTheme({
  status: {},
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: purple[500],
    },
    secondary: {
      // This is green.A700 as hex.
      main: "#11cb5f",
    },
  },
});

const styles = (theme) => ({
  root: {
    width: "100%",
    //minWidth: 1080,
  },
  menu: {
    marginTop: 15,
    marginBottom: 15,
    display: "flex",
    justifyContent: "center",
  },
  paper: {
    marginTop: 15,
    marginLeft: 10,
    marginRight: 10,
  },
  progress: {
    margin: th.spacing.unit * 2,
  },
  grow: {
    flexGrow: 1,
  },
  tableHead: {
    fontSize: "1.0rem",
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: "none",
    [th.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: th.shape.borderRadius,
    //backgroundColor: fade(th.palette.primary.main, 0.15),
    //"&:hover": {
    //  backgroundColor: fade(th.palette.common.white, 0.25),
    //},
    marginLeft: 0,
    width: "100%",
    [th.breakpoints.up("sm")]: {
      marginLeft: th.spacing.unit,
      width: "auto",
    },
  },
  searchIcon: {
    width: th.spacing.unit * 9,
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
    width: "100%",
  },
  inputInput: {
    paddingTop: th.spacing.unit,
    paddingRight: th.spacing.unit,
    paddingBottom: th.spacing.unit,
    paddingLeft: th.spacing.unit * 10,
    //transition: theme.transitions.create(["background-color", "transform"], {
    //  duration: theme.transitions.duration.standard,
    //}),
    width: "100%",
    [th.breakpoints.up("sm")]: {
      width: 120,
      "&:focus": {
        width: 200,
      },
    },
  },
});

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "left",
  color: theme.palette.text.secondary,
}));

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: "",
      completed: 0,
      searchKeyword: "",
      projectInfo: [],
      currentId: "",
      x: 0,
      y: 0,
      tableData: [],
    };
    this.stateRefresh = this.stateRefresh.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleCreateBlock = this.handleCreateBlock.bind(this);
    this.handleGetArea = this.handleGetArea.bind(this);
  }

  handleValueChange(e) {
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  }

  stateRefresh() {
    this.setState({
      projects: "",
      completed: 0,
      searchKeyword: "",
    });
    this.callApi("/api/projects")
      .then((res) => this.setState({ projects: res }))
      .catch((err) => console.log(err));
  }

  componentDidMount() {
    this.timer = setInterval(this.progress, 20);
    this.callApi("/api/projects")
      .then((res) => this.setState({ projects: res }))
      .catch((err) => console.log(err));
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  callApi = async (api) => {
    const response = await fetch(api);
    const body = await response.json();
    return body;
  };

  progress = () => {
    const { completed } = this.state;
    this.setState({ completed: completed >= 100 ? 0 : completed + 1 });
  };

  informationComponents = (data) => {
    console.log("informationComponents = (data) => { : ", data);
    return data.map((c) => {
      return (
        <div key={c.ID}>
          <Grid container spacing={1}>
            <Grid item style={{ width: "150px" }}>
              <Item>지번</Item>
            </Grid>
            <Grid item xs>
              <Item>project info : {c.ID}</Item>
            </Grid>
          </Grid>
        </div>
      );
    });
  };

  handleClick = (e, id, name) => {
    e.preventDefault();

    //this.setState({ currentId: id });
    //console.log(this.state.currentId);

    let _projectinfo = [];

    this.callApi("/api/projects/info/" + id)
      .then((res) => {
        let keys = Object.keys(res[0]);
        for (let i = 0; i < keys.length; i++) {
          let key = keys[i];
          _projectinfo.push(
            <div key={i}>
              <Grid container spacing={1}>
                <Grid item style={{ width: "150px" }}>
                  <Item>{key}</Item>
                </Grid>
                <Grid item xs>
                  <Item>{res[0][key]}</Item>
                </Grid>
              </Grid>
            </div>
          );
        }
      })
      .catch((err) => console.log(err));

    this.setState({
      projectInfo: _projectinfo,
    });
  };

  async handleCreateBlock(e) {
    console.log("handleTest: ", e.target);
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

  doSomething(id) {
    return new Promise((resolve, reject) => {
      console.log(id);
      console.log(resolve);
      console.log(reject);
    });
  }

  async handleGetArea(e) {
    console.log("handleGetArea: start: ", e.target);

    let selection = await FormIt.Selection.GetSelections();

    //let props = FormIt.Model.GetPropertiesForSelected();

    //console.log("GetPropertiesForSelected: " + props);

    for (var j = 0; j < selection.length; j++) {
      let historyDepth = selection[j]["ids"].length - 1;

      let a = selection[j]["ids"][historyDepth];

      let id = a["Object"];

      var objectProperties = await WSM.APIGetObjectPropertiesReadOnly(
        historyDepth,
        id
      );

      console.log(objectProperties);
      // bReportAreaByLevel: true
      // sObjectName: "lkjkjskldjjlLVFJLJLJKJKLJKLJKLJ"

      var objectName = await WSM.APIGetObjectNameReadOnly(historyDepth, id);

      console.log(objectName);

      var Attributes = await WSM.APIGetObjectAttributesReadOnly(
        historyDepth,
        id
      );

      console.log(Attributes);

      let props = await FormIt.Model.GetPropertiesForSelected();

      console.log(props);

      let getObjectName = await FormIt.Model.GetObjectName(id);

      console.log("getObjectName", getObjectName);

      let getProjectSiteArea = await FormIt.Model.GetProjectSiteArea();

      console.log("getProjectSiteArea", getProjectSiteArea);

      let getProjectTargetArea = await FormIt.Model.GetProjectTargetArea();

      console.log("getProjectTargetArea", getProjectTargetArea);

      let getBuildingType = await FormIt.GetBuildingType();

      console.log("getBuildingType", getBuildingType);

      let getAllLayers = await FormIt.Layers.GetAllLayers();

      console.log("getAllLayers", getAllLayers);

      let getAllLayerData = await FormIt.Layers.GetAllLayerData();

      console.log("getAllLayerData", getAllLayerData);

      for (var m = 0; m < getAllLayers.length; m++) {
        let getLayerData = await FormIt.Layers.GetLayerData(getAllLayers[m]);
        console.log("getLayerData", getLayerData);
      }

      let getObjectLayerID = await FormIt.Layers.GetObjectLayerID(
        historyDepth,
        id
      );

      console.log("getObjectLayerID", getObjectLayerID);

      //let getLayerData = await FormIt.Layers.GetLayerData(getObjectLayerID);

      //console.log("getLayerData", getLayerData);

      let objectReportsAreaByLevel =
        await FormIt.Model.ObjectReportsAreaByLevel(id);

      console.log("objectReportsAreaByLevel", objectReportsAreaByLevel);

      let getTotalGrossArea = await FormIt.Model.GetTotalGrossArea();

      console.log("getTotalGrossArea", getTotalGrossArea);
      // getTotalGrossArea 3288

      // Level Id 전체 가져오기
      let getLevels = await FormIt.Levels.GetLevels(historyDepth, true);
      console.log("getLevels", getLevels);

      // Level Data 전체 가져오기
      let getLevelsData = await FormIt.Levels.GetLevelsData(historyDepth, true);
      console.log("getLevelsData", getLevelsData);

      // 레벨 중 최고 높은 것의 elevation 가져오기
      let getMaxLevelElevation = await FormIt.Levels.GetMaxLevelElevation(
        historyDepth
      );
      console.log("getMaxLevelElevation", getMaxLevelElevation);

      // 레벨 중 최고 낮은 것의 elevation 가져오기
      let getMinLevelElevation = await FormIt.Levels.GetMinLevelElevation(
        historyDepth
      );
      console.log("getMinLevelElevation", getMinLevelElevation);

      // 선택한 오브젝트의 레벨 ID 가져오기
      let getLevelIDsFromSelectedObjects =
        await FormIt.Levels.GetLevelIDsFromSelectedObjects(historyDepth);
      console.log(
        "getLevelIDsFromSelectedObjects",
        getLevelIDsFromSelectedObjects
      );

      console.log("this.props.tableData", this.props.tableData);
      this.setState({ tableData: this.props.tableData });

      //FormIt.Model.SetObjectName(id, "lkjkjskldjjlLVFJLJLJKJKLJKLJKLJ");

      // get the name of this object, then push the results into an array
      //var objectName = objectProperties.sObjectName;

      //console.log(objectName);

      //console.log("Object ID: " + id);

      //let objName = FormIt.Model.ObjectReportsAreaByLevel(id);

      //console.log("ObjectReportsAreaByLevel: " + objName);

      // let objProperties = FormIt.Model.GetPropertiesForSelected(a["Object"]);

      // console.log("objProperties: " + objProperties.length);

      // for (var m = 0; m < objProperties.length; j++) {
      //   let aaa = objProperties[m];
      //   console.log("objProperty: " + aaa);
      // }

      //console.log("Object Name: " + objName);
      //console.log("objProperties: " + objProperties);
      // let levels = await FormIt.Levels.GetLevelsData(historyDepth, true);

      // for (var m = 0; m < levels.length; m++) {
      //   let nLevelID = levels[m]["Id"]["Object"];
      //   console.log(levels[m]);
      //   //let nLevelID = levels[m]["Id"][historyDepth]["Object"];
      //   //await FormIt.Levels.ChangeLevelElevation(historyDepth, nLevelID, 15);

      //   let nObjectID = aCurrentSelection[j]["ids"][historyDepth]["Object"];

      //   let dArea = await FormIt.Levels.GetAreaForObjects(
      //     historyDepth,
      //     nLevelID,
      //     nObjectID
      //   );

      //   //console.log(dArea);
      // }

      //let isLevel = await FormIt.Levels.IsExistingLevel(historyDepth, "level1");
      //let level = await FormIt.Levels.GetLevelData(historyDepth, "level1");
    }

    console.log("handleGetArea: end");
  }

  render() {
    const filteredComponents = (data) => {
      data = data.filter((c) => {
        return c.NM_PROJ.indexOf(this.state.searchKeyword) > -1;
      });
      return data.map((c) => {
        return (
          <Project
            stateRefresh={this.stateRefresh}
            key={c.ID}
            id={c.ID}
            cd={c.CD_PROJ}
            name={c.NM_PROJ}
            onRowClick={this.handleClick}
          />
        );
      });
    };

    const { classes } = this.props;
    const cellList = ["ID", "Code", "Name"];

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Open drawer"
            >
              <MenuIcon />
            </IconButton>
            <Typography
              className={classes.title}
              variant="h6"
              color="inherit"
              noWrap
            >
              규모검토시스템
            </Typography>
            <div className={classes.grow} />
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="검색하기"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                name="searchKeyword"
                value={this.state.searchKeyword}
                onChange={this.handleValueChange}
              />
            </div>
          </Toolbar>
        </AppBar>
        <div className={classes.menu}>
          <CustomerAdd stateRefresh={this.stateRefresh} />
        </div>
        <Paper variant="outlined" className={classes.paper}>
          <Table>
            <TableHead>
              <TableRow>
                {cellList.map((c) => {
                  return (
                    <TableCell key={c} className={classes.tableHead}>
                      {c}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.projects ? (
                filteredComponents(this.state.projects)
              ) : (
                <TableRow>
                  <TableCell colSpan="6" align="center">
                    <CircularProgress
                      className={classes.progress}
                      variant="determinate"
                      value={this.state.completed}
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
        <br />
        <div>Project Infomation</div>
        <br />
        <Paper className={classes.paper}>
          <Stack spacing={2}>{this.state.projectInfo}</Stack>
        </Paper>

        <br />
        <div>면적 정보</div>
        <Button
          variant="contained"
          color="primary"
          onClick={this.handleCreateBlock}
        >
          블럭생성
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={this.handleGetArea}
        >
          동/층별
        </Button>
        <br />
        <Paper className={classes.paper}>
          <DataTable/>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(App);
