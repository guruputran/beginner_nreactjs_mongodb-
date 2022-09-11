/** @format */

import React, { Component } from "react";
import Modal from "./Modal";
import axios from "axios";
import { API_URL } from "../apis/api";

class Employee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employeeList: [],
      modal: false,
      activeItem: {
        name: "",
        email: "",
        salary: "",
      },
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    axios
      .get(`${API_URL}/employees`)
      .then((res) => this.setState({ employeeList: res.data }))
      .catch((err) => console.log(err));
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  handleSubmit = (item) => {
    this.toggle();

    if (item._id) {
      axios
        .put(`${API_URL}/employee/update/${item._id}`, item, {
          headers: {
            "Content-type": "application/json",
          },
        })
        .then((res) => this.refreshList());
      return;
    }
    axios
      .post(`${API_URL}/employee/add`, item, {
        headers: {
          "Content-type": "application/json",
        },
      })
      .then((res) => this.refreshList());
  };

  handleDelete = (item) => {
    axios
      .delete(`${API_URL}/employee/${item._id}/`, {
        headers: {
          "Content-type": "application/json",
        },
      })
      .then((res) => this.refreshList());
  };

  createItem = () => {
    const item = { name: "", email: "", salary: "" };

    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  editItem = (item) => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  renderItems = () => {
    const newItems = this.state.employeeList;
    return newItems.map((item) => (
      <>
        <div>{item.name}</div>
        <div>{item.email}</div>
        <div>{item.salary}</div>
        <li
          key={item._id}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          <span>
            <button
              className="btn btn-secondary mr-2"
              onClick={() => this.editItem(item)}
            >
              Edit
            </button>
            <button
              className="btn btn-danger"
              onClick={() => this.handleDelete(item)}
            >
              Delete
            </button>
          </span>
        </li>
      </>
    ));
  };

  render() {
    return (
      <main className="container">
        <h1 className="text-white text-uppercase text-center my-4">
          Employee app
        </h1>
        <div className="row">
          <div className="col-md-6 col-sm-10 mx-auto p-0">
            <div className="card p-3">
              <div className="mb-4">
                <button className="btn btn-primary" onClick={this.createItem}>
                  Add Employee
                </button>
              </div>

              <ul className="list-group list-group-flush border-top-0">
                {this.renderItems()}
              </ul>
            </div>
          </div>
        </div>
        {this.state.modal ? (
          <Modal
            activeItem={this.state.activeItem}
            toggle={this.toggle}
            onSave={this.handleSubmit}
          />
        ) : null}
      </main>
    );
  }
}

export default Employee;
