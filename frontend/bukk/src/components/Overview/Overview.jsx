import React, { Component } from "react";
// import PropTypes from "prop-types";
import "./Overview.css";
import DashboardHeader from "../BukkUI/DashboardHeader/DashboardHeader";
import { LineChart, XAxis, Tooltip, CartesianGrid, Line } from "recharts";

class Overview extends Component {
  static defaultProps = {};
  static propTypes = {};

  render() {
    const data = [
      { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
      { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
      { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
      { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
      { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
      { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
      { name: "Page G", uv: 3490, pv: 4300, amt: 2100 }
    ];

    return (
      <div className="Overview">
        <DashboardHeader
          icon="dashboard"
          title="Geral"
          subtitle="Informações de sua empresa"
        />
        <LineChart
          width={250}
          height={250}
          data={data}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <XAxis dataKey="name" />
          <Tooltip />
          <CartesianGrid stroke="#f5f5f5" />
          <Line type="monotone" dataKey="uv" stroke="#ff7300" yAxisId={0} />
          <Line type="monotone" dataKey="pv" stroke="#387908" yAxisId={1} />
        </LineChart>
      </div>
    );
  }
}

export default Overview;
