import React, { useState } from 'react'
import blogsStyles from "../styles/pages/Blogs.module.css";
import ShareIcon from '@material-ui/icons/Share';
import { Button, Divider, TextareaAutosize, TextField } from '@material-ui/core';
import Link from "next/link";
import { AccountCircle } from '@material-ui/icons';

const blogs = () => {

    const [rows,setRows] = useState(1)
    const onFocus = () => {
        setRows(5)
    }
    return (
        <div className={blogsStyles.blogpage}>
            <div className={blogsStyles.blog}>
                <div className={blogsStyles.date}>
                    On: April 18, 2018 / Posted in Work / Comments: 1 Views: 212
                </div>
                <div className={blogsStyles.title}>
                    Highlighting what’s important about questions & Answers on Discy Community!
                </div>
                <div className={blogsStyles.author}>
                    <Link href="#">
                        Agdam Bagdam
                    </Link> 
                </div>
                <img src="/images/samuel-ferrara-6dqCCs0vCcU-unsplash.jpg" alt="blog" className={blogsStyles.image}/>
                <div className={blogsStyles.blogtext}>
                We want to make it easier to learn more about a question and highlight key facts about it — such as how popular the question is, how many people are interested in it, and who the audience is. To accomplish that, today we’re introducing Question Overview, a new section on the question page that will make it easier to find the most important information about a question and its audience. Question Overview includes all of the information from the old Stats section, as well as new facts such as individual question followers you may be interested in (e.g. people you follow or other notable users), recent views on the question, or if the question is Most Wanted in a topic. We have lots of ideas for ways to make the Quora product and experience better. But we also value keeping our simple so everyone can focus on the most important features. Today we’re introducing Labs*, a new way we can bring features we haven’t chosen to introduce broadly as an option for you to try out. We hope that the products we build for Labs will make your Quora experience more enjoyable. Without further ado, our first ever Labs feature is: Keyboard Shortcuts! You will be able to navigate and take actions on Discy awesome features on the web without ever lifting your fingers off your keyboard. To get started, go to your Settings page and click on the Labs tab. Keeping quality high is Disuss’s number one priority as we work to achieve our mission. In the coming weeks and months, we’ll be making major changes to strengthen quality. These changes will reward great questions and answers with better ranking and distribution and marginalize mediocre and low-quality answers. In other words: high-quality answers and useful knowledge shared will reach and help more people. Today, we’ve published a new in-depth answer that describes what quality means on Quora, and what it means to be helpful. What a helpful answer looks like. In summary, helpful and high-quality answers.
                </div>
                <div className={blogsStyles.share}>
                    <Button>
                        <ShareIcon/>
                          Share this Article
                    </Button>
                </div>
                <Divider/>
                <div className={blogsStyles.comments}>
                    <AccountCircle 
                    color="action" 
                    fontSize="large"
                    />
                    <TextareaAutosize aria-multiline="true" rowsMin={rows} onFocusCapture={onFocus} placeholder="Enter your comment" style={{border:"none",fontSize:"large",marginLeft:"2vh"}} />
                </div>
                
                <Divider/>
            </div>
        </div>
    )
}

export default blogs
