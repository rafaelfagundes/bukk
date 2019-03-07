import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const BASE_URL = "https://res.cloudinary.com/bukkapp/image/upload";

/* ===============================================================================
  STYLED COMPONENTS
=============================================================================== */

const StyledNotification = styled.div`
  display: flex;
  flex-direction: row;
`;

const NotificationImage = styled.img`
  width: 48px !important;
  height: 48px !important;
`;

const NotificationContent = styled.div`
  padding: 0 10px 0 10px;
  width: 230px;

  > div h1 {
    font-size: 1rem !important;
  }
`;

/* ============================================================================ */

const Notification = props => {
  return (
    <StyledNotification>
      {props.type === "success" && (
        <NotificationImage
          src={BASE_URL + "/v1547582645/Bukk/Assets/Icons/success.png"}
          alt="Success"
        />
      )}
      {props.type === "notification" && (
        <NotificationImage
          src={BASE_URL + "/v1547583064/Bukk/Assets/Icons/bell.png"}
          alt="Notification"
        />
      )}
      {props.type === "warn" && (
        <NotificationImage
          src={BASE_URL + "/v1547582658/Bukk/Assets/Icons/warning.png"}
          alt="Warning"
        />
      )}
      {props.type === "error" && (
        <NotificationImage
          src={BASE_URL + "/v1547582568/Bukk/Assets/Icons/error.png"}
          alt="Error"
        />
      )}
      {props.type === "system" && (
        <NotificationImage
          src={BASE_URL + "/v1547582608/Bukk/Assets/Icons/settings.png"}
          alt="System"
        />
      )}
      {props.type === "loading" && (
        <NotificationImage
          src={BASE_URL + "/v1547582632/Bukk/Assets/Icons/settings-9.png"}
          alt="Loading"
        />
      )}
      <NotificationContent>
        {props.title && (
          <div>
            <h1>{props.title}</h1>
          </div>
        )}
        <div className="notification-text">{props.text}</div>
      </NotificationContent>
    </StyledNotification>
  );
};

Notification.propTypes = {
  text: PropTypes.string,
  type: PropTypes.oneOf([
    "success",
    "error",
    "warn",
    "system",
    "notification",
    "loading"
  ])
};

export default Notification;
