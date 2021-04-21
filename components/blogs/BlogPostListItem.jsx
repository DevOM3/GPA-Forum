import React from "react";
import Link from "next/link";
import { IconButton } from "@material-ui/core";
import ShareIcon from "@material-ui/icons/Share";
import FavoriteBorderOutlined from "@material-ui/icons/FavoriteBorderOutlined";
import blogPostListItemStyles from "../../styles/components/blogs/BlogPostListItem.module.css";
import { motion } from "framer-motion";
import {
  fadeAnimationVariant,
  fadeWidthAnimationVariant,
} from "../../services/utilities";

const BlogPostListItem = ({ id }) => {
  return (
    <motion.div
      className={blogPostListItemStyles.blog}
      variants={fadeAnimationVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{
        duration: 0.5,
        delay: 1.5 + id,
      }}
    >
      <motion.p
        className={blogPostListItemStyles.topText}
        variants={fadeWidthAnimationVariant}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{
          duration: 0.5,
          delay: 1.5 + id + 0.2,
        }}
      >
        On: April 18, 2018 / Comments: 1 / Views: 212
      </motion.p>
      <motion.p
        className={blogPostListItemStyles.title}
        variants={fadeWidthAnimationVariant}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{
          duration: 0.5,
          delay: 1.5 + id + 0.4,
        }}
      >
        Highlighting what’s important about questions & Answers on Discy
        Community!
      </motion.p>
      <motion.p
        className={blogPostListItemStyles.author}
        variants={fadeWidthAnimationVariant}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{
          duration: 0.5,
          delay: 1.5 + id + 0.6,
        }}
      >
        <Link href="#">Agdam Bagdam</Link>
      </motion.p>
      <motion.img
        src="https://neilpatel.com/wp-content/uploads/2018/10/blog.jpg"
        alt="blog"
        className={blogPostListItemStyles.image}
        variants={fadeWidthAnimationVariant}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{
          duration: 0.5,
          delay: 1.5 + id + 0.8,
        }}
      />
      <motion.p
        className={blogPostListItemStyles.blogText}
        variants={fadeWidthAnimationVariant}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{
          duration: 0.5,
          delay: 1.5 + id + 1,
        }}
      >
        We want to make it easier to learn more about a question and highlight
        key facts about it — such as how popular the question is, how many
        people are interested in it, and who the audience is. To accomplish
        that, today we’re introducing Question Overview, a new section on the
        question page that will make it easier to find the most important
        information about a question and its audience. Question Overview
        includes all of the information from the old Stats section, as well as
        new facts such as inmotion.pidual question followers you may be
        interested in (e.g. people you follow or other notable users), recent
        views on the question, or if the question is Most Wanted in a topic. We
        have lots of ideas for ways to make the Quora product and experience
        better. But we also value keeping our simple so everyone can focus on
        the most important features. Today we’re introducing Labs*, a new way we
        can bring features we haven’t chosen to introduce broadly as an option
        for you to try out. We hope that the products we build for Labs will
        make your Quora experience more enjoyable. Without further ado, our
        first ever Labs feature is: Keyboard Shortcuts! You will be able to
        navigate and take actions on Discy awesome features on the web without
        ever lifting your fingers off your keyboard. To get started, go to your
        Settings page and click on the Labs tab. Keeping quality high is
        Disuss’s number one priority as we work to achieve our mission. In the
        coming weeks and months, we’ll be making major changes to strengthen
        quality. These changes will reward great questions and answers with
        better ranking and distribution and marginalize mediocre and low-quality
        answers. In other words: high-quality answers and useful knowledge
        shared will reach and help more people. Today, we’ve published a new
        in-depth answer that describes what quality means on Quora, and what it
        means to be helpful. What a helpful answer looks like. In summary,
        helpful and high-quality answers.
      </motion.p>
      <div className={blogPostListItemStyles.buttons}>
        <IconButton
          style={{ paddingLeft: 7, paddingTop: 11, paddingRight: 11 }}
          className={blogPostListItemStyles.button}
        >
          <FavoriteBorderOutlined fontSize="small" style={{ marginLeft: 4 }} />
        </IconButton>
        <button className={blogPostListItemStyles.button}>Read More</button>
        <IconButton
          style={{ paddingLeft: 7, paddingTop: 11, paddingRight: 11 }}
          className={blogPostListItemStyles.button}
        >
          <ShareIcon fontSize="small" style={{ marginLeft: 4 }} />
        </IconButton>
      </div>
    </motion.div>
  );
};

export default BlogPostListItem;
