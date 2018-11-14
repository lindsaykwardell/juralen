import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input
} from "reactstrap";

export default class LoadMapModal extends Component {
  state = {
    selectedMapID: ""
  };

  updateSelectedMapHandler = e => {
    this.setState({ selectedMapID: e.target.value });
  };

  render() {
    const maps = this.props.mapList.map(map => {
      return <option key={map.id} value={map.id}>{map.name}</option>;
    });
    return <Modal isOpen={this.props.modal} toggle={this.props.toggle}>
        <ModalHeader toggle={this.props.toggle}>Load Map</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>Select a map to load</Label>
            <Input type="select" value={this.state.selectedMapID} onChange={this.updateSelectedMapHandler}>
              <option value="" disabled>Choose...</option>
              {maps}
            </Input>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => this.props.loadMap(this.state.selectedMapID)}>
            Load
          </Button> <Button color="secondary" onClick={this.props.toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>;
  }
}
