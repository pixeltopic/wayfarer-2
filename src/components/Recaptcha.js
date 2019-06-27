import React, { Component } from "react";
import GoogleRecaptcha from "react-recaptcha";

class Recaptcha extends Component {
  componentDidMount() {
    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }

  render() {
    return (
      <div style={this.props.center ? { textAlign: "center" } : {}}>
        <div style={{ marginTop: "7px", display: "inline-block" }}>
          <GoogleRecaptcha
            sitekey={this.props.sitekey || process.env.REACT_APP_GOOGLE_RECAPTCHA_KEY}
            render="explicit"
            onloadCallback={this.props.onloadCallback}
            verifyCallback={this.props.verifyCallback}
            expiredCallback={this.props.expiredCallback}
          />
          {this.props.children}
        </div>
      </div>
    );
  }
}

Recaptcha.defaultProps = {
  onloadCallback: null,
  verifyCallback: null,
  expiredCallback: null,
  center: false,
  sitekey: null
};

export default Recaptcha;