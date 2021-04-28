import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import styles from "../../styles/components/admin/Profile.module.css";
import { CircularProgress } from "@material-ui/core";
import React, { useState } from "react";
import { db, storage } from "../../services/firebase";
import Link from "next/link";

const User = (props) => {
  const [deleting, setDeleting] = useState(false);
  const deleteUser = async () => {
    if (
      confirm(
        "Are you sure to delete this user?\n(Related Queries and Blogs are also be deleted!)"
      )
    ) {
      setDeleting(true);

      // Delete Query
      const queries = await (
        await db.collection("Queries").where("by", "==", props.id).get()
      ).docs;
      for (let index = 0; index < queries.length; index++) {
        const solutions = (
          await db
            .collection("Queries")
            .doc(queries[index].id)
            .collection("Solutions")
            .get()
        ).docs;
        for (
          let solutionIndex = 0;
          solutionIndex < solutions.length;
          solutionIndex++
        ) {
          await db
            .collection("Queries")
            .doc(queries[index].id)
            .collection("Solutions")
            .doc(solutions[solutionIndex].id)
            .delete();
        }
        await db.collection("Queries").doc(queries[index].id).delete();
      }

      // Delete Blog
      const blogs = await (
        await db.collection("Blogs").where("by", "==", props.id).get()
      ).docs;
      for (let index = 0; index < blogs.length; index++) {
        const comments = (
          await db
            .collection("Blogs")
            .doc(blogs[index].id)
            .collection("Comments")
            .get()
        ).docs;

        for (
          let commentIndex = 0;
          commentIndex < comments.length;
          commentIndex++
        ) {
          await db
            .collection("Blogs")
            .doc(blogs[index].id)
            .collection("Comments")
            .doc(comments[commentIndex].id)
            .delete();
        }

        if (blogs[index].data()?.image) {
          await storage.refFromURL(blogs[index].data()?.image).delete();
        }

        await db.collection("Blogs").doc(blogs[index].id).delete();
      }

      db.collection("Users").doc(props.id).delete();
    }
  };
  return deleting ? (
    <div
      className={styles.student_profile}
      style={{ height: 100, display: "grid", placeItems: "center" }}
    >
      <CircularProgress size={24} style={{ color: "black" }} />
    </div>
  ) : (
    <div className={styles.student_profile}>
      <div className={styles.delete_icon}>
        <DeleteForeverIcon onClick={deleteUser} />
      </div>
      <Link href={`/profile/${props.id}`}>
        <a className={styles.profile_info}>
          <p className={styles.student_name}>{props.name}</p>
          <p className={styles.student_branch}>{props.branch}</p>
          <p className={styles.student_cont}>{props.phno}</p>
        </a>
      </Link>
    </div>
  );
};

export default User;
