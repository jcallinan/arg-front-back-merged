import printCheck from "@assets/icons/print-check-icon.svg";

function CheckRegister() {
  return (
 <div className="payment-form">
      <div className="bordered-box flex-column">
        <img src={printCheck} alt="Printer Icon" className="printer-icon" />
        <h6>Checks have Successfully Printed!</h6>
        <p className="p-xs">Click ‘Finalize’ to post to general ledger</p>
      </div>
    </div>  )
}

export default CheckRegister;
