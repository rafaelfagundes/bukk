import React from "react";
import "./PaymentDetails.css";

const PaymentDetails = props => (
  <div className="PaymentDetails">
    <div className="payment-details-type">
      <p>Pagamento no local</p>
      <div className="payment-details-types">
        {props.types.map(item => (
          <img
            src={item.icon}
            key={item.id}
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
          <span>{String(props.total).split(".")[0]}</span>
          <span className="payment-details-price-amount__digits">
            ,
            {String(props.total).split(".")[1].length === 1
              ? String(props.total).split(".")[1] + "0"
              : String(props.total)
                  .split(".")[1]
                  .substring(0, 2)}
          </span>
        </div>
      </div>
    </div>
  </div>
);

export default PaymentDetails;
