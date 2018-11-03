import React from "react";
import Radium from "radium";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import { NavLink } from "react-router-dom";



export default Radium(
  class Example extends React.Component {
    constructor(props) {
      super(props);

      this.toggle = this.toggle.bind(this);
      this.state = {
        isOpen: false
      };
    }
    toggle() {
      this.setState({
        isOpen: !this.state.isOpen
      });
    }
    render() {
      return (
        <div>
          <Navbar dark expand="md">
            <NavbarBrand href="/">
              {/*<img src={logo} style={{ width: "60px" }} alt="logo" />*/}
              Star Commander
            </NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <NavLink to="/" exact className="nav-link" activeClassName="active">
                    Home
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink to="/schedule" className="nav-link" activeClassName="active">
                    Schedule
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink to="/shipments" className="nav-link" activeClassName="active">
                    Shipments
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink to="/resources" className="nav-link" activeClassName="active">
                    Resources
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink to="/contacts" className="nav-link" activeClassName="active">
                    Contacts
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink to="/reports" className="nav-link" activeClassName="active">
                    Reports
                  </NavLink>
                </NavItem>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    Lindsay Wardell
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem>Account Settings</DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem>Log Out</DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Nav>
            </Collapse>
          </Navbar>
        </div>
      );
    }
  }
);
