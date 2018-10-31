import React, { Component } from "react";
import "./Breadcrumbs.css";

class Breadcrumbs extends Component {
  createItems = (numPages, currentPage) => {
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

  render() {
    let pages = this.createItems(this.props.pages, this.props.currentPage);
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
  }
}

export default Breadcrumbs;
