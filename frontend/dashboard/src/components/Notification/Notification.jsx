import React from "react";
import "./Notification.css";
import PropTypes from "prop-types";

const BASE_URL = "https://res.cloudinary.com/bukkapp/image/upload";

const Notification = props => {
  return (
    <div className="Notification">
      {props.type === "success" && (
        <img
          className="notification-image"
          src={BASE_URL + "/v1547582645/Bukk/Assets/Icons/success.png"}
          alt="Error"
        />
      )}
      {props.type === "notification" && (
        <img
          className="notification-image"
          src={BASE_URL + "/v1547583064/Bukk/Assets/Icons/bell.png"}
          alt="Notification"
        />
      )}
      {props.type === "warn" && (
        <img
          className="notification-image"
          src={BASE_URL + "/v1547582658/Bukk/Assets/Icons/warning.png"}
          alt="Error"
        />
      )}
      {props.type === "error" && (
        <img
          className="notification-image"
          src={BASE_URL + "/v1547582568/Bukk/Assets/Icons/error.png"}
          alt="Error"
        />
      )}
      {props.type === "system" && (
        <img
          className="notification-image"
          src={BASE_URL + "/v1547582608/Bukk/Assets/Icons/settings.png"}
          alt="Error"
        />
      )}
      <div className="notification-content">
        {props.title && (
          <div className="notification-title">
            <h1>{props.title}</h1>
          </div>
        )}
        <div className="notification-text">{props.text}</div>
      </div>
    </div>
  );
};

Notification.propTypes = {
  text: PropTypes.string,
  type: PropTypes.oneOf(["success", "error", "warn", "system", "notification"])
};

export default Notification;
