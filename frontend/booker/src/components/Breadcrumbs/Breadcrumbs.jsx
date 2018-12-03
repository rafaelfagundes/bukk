import React from "react";
import "./Breadcrumbs.css";

const createItems = (numPages, currentPage) => {
  let pages = [];

  for (let index = 1; index <= numPages; index++) {
    if (index === Number(currentPage)) {
      pages.push({
        isActive: true,
        pageNumber: index
      });
    } else {
      pages.push({
        isActive: false,
        pageNumber: index
      });
    }
  }
  return pages;
};

const Breadcrumbs = props => {
  let pages = createItems(props.pages, props.currentPage);

  return (
    <div className="breadcrumbs-page-numbers">
      {pages.map(function(item, index) {
        return (
          <span
            key={index}
            className={
              "breadcrumbs-page-number " +
              (item.isActive ? "breadcrumbs-page-number__active" : "")
            }
          >
            {item.pageNumber}
          </span>
        );
      })}
    </div>
  );
};

export default Breadcrumbs;
