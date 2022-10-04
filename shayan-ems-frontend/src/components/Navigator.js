import React, { useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import HomeIcon from "@material-ui/icons/Home";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeaves } from "../Redux/actions";
import Badge from '@mui/material/Badge';

const styles = (theme) => ({
  categoryHeader: {
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: "#262b30",
  },
  categoryHeaderPrimary: {
    color: "#a9b8c5",
  },
  item: {
    paddingTop: 10,
    paddingBottom: 10,
    color: "rgba(255, 255, 255, 0.6)",
  },
  itemCategory: {
    backgroundColor: "#232f3e",
    paddingTop: 20,
    paddingBottom: 10,
  },
  firebase: {
    fontSize: 24,
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.common.white,
  },
  itemActionable: {
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.08)",
    },
  },
  itemActiveItem: {
    color: "white",
  },
  itemPrimary: {
    color: "inherit",
    fontSize: theme.typography.fontSize,
    "&$textDense": {
      fontSize: theme.typography.fontSize,
    },
  },
  textDense: {},
  divider: {
    marginTop: theme.spacing.unit * 2,
  },
  logo: {
    width: "24px",
    marginRight: "10px",
  },
  navLink: {
    textDecoration: "none",
  },
  centerText: {
    textAlign: "center",
  },
});

function Navigator(props) {
  const { classes, links, location, ...other } = props;
  const dispatch=useDispatch();
  const { payload } = useSelector((state) => state.leaves);
  useEffect(()=>{
    if (!payload.length > 0) {
      dispatch(fetchLeaves());
    }
  },[payload]);
  const pendingLeavesCount=payload.filter(each=>each.status === "pending" && !each.isSoftDeleted).length;
  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <ListItem
          className={classNames(
            classes.firebase,
            classes.item,
            classes.itemCategory
          )}
        >
          <span className={classes.centerText}>Employee Management</span>
        </ListItem>
        <Link className={classes.navLink} to="/dashboard">
          <ListItem className={classNames(classes.item, classes.itemCategory)}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText
              classes={{
                primary: classes.itemPrimary,
              }}
            >
              Overview
            </ListItemText>
          </ListItem>
        </Link>
        {links.map(({ label, children }) => (
          <React.Fragment key={label}>
            <ListItem className={classes.categoryHeader}>
              <ListItemText
                classes={{
                  primary: classes.categoryHeaderPrimary,
                }}
              >
                {label}
              </ListItemText>
            </ListItem>
            {children.map(({ label: childLabel, path, icon }) => (
              <Link className={classes.navLink} key={childLabel} to={path}>
                <ListItem
                  button
                  dense
                  className={classNames(
                    classes.item,
                    classes.itemActionable,
                    location.pathname.startsWith(path) && classes.itemActiveItem
                  )}
                >
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText
                    classes={{
                      primary: classes.itemPrimary,
                      textDense: classes.textDense,
                    }}
                  >
                    {childLabel}
                  </ListItemText>
                  { childLabel === "Leaves" && pendingLeavesCount !== 0 && <ListItemText
                  >
                    <Badge badgeContent={pendingLeavesCount} color="primary"/>
                  </ListItemText>}
                </ListItem>
              </Link>
            ))}
            <Divider className={classes.divider} />
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
}

Navigator.propTypes = {
  classes: PropTypes.object.isRequired,
  links: PropTypes.array.isRequired,
  location: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navigator);
