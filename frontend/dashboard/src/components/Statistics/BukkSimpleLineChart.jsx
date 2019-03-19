import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { colors } from "../colors";

/* ===============================================================================
  STYLED COMPONENTS
=============================================================================== */

const StyledLineChart = styled(LineChart)``;

/* ============================================================================ */

export class BukkSimpleLineChart extends Component {
  render() {
    return (
      <ResponsiveContainer width="100%" height={this.props.height}>
        <StyledLineChart data={this.props.data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={colors[this.props.color]}
            strokeWidth={3}
          />
        </StyledLineChart>
      </ResponsiveContainer>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BukkSimpleLineChart);
