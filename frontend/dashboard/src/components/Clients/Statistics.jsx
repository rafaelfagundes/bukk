import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { colors } from "../colors";

/* ===============================================================================
  STYLED COMPONENTS
=============================================================================== */

const StyledStatistics = styled.div`
  display: flex;
  flex-direction: row;
`;

const Statistic = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: ${props => 100 / props.numberItems}%;

  text-align: center;
  border-radius: 4px;
  box-sizing: border-box;

  margin-right: 10px;

  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.03);

  &:last-child {
    margin-right: 0px !important;
  }
`;

const StatisticHolder = styled.div`
  padding: 20px;
`;

const Value = styled.div`
  font-size: 2rem;
  line-height: 2rem;
`;

const Label = styled.div`
  font-size: 1rem;
  text-transform: uppercase;
  line-height: 1.5rem;
  font-weight: 700;
  opacity: 0.8;
`;

const Prefix = styled.span`
  opacity: 0.6;
  font-size: 1.2rem;
  line-height: 2rem;
  margin-right: 3px;
`;

const Suffix = styled.span`
  opacity: 0.6;
  font-size: 1.2rem;
  line-height: 2rem;
  margin-left: 3px;
`;

const BottomLine = styled.div`
  height: 5px;
  width: 100%;
  background-color: ${props => colors[props.color]};
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
`;

const Digits = styled.span`
  opacity: 0.6;
  font-size: 1rem;
`;

/* ============================================================================ */

export class Statistics extends Component {
  currency = value => {
    let _value = String(value).split(".");
    return (
      <span>
        {_value[0]}
        <Digits>,{_value.length === 1 ? "00" : _value[1]}</Digits>
      </span>
    );
  };

  render() {
    return (
      <StyledStatistics>
        {this.props.stats.map((s, index) => (
          <Statistic key={index} numberItems={this.props.stats.length}>
            <StatisticHolder>
              <Value>
                <Prefix>{s.prefix}</Prefix>
                {s.type === "currency" ? this.currency(s.value) : s.value}
                <Suffix>{s.suffix}</Suffix>
              </Value>
              <Label>{s.label}</Label>
            </StatisticHolder>
            <BottomLine color={s.color} blue />
          </Statistic>
        ))}
      </StyledStatistics>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Statistics);
