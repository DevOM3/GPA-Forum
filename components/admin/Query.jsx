import React, { useState, useEffect } from "react";
import styles from "../../styles/components/admin/Query.module.css";
import HeaderStyles from "../../styles/components/admin/DashboardHeader.module.css";
import { db } from "../../services/firebase";
import QueryLayout from "./QueryLayout";

const Query = () => {
  const [searchString, setSearchString] = useState("");
  const [queries, setQueries] = useState([]);
  useEffect(() => {
    db.collection("Queries").onSnapshot((snapshot) =>
      setQueries(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          query: doc.data()?.query,
          by: doc.data()?.by,
          time: doc.data()?.timestamp,
          queryType: doc.data()?.queryType,
        }))
      )
    );
  }, []);

  return (
    <div>
      <div className={HeaderStyles.path}>
        <i className={`fas fa-user-shield ${HeaderStyles.admin_icon}`}></i>
        Admin/
        <span className={HeaderStyles.path_link}>Queries</span>
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

      <div className={styles.queries}>
        {queries
          .filter(
            (query) =>
              query?.query
                ?.toLowerCase()
                ?.includes(searchString?.toLowerCase()) ||
              query.queryType
                ?.toLowerCase()
                .includes(searchString.toLowerCase())
          )
          .map((query) => (
            <QueryLayout
              id={query.id}
              query={query.query}
              time={query.time}
              by={query.by}
              key={query.id}
            />
          ))}
      </div>
    </div>
  );
};

export default Query;
