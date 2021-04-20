import { IconButton } from "@material-ui/core";
import {
  KeyboardArrowDownRounded,
  MenuRounded,
  SearchRounded,
} from "@material-ui/icons";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import {
  mobileNavbarAnimationVariant,
  pageNavbarAnimationVariant,
} from "../services/utilities";
import navbarStyles from "../styles/components/Navbar.module.css";

const Navbar = () => {
  const [showMe, setShowMe] = useState(false);

  const toggle = (e) => {
    if (showMe) {
      document.getElementById("toggle-button").style.transform = "rotate(0deg)";
    } else {
      document.getElementById("toggle-button").style.transform =
        "rotate(-180deg)";
    }

    setShowMe(!showMe);
  };

  useEffect(() => {
    if (window.innerWidth > 1020) {
      setShowMe(true);
    } else {
      setShowMe(false);
    }
    window.onresize = () => {
      if (window.innerWidth > 1020) {
        setShowMe(true);
      }
      //  else {
      //   setShowMe(false);
      // }
    };
  }, []);

  return (
    <motion.nav
      className={navbarStyles.nav}
      style={{ maxHeight: showMe ? 500 : 75 }}
      variants={pageNavbarAnimationVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className={navbarStyles.logo}>GPAForum</div>

      {/* {showMe && ( */}
      <motion.div
        className={navbarStyles.links}
        variants={mobileNavbarAnimationVariant}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <ul className={navbarStyles.ul}>
          <li className={navbarStyles.li}>
            <a href="#" className={navbarStyles.a}>
              Forum
            </a>
          </li>
          <li className={navbarStyles.li}>
            <a href="#" className={navbarStyles.a}>
              Blogs
            </a>
          </li>
          <li className={navbarStyles.li}>
            <a href="#" className={navbarStyles.a}>
              Profile
            </a>
          </li>
        </ul>
      </motion.div>
      {/* )} */}

      {/* {showMe && ( */}
      <motion.div
        className={navbarStyles.cont}
        variants={mobileNavbarAnimationVariant}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className={navbarStyles.search}>
          <div className={navbarStyles.searchbox}>
            <input
              type="text"
              placeholder="Search"
              className={navbarStyles.searchtext}
            />
            <a href="#" className={navbarStyles.searchbtn}>
              <SearchRounded />
            </a>
          </div>
        </div>
      </motion.div>
      {/* )} */}

      <IconButton
        id="toggle-button"
        className={navbarStyles.hamburger}
        onClick={toggle}
      >
        {showMe ? (
          <KeyboardArrowDownRounded style={{ color: "white" }} />
        ) : (
          <MenuRounded style={{ color: "white" }} />
        )}
      </IconButton>
    </motion.nav>
  );
};

export default Navbar;
