const styles = (theme) => ({
  paper: {
    maxWidth: 750,
    margin: "auto",
    overflow: "hidden",
    display: "flex",
    flexWrap: "wrap",
    padding: theme.spacing.unit,
    boxShadow: "none !important",
  },
  form: {
    marginTop: theme.spacing.unit,
  },

  textField: {
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
    width: 200,
  },
  submitButton: {
    margin: theme.spacing.unit,
    marginTop: theme.spacing.unit * 2,
  },
  switch: {
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit,
  },

  formControl: {
    marginTop: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 2,
    width: 300,
  },
  modalStyle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Arial",
  },

  modalHeader: {
    background: "#232F3E",
    color: "white",
    textAlign: "center",
    paddingTop: "10px",
    paddingBottom: "0.02px",
  },
  modalBody: {
    padding: "10px",
    minWidth: "250px",
  },
});

export default styles;
