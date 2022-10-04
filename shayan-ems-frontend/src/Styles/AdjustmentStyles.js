import { Grid, styled } from "@material-ui/core";

export const modalStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "Arial",
};
export const modalHeader = {
  background: "#232F3E",
  color: "white",
  textAlign: "center",
  paddingTop: "11px",
  paddingBottom: "0.02px",
  fontSize: "1.2rem",
};
export const modalBody = {
  minWidth: "700px",
  maxWidth: "700px",
  minHeight: "350px",
  maxHeight: "50vh",
  overflow: "auto",
  padding: "1rem",
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  flexDirection: "column",
  overflowX: "hidden",
};
export const GridContainer = styled(Grid)(() => ({
  justifyContent: "center",
  alignItems: "center",
}));

export const Heading = styled("h2")(() => ({
  fontSize: "1rem",
  whiteSpace: "nowrap",
  marginBottom: "15px",
}));
export const FlexCont = styled("div")(() => ({
  display: "flex",
  justifyContent: "flex-end",
  width: "100%",
}));
export const closeButton = {
  float: "right",
  marginRight: "1rem",
  cursor: "pointer",
};
