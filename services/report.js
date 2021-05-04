import Filter from "bad-words";
import { db, storage } from "./firebase";

export const report = (text) => {
  const filter = new Filter();
  let reportedText = filter.clean(text);

  return !(text === reportedText);
};

export const suspendUser = async (by) => {
  // Delete Query
  const queries = await (
    await db.collection("Queries").where("by", "==", by).get()
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
  const blogs = await (await db.collection("Blogs").where("by", "==", by).get())
    .docs;
  for (let index = 0; index < blogs.length; index++) {
    const comments = (
      await db
        .collection("Blogs")
        .doc(blogs[index].id)
        .collection("Comments")
        .get()
    ).docs;

    for (let commentIndex = 0; commentIndex < comments.length; commentIndex++) {
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

  db.collection("Users").doc(by).delete();
};

export const REPORT_THRESHOLD = 2;
