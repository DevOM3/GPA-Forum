import { db } from "../../services/firebase";
import React, { useState, useEffect } from "react";
import styles from "../../styles/components/admin/Blogs.module.css";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import ShowMoreText from "react-show-more-text";

const BlogContent = ({ id, by, image, text, title, timestamp }) => {
  const [byName, setByName] = useState([]);

  useEffect(() => {
    if (by) {
      db.collection("Users")
        .doc(by)
        .get()
        .then((data) =>
          setByName({
            id: data?.id,
            name: data.data()?.name,
            branch: data.data()?.branch?.title,
          })
        );
    }
  }, [by]);

  const deleteBlog = () => {
    if (confirm("Are you sure to delete this Blog?")) {
      db.collection("Blogs").doc(id).delete();
    }
  };

  return (
    <div className={styles.blog}>
      <div className={styles.deleteIcon}>
        <DeleteForeverIcon
          style={{
            fontSize: "32px",
            margin: "3px 8px",
            background: "#e84118",
            color: "#fdfdfd",
            borderRadius: "25px",
            padding: "2px",
            marginTop: "10px",
          }}
          className={styles.delete}
          onClick={deleteBlog}
        />
      </div>
      <p className={styles.time}>{timestamp.toDate().toLocaleString()}</p>
      <h2 className={styles.title}>{title}</h2>
      <p
        className={styles.authorName}
        style={{ textAlign: "center", margin: "0", color: "red" }}
      >
        {byName.name}
      </p>
      <p className={styles.branch}>{byName.branch}</p>
      <div className={styles.blogImage}>
        <img
          src={image === "" ? "/images/logo.png" : image}
          className={styles.image}
        />
      </div>
      <pre className={styles.text}>
        <ShowMoreText
          lines={2}
          more="Show more"
          less="Show less"
          expanded={false}
        >
          {text}
        </ShowMoreText>
      </pre>
    </div>
  );
};

export default BlogContent;
