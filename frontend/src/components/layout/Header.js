import React, { useState } from "react";
import { Link, NavLink, useHistory } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import ShoppingBasketIcon from "@material-ui/icons/ShoppingBasket";

import { logout } from "../../api/auth/authApi";
import {
  setUserDataStartAC,
  setUserDataSuccessAC,
  setUserDataErrorAC,
} from "../../redux/actions/userData/userDataActions";
import {
  setIsAuthedFalseAC,
  setIsAuthedTrueAC,
} from "../../redux/actions/isAuthed/isAuthedActions";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  shopNameLink: {
    // width: "100vw",
    margin: "auto",
    position: "relative",
    textAlign: "center",
    textDecoration: "none",
    color: "#747474",
  },
  shopName: {
    fontSize: 38,
    fontWeight: 800,
  },
  notifIcon: {
    fontSize: "1.7rem",
    color: "#a8a5a5",
  },
  cartIcon: {
    fontSize: "1.4rem",
    color: "#a8a5a5",
  },
  headerSideSection: {
    width: "20vw",
    margin: "0 4vw 0 4vw",
  },
  headerMenuItem: {
    borderRadius: "8px",
    padding: "auto 12px",
  },
  cartButton: {
    float: "right",
  },
  signInButton: {
    marginTop: "5px",
    paddingRight: "0px",
    // display: "inline-block",
    width: "77px",
    float: "right",
  },
  signUpButton: {
    marginTop: "5px",
    width: "94px",
    float: "right",
  },
  headerContent: {
    marginTop: "5px",
    display: "inline-block",
    float: "right",
  },
  searchButton: { float: "right" },
  homeButton: { width: "74px", float: "left", marginTop: "6.5px" },
  aboutButton: { width: "75px", float: "left", marginTop: "6.5px" },
  shopButton: { width: "68px", float: "left", marginTop: "6.5px" },
  courierButton: { width: "85px", float: "left", marginTop: "6.5px" },
  headerNav: {
    // textAlign: "center",
    // width: "60vw",
    padding: "0 20vw 0 20vw",
    margin: "auto",
  },
  searchIcon: {
    color: "black",
    float: "left",
  },
  link: { color: "inherit", textDecoration: "none" },
}));

function Header(props) {
  const classes = useStyles();

  const history = useHistory();
  const dispatch = useDispatch();
  const { userData, isAuthed } = props;

  const handleRegister = () => {
    history.push("/register");
    // handleMobileMenuClose();
  };
  const handleLogin = () => {
    history.push("/login");
    // handleMobileMenuClose();
  };
  const handleLogout = () => {
    dispatch(setUserDataStartAC());
    dispatch(setUserDataSuccessAC({}));
    dispatch(setIsAuthedFalseAC());
    logout();
    // handleMobileMenuClose();
  };

  return (
    <AppBar id="header" position="static" className={classes.grow}>
      <Toolbar>
        <div className={classes.headerSideSection}></div>
        <Link to="/" className={classes.shopNameLink}>
          <Typography className={classes.shopName} noWrap>
            Storage management
          </Typography>
        </Link>

        {isAuthed ? (
          <div className={classes.headerSideSection}>
            <div className={classes.headerContent}>
              <MenuItem
                onClick={handleLogout}
                className={classes.headerMenuItem}
              >
                Logout
              </MenuItem>
            </div>
            <div className={classes.headerContent}>
              <Link to="/profile" className={classes.link}>
                <MenuItem className={classes.headerMenuItem}>Profile</MenuItem>
              </Link>
            </div>
            <div className={classes.cartButton}>
              <IconButton onClick={handleLogin}>
                <Badge badgeContent={0} color="secondary">
                  <ShoppingBasketIcon className={classes.cartIcon} />
                </Badge>
              </IconButton>
            </div>
          </div>
        ) : (
          <div className={classes.headerSideSection}>
            <div className={classes.headerContent}>
              <Link to="/register" className={classes.link}>
                <MenuItem className={classes.headerMenuItem}>Register</MenuItem>
              </Link>
            </div>
            <div className={classes.headerContent}>
              <Link to="/login" className={classes.link}>
                <MenuItem className={classes.headerMenuItem}>Log In</MenuItem>
              </Link>
            </div>
          </div>
        )}
      </Toolbar>
      <Toolbar>
        <div className={classes.headerNav}>
          <div className={classes.headerContent}>
            <Link to="/particular-product" className={classes.link}>
              <MenuItem className={classes.headerMenuItem}>
                Particular product
              </MenuItem>
            </Link>
          </div>
          <div className={classes.headerContent}>
            <Link to="/load-data" className={classes.link}>
              <MenuItem className={classes.headerMenuItem}>Load data</MenuItem>
            </Link>
          </div>
          <div className={classes.headerContent}>
            <Link to="/" className={classes.link}>
              <MenuItem className={classes.headerMenuItem}>Home</MenuItem>
            </Link>
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
}

function mapStateToProps(state) {
  return {
    isAuthed: state.isAuthedReducer.isAuthed,
    userData: {
      id: state.userDataReducer.id,
      displayName: state.userDataReducer.displayName,
    },
  };
}

export default connect(mapStateToProps)(Header);
