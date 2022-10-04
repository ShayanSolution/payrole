
import React from "react";
import { ToastContainer } from "react-toastify";
import MonthlyQuotaAdd from "../../components/MonthlyQuotaAdd";
import { useTheme } from "@material-ui/styles";
import BalanceAllLeaves from "../../components/BalanceAllLeaves";
import BalanceSingleLeave from "../../components/BalanceSingleLeave";

const MonthlyQuota = () => {
  const theme = useTheme();
    
  return (
    <div
      style={{
        margin: "auto",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        padding: theme.spacing.unit,
      }}
    >
      <MonthlyQuotaAdd/>
      <BalanceSingleLeave/>
      <BalanceAllLeaves/>
      <ToastContainer />
    </div>
  );
};

export default MonthlyQuota;
