import React from "react";
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

export default props => {
  return (
    <Modal isOpen={props.modal} toggle={props.toggle}>
      <ModalHeader toggle={props.toggle}>Save Map</ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label>Map Name:</Label>
          <Input type="text" value={props.mapName} onChange={props.updateMapName} />
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={props.saveMap}>
          Save
        </Button>{" "}
        <Button color="secondary" onClick={props.toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};
