import React, { Component } from "react";

import "./App.css";

import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2
} from "react-html-parser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const decode = require("decode-html");
const request = require("superagent");
const JSON_URL =
  "https://secure.toronto.ca/cc_sr_v1/data/swm_waste_wizard_APR?limit=2000";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: "",
      data: [],
      searchResult: [],
      favourites: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAddFavourite = this.handleAddFavourite.bind(this);
  }

  handleChange(event) {
    this.setState({ keyword: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { keyword } = this.state;
    const result = this.state.data.filter(item => {
      if (
        item.body.includes(keyword) ||
        item.title.includes(keyword) ||
        item.keywords.includes(keyword) ||
        item.category.includes(keyword)
      )
        return true;
      return false;
    });
    this.setState({
      searchResult: result
    });
  }

  handleAddFavourite(item) {
    if (!this.state.favourites.includes(item))
      this.setState({
        favourites: this.state.favourites.concat(item)
      });
  }

  async componentDidMount() {
    const res = await request.get(JSON_URL);
    this.setState({ data: res.body });
  }

  render() {
    const { keyword, favourites, searchResult } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <p>Toronto Waste Lookup</p>
        </header>
        <form onSubmit={this.handleSubmit} className="searchWrapper">
          <input
            type="search"
            name="search"
            value={keyword}
            onChange={this.handleChange}
            placeholder="Keywords..."
            className="searchBar"
          />
          <button type="submit">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </form>
        <div className="items">
          {searchResult.map(item => (
            <div className="item">
              <div className="item-title">
                <div onClick={() => this.handleAddFavourite(item)}>
                  <FontAwesomeIcon icon={faStar} />
                </div>
                {ReactHtmlParser(decode(item.title))}
              </div>
              <div className="item-description">
                {ReactHtmlParser(decode(item.body))}
              </div>
            </div>
          ))}
        </div>
        <div className="typography">
          {favourites.length > 0 && <header>Favourites</header>}
        </div>
        <div className="items">
          {favourites.map(item => (
            <div className="item">
              <div className="item-title">
                {ReactHtmlParser(decode(item.title))}
              </div>
              <div className="item-description">
                {ReactHtmlParser(decode(item.body))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
