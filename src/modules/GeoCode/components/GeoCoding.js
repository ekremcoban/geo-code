import React, { Component } from 'react';
import GeoCode from "react-geocode";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Spinner from '../../../components/Spinner/Spinner';
import Modal from '../../../components/Modal/Modal';

const apiKey = "You have to take api key"; 
let errorAddressView;
let sumNumberAddress;

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  container: {
    padding: "15px",
    boxSizing: "border-box"
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  button: {
    margin: theme.spacing.unit,
    height: "50px"
  },
  textField: {
    height: "450px !important",
    fontSize: 12
  }
});

class GeoCoding extends Component {
  state = {
    multiLineLeft: "",
    multiLineRight: "",
    latitude: null,
    longitude: null,
    address: "",
    addressCount: 0,
    showModal: null
  };

  onGeoCoding = async () => {
    let rowCount = 0;
    let addressArray = "";
    let error = 0;

    this.setState({
      showModal: true
    });

    while (rowCount < this.state.multiLineLeft.split('\n').length) {
      let index = 0;
      let row = this.state.multiLineLeft.split("\n")[rowCount] + 1;
      row = row.replace(",", ".");


      if (row.indexOf("\t") !== -1) {
        index = row.indexOf("\t");
        this.state.latitude = row.slice(0, index);
        row = row.replace(",", ".");
        this.state.longitude = row.slice(index + 1, row.indexOf("\n"));
        //console.log("latitude:" + latitude + " " + "longitude:" + longitude);
      }
      else if (row.indexOf(" ") !== -1) {
        index = row.indexOf(" ");
        this.state.latitude = row.slice(0, index);
        row = row.replace(",", ".");
        this.state.longitude = row.slice(index + 1, row.indexOf("\n"));
        //console.log("latitude:" + latitude + " " + "longitude:" + longitude);
      }
      else if (row.indexOf("-") !== -1) {
        index = row.indexOf("-");
        this.state.latitude = row.slice(0, index);
        row = row.replace(",", ".");
        this.state.longitude = row.slice(index + 1, row.indexOf("\n"));
        //console.log("latitude:" + latitude + " " + "longitude:" + longitude);
      }

      if (row.slice(0, 1).indexOf("1") === -1) {
        GeoCode.setApiKey(apiKey);
        GeoCode.enableDebug();

        try {
          const geoResponse = await GeoCode
            .fromLatLng(this.state.latitude, this.state.longitude);
          addressArray += geoResponse.results[0].formatted_address + "\n";
        }
        catch (Error) {
          addressArray += "ADRES ÇEVRİLEMEDİ...!" + "\n";
          error++;
        }
      }
      rowCount++;
      this.setState({
        addressCount: rowCount
      });
    };
    if (this.state.addressCount > 0) {
      sumNumberAddress = <div style={{marginTop: "10px"}}>Girilen Koordinat Sayısı: {this.state.addressCount}</div>;
    }
    if (error > 0) {
      errorAddressView = <div style={{color: "red", fontWeight: "bolder"}}>Çevrilemeyen Adres Sayısı: {error}</div>
    }
    else {
      errorAddressView = <div>Çevrilemeyen Adres Sayısı: 0</div>
    }

    this.setState({
      address: addressArray,
      showModal: false
    });
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Grid container className={classes.container}>
          <Modal show={this.state.showModal}>
            <Spinner />
            Yapılan İşlem Oranı: % {Math.round((this.state.addressCount / this.state.multiLineLeft.split('\n').length) * 100)}
          </Modal>
          <Grid item xs={12} sm={3}>
            <TextField
              id="outlined-multiline-flexible-left"
              label="Coğrafi Kod (x y)"
              multiline
              fullWidth
              InputProps={{
                classes: {
                  input: classes.textField,
                },
              }}
              value={this.state.multiLineLeft}
              onChange={this.handleChange('multiLineLeft')}
              margin="normal"
              helperText="Coğrafi Kod (x y)"
              variant="outlined"
            />
          </Grid>
          <Grid item sm={1}></Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="outlined-multiline-flexible-left"
              multiline
              fullWidth
              InputProps={{
                classes: {
                  input: classes.textField,
                },
              }}
              value={this.state.address}
              //onChange={this.handleChange('multiLineLeft')}
              margin="normal"
              helperText="Adres"
              variant="outlined"
            />
          </Grid>
        </Grid>
        <Grid container className={classes.container}>
          <Grid item xs={12} sm={1}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={this.onGeoCoding}>Adrese Çevir</Button>
          </Grid>
          <Grid item xs={12} sm={2}>
            {sumNumberAddress}
            {errorAddressView}
          </Grid>
        </Grid>
      </div>
    );
  }
}


export default withStyles(styles)(GeoCoding);