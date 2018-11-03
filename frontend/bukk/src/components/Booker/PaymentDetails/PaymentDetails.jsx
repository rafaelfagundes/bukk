import React, { Component } from "react";
import "./PaymentDetails.css";
import { Icon } from "semantic-ui-react";

class PaymentDetails extends Component {
  render() {
    return (
      <div className="PaymentDetails">
        <div className="payment-details-type">
          <p>Pagamento no local</p>
          <div className="payment-details-forms">
            <Icon name="cc visa" />
            <Icon name="cc mastercard" />
            <Icon name="cc amex" />
            <Icon name="cc diners club" />
            <Icon name="money bill alternate outline" />
          </div>
        </div>
        <div className="payment-details-price">
          <div className="payment-details-price-total">Total</div>
          <div className="payment-details-price-value">
            <div className="payment-details-price-amount">
              <span className="payment-details-price-currency">R$</span>
              <span>999</span>
              <span className="payment-details-price-amount__digits">,99</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PaymentDetails;