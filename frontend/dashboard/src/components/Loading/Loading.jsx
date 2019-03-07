import React from "react";
import styled, { keyframes } from "styled-components";

/* ===============================================================================
  STYLED COMPONENTS
=============================================================================== */

const bounce = keyframes`
  0%,
  100% {
    transform: scale(0);
  }
  50% {
    transform: scale(1);
  }
`;

const rotate = keyframes`
  100% {
    transform: rotate(360deg);
  }
`;

const StyledLoading = styled.div`
  margin: 100px auto;
  width: 40px;
  height: 40px;
  position: relative;
  text-align: center;

  -webkit-animation: ${rotate} 2s infinite linear;
  animation: ${rotate} 2s infinite linear;

  > div {
    width: 60%;
    height: 60%;
    display: inline-block;
    position: absolute;
    top: 0;
    background-color: #800080;
    border-radius: 100%;

    -webkit-animation: ${bounce} 2s infinite ease-in-out;
    animation: ${bounce} 2s infinite ease-in-out;
  }

  > .dot2 {
    top: auto;
    bottom: 0;
    -webkit-animation-delay: -1s;
    animation-delay: -1s;
  }
`;

/* ============================================================================ */

const Loading = () => {
  return (
    <StyledLoading>
      <div className="dot1" />
      <div className="dot2" />
    </StyledLoading>
  );
};

export default Loading;
