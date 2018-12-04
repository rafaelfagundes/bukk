import React, { Component } from "react";
import "./PaymentDetails.css";

class PaymentDetails extends Component {
  render() {
    return (
      <div className="PaymentDetails">
        <div className="payment-details-type">
          <p>Pagamento no local</p>
          <div className="payment-details-types">
            {this.props.types.map(item => (
              <img
                src={item.icon}
                key={item.paymentId}
                alt={item.name}
                title={item.name}
              />
            ))}
          </div>
        </div>
        <div className="payment-details-price">
          <div className="payment-details-price-total">Total</div>
          <div className="payment-details-price-value">
            <div className="payment-details-price-amount">
              <span className="payment-details-price-currency">R$</span>

              {this.props.total.indexOf(".") >= 0 && (
                <span>{this.props.total.split(".")[0]}</span>
              )}
              {this.props.total.indexOf(".") < 0 && (
                <span>{this.props.total}</span>
              )}

              <span className="payment-details-price-amount__digits">
                ,
                {this.props.total.indexOf(".") >= 0 && (
                  <React.Fragment>
                    {this.props.total.split(".")[1]}
                  </React.Fragment>
                )}
                {this.props.total.indexOf(".") < 0 && (
                  <React.Fragment>00</React.Fragment>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PaymentDetails;
