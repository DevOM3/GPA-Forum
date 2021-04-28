import { db } from "../../services/firebase";
import React, { useState, useEffect } from "react";
import BlogContent from "./BlogContent";
import HeaderStyles from "../../styles/components/admin/DashboardHeader.module.css";
import styles from "../../styles/components/admin/Blogs.module.css";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchString, setSearchString] = useState("");
  // filter

  useEffect(() => {
    db.collection("Blogs").onSnapshot((snapshot) =>
      setBlogs(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          by: doc.data()?.by,
          image: doc.data()?.image,
          text: doc.data()?.text,
          title: doc.data()?.title,
          timestamp: doc.data()?.timestamp,
        }))
      )
    );
  }, []);

  return (
    <div>
      <div className={HeaderStyles.path}>
        <i className={`fas fa-user-shield ${HeaderStyles.admin_icon}`}></i>
        Admin/
        <span className={HeaderStyles.path_link}>Blogs</span>
      </div>

      <div className={HeaderStyles.search}>
        <div className={HeaderStyles.search_group}>
          <input
            type="text"
            placeholder="Search..."
            className={HeaderStyles.search_box}
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
          />
          <span className={HeaderStyles.icon}>
            <i className="fa fa-search" aria-hidden="true"></i>
          </span>
        </div>
      </div>

      <div className={styles.blogContainer}>
        {blogs
          .filter(
            (blog) =>
              blog.title.toLowerCase().includes(searchString.toLowerCase()) ||
              blog.text.toLowerCase().includes(searchString.toLowerCase())
          )
          .map((blog) => (
            <BlogContent
              key={blog.id}
              id={blog.id}
              by={blog.by}
              image={blog.image}
              text={blog.text}
              title={blog.title}
              timestamp={blog.timestamp}
            />
          ))}
      </div>
    </div>
  );
};

export default Blogs;
