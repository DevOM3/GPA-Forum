import styles from "../../styles/components/admin/QueryLayout.module.css";
import { db } from "../../services/firebase";
import React, { useState, useEffect } from "react";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { CircularProgress } from "@material-ui/core";

const QueryLayout = (props) => {
  const [queryBy, setQueryBy] = useState("");
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    if (props.by) {
      db.collection("Users")
        .doc(props.by)
        .get()
        .then((data) =>
          setQueryBy({
            id: data?.id,
            name: data.data()?.name,
          })
        );
    }
  }, [props.by]);

  const deleteQuery = async () => {
    setDeleting(true);
    const queryRef = await db.collection("Queries").doc(props.id);
    const querySolutions = (await queryRef.collection("Solutions").get()).docs;

    for (let index = 0; index < querySolutions.length; index++) {
      await db
        .collection("Queries")
        .doc(props.id)
        .collection("Solutions")
        .doc(querySolutions[index].id)
        .delete();
    }

    await queryRef.delete();
    setDeleting(false);
  };

  const deletePost = async () => {
    if (confirm("Are you sure to delete this post?")) {
      deleteQuery();
    }
  };

  return deleting ? (
    <div
      className={styles.query}
      style={{ height: 100, display: "grid", placeItems: "center" }}
    >
      <CircularProgress size={24} style={{ color: "black" }} />
    </div>
  ) : (
    <div className={styles.query} key={props.id}>
      <div className={styles.query_date}>
        <p className={styles.date} style={{ background: "#a61313" }}>
          {props.time.toDate().toLocaleString()}
        </p>
        {/* Delete Icon */}
        <div>
          <DeleteForeverIcon
            className={styles.delete_icon}
            onClick={deletePost}
          />
        </div>
      </div>
      <p className={styles.query_text}>{props.query}</p>
      <p className={styles.by_name}>By: {queryBy.name}</p>
    </div>
  );
};

export default QueryLayout;
