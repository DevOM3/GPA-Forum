import { IconButton } from "@material-ui/core";
import {
  KeyboardArrowDownRounded,
  KeyboardArrowLeftRounded,
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
import Link from "next/link";
import { useStateValue } from "../context/StateProvider";
import { useRouter } from "next/router";

const Navbar = () => {
  const router = useRouter();
  const [{ user }, dispatch] = useStateValue();
  const [showMe, setShowMe] = useState(false);

  const toggle = (e) => {
    if (showMe) {
      document.getElementById("toggle-button").style.transform = "rotate(0deg)";
    } else {
      document.getElementById("toggle-button").style.transform =
        "rotate(-270deg)";
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
      <Link href={user ? `/queries` : `/`}>
        <a className={navbarStyles.logo}>GPAForum</a>
      </Link>
      <motion.div
        className={navbarStyles.links}
        variants={mobileNavbarAnimationVariant}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <ul className={navbarStyles.ul}>
          <li className={navbarStyles.li}>
            <Link href={`/queries`}>
              <a
                className={
                  router.pathname === "/queries" ||
                  router.pathname === "/queries/[queryID]"
                    ? navbarStyles.aActive
                    : navbarStyles.a
                }
              >
                Queries
              </a>
            </Link>
          </li>
          <li className={navbarStyles.li}>
            <Link href={`/blogs`}>
              <a
                className={
                  router.pathname === "/blogs" ||
                  router.pathname === "/blogs/[blogID]"
                    ? navbarStyles.aActive
                    : navbarStyles.a
                }
              >
                Blogs
              </a>
            </Link>
          </li>
          <li className={navbarStyles.li}>
            <Link href={`/notices`}>
              <a
                className={
                  router.pathname === "/notices"
                    ? navbarStyles.aActive
                    : navbarStyles.a
                }
              >
                Notices
              </a>
            </Link>
          </li>
          <li className={navbarStyles.li}>
            <Link href={`/profile`}>
              <a
                className={
                  router.pathname === "/profile"
                    ? navbarStyles.aActive
                    : navbarStyles.a
                }
              >
                Profile
              </a>
            </Link>
          </li>
        </ul>
      </motion.div>

      {/* <motion.div
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
      </motion.div> */}

      <IconButton
        id="toggle-button"
        className={navbarStyles.hamburger}
        onClick={toggle}
      >
        {showMe ? (
          <KeyboardArrowLeftRounded style={{ color: "white" }} />
        ) : (
          <MenuRounded style={{ color: "white" }} />
        )}
      </IconButton>
    </motion.nav>
  );
};

export default Navbar;
