import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { setCurrentPage } from "../dashboardActions";
import BukkSimpleLineChart from "../Statistics/BukkSimpleLineChart";
import FormTitle from "../Common/FormTitle";
import { colors } from "../colors";

const data = [
  {
    value: 31
  },
  {
    value: 48
  },
  {
    value: 37
  },
  {
    value: 45
  },
  {
    value: 27
  },
  {
    value: 61
  },
  {
    value: 75
  }
];

/* ===============================================================================
  STYLED COMPONENTS
=============================================================================== */
const TopCharts = styled.div`
  display: flex;
  flex-direction: row;
`;

const GraphItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 25%;

  text-align: center;
  border-radius: 4px;
  box-sizing: border-box;

  margin-right: 10px;

  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.03);
  /* box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5); */

  &:last-child {
    margin-right: 0px !important;
  }
`;

const ContentHolder = styled.div`
  width: 100%;
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

const BottomLine = styled.div`
  height: 5px;
  width: 100%;
  background-color: ${props => colors[props.color]};
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
`;
/* ============================================================================ */

export class Overview extends Component {
  state = {
    alreadyUpdated: false
  };

  componentDidMount() {
    if (this.props.company) {
      this.props.setCurrentPage({
        icon: "home",
        title: this.props.company.companyNickname
      });
      this.setState({ alreadyUpdated: true });
    }
  }
  componentDidUpdate() {
    if (!this.state.alreadyUpdated && this.props.company) {
      this.props.setCurrentPage({
        icon: "home",
        title: this.props.company.companyNickname
      });
      this.setState({ alreadyUpdated: true });
    }
  }
  render() {
    return (
      <>
        <FormTitle text="Agendamentos" first />
        <TopCharts>
          <GraphItem>
            <ContentHolder>
              <BukkSimpleLineChart height={50} data={data} color="purple" />
              <Value>5</Value>
              <Label>Hoje</Label>
            </ContentHolder>
            <BottomLine color="purple" />
          </GraphItem>
          <GraphItem>
            <ContentHolder>
              <BukkSimpleLineChart height={50} data={data} color="olive" />
              <Value>18</Value>
              <Label>Semana</Label>
            </ContentHolder>
            <BottomLine color="olive" />
          </GraphItem>
          <GraphItem>
            <ContentHolder>
              <BukkSimpleLineChart height={50} data={data} color="blue" />
              <Value>82</Value>
              <Label>Mês</Label>
            </ContentHolder>
            <BottomLine color="blue" />
          </GraphItem>
          <GraphItem>
            <ContentHolder>
              <BukkSimpleLineChart height={50} data={data} color="teal" />
              <Value>320</Value>
              <Label>Ano</Label>
            </ContentHolder>
            <BottomLine color="teal" />
          </GraphItem>
        </TopCharts>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    company: state.dashboard.company,
    currentPage: state.dashboard.currentPage,
    user: state.dashboard.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setCurrentPage: currentPage => dispatch(setCurrentPage(currentPage))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Overview);
