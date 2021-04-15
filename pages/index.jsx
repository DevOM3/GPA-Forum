import Head from "next/head";
import styles from "../styles/pages/Home.module.css";

const Home = () => {
  return (
    <div className={styles.home}>
      <Head>
        <title>GPA Forum</title>
        <link rel="icon" href="/images/logo.png" />
      </Head>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img src="/images/logo.png" alt="" />
        <h2>Welcome to GPA Forum</h2>
      </div>
    </div>
  );
};

export default Home;
