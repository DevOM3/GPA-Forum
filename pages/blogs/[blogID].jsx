import React, { useState } from "react";
import blogsStyles from "../../styles/pages/blogs/Blog.module.css";
import ShareIcon from "@material-ui/icons/Share";
import { Divider, IconButton } from "@material-ui/core";
import Link from "next/link";
import {
  FavoriteBorderRounded,
  ModeCommentOutlined,
  SendRounded,
} from "@material-ui/icons";
import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  fadeAnimationVariant,
  fadeWidthAnimationVariant,
  pageAnimationVariant,
} from "../../services/utilities";

const Blog = () => {
  const [comment, setComment] = useState("");

  const auto_grow = (element) => {
    element.style.height = "5px";
    element.style.height = element.scrollHeight + "px";
  };

  useEffect(() => {
    auto_grow(document.getElementById("comment-input"));
  }, []);

  return (
    <motion.div
      className={blogsStyles.blogPage}
      variants={pageAnimationVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className={blogsStyles.blog}>
        <motion.p
          className={blogsStyles.topText}
          variants={fadeAnimationVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{
            duration: 0.5,
            delay: 1.5,
          }}
        >
          On: April 18, 2018 / Likes: 4 / Comments: 1 / Views: 212
        </motion.p>
        <motion.p
          className={blogsStyles.title}
          variants={fadeAnimationVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{
            duration: 0.5,
            delay: 1.7,
          }}
        >
          Highlighting what’s important about questions & Answers on Discy
          Community!
        </motion.p>
        <Link href={`/profile/`}>
          <motion.a
            className={blogsStyles.author}
            variants={fadeAnimationVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{
              duration: 0.5,
              delay: 1.9,
            }}
          >
            Agdam Bagdam
          </motion.a>
        </Link>
        <motion.img
          src="https://neilpatel.com/wp-content/uploads/2018/10/blog.jpg"
          alt="blog"
          className={blogsStyles.image}
          variants={fadeWidthAnimationVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{
            duration: 1.1,
            delay: 2.1,
          }}
        />
        <motion.p
          className={blogsStyles.blogtext}
          variants={fadeAnimationVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{
            duration: 0.5,
            delay: 2.3,
          }}
        >
          We want to make it easier to learn more about a question and highlight
          key facts about it — such as how popular the question is, how many
          people are interested in it, and who the audience is. To accomplish
          that, today we’re introducing Question Overview, a new section on the
          question page that will make it easier to find the most important
          information about a question and its audience. Question Overview
          includes all of the information from the old Stats section, as well as
          new facts such as individual question followers you may be interested
          in (e.g. people you follow or other notable users), recent views on
          the question, or if the question is Most Wanted in a topic. We have
          lots of ideas for ways to make the Quora product and experience
          better. But we also value keeping our simple so everyone can focus on
          the most important features. Today we’re introducing Labs*, a new way
          we can bring features we haven’t chosen to introduce broadly as an
          option for you to try out. We hope that the products we build for Labs
          will make your Quora experience more enjoyable. Without further ado,
          our first ever Labs feature is: Keyboard Shortcuts! You will be able
          to navigate and take actions on Discy awesome features on the web
          without ever lifting your fingers off your keyboard. To get started,
          go to your Settings page and click on the Labs tab. Keeping quality
          high is Disuss’s number one priority as we work to achieve our
          mission. In the coming weeks and months, we’ll be making major changes
          to strengthen quality. These changes will reward great questions and
          answers with better ranking and distribution and marginalize mediocre
          and low-quality answers. In other words: high-quality answers and
          useful knowledge shared will reach and help more people. Today, we’ve
          published a new in-depth answer that describes what quality means on
          Quora, and what it means to be helpful. What a helpful answer looks
          like. In summary, helpful and high-quality answers.
        </motion.p>
        <div className={blogsStyles.buttons}>
          <button className={blogsStyles.button}>
            {/* <Badge
              badgeContent={4}
              color="secondary"
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            > */}
            <FavoriteBorderRounded
              fontSize="small"
              style={{ marginRight: 4 }}
            />
            {/* </Badge> */}
            Like this Article
          </button>
          <button className={blogsStyles.button}>
            Share this Article
            <ShareIcon fontSize="small" style={{ marginLeft: 4 }} />
          </button>
        </div>
        <Divider />
        <div className={blogsStyles.commentInputDiv}>
          <ModeCommentOutlined
            fontSize="small"
            style={{ marginLeft: 4, color: "grey" }}
          />
          <textarea
            id="comment-input"
            type="text"
            className={blogsStyles.commentInput}
            onInput={() => auto_grow(document.getElementById("comment-input"))}
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            maxLength={71}
          />
          <IconButton>
            <SendRounded fontSize="small" style={{ marginRight: 4 }} />
          </IconButton>
        </div>
        <Divider />
      </div>
    </motion.div>
  );
};

export default Blog;
