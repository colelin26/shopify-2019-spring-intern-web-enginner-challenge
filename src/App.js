import React, { Component } from "react";
import decode from "decode-html";
import request from "superagent";
import ReactHtmlParser from "react-html-parser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faStar } from "@fortawesome/free-solid-svg-icons";

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: "",
      data: [],
      searchResult: [],
      favourites: [],
      jsonURL:
        "https://secure.toronto.ca/cc_sr_v1/data/swm_waste_wizard_APR?limit=1000",
      ReactHtmlParserOptions: {
        decodeEntities: true,
        transform: function(node, index) {
          if (node.attribs && node.attribs.style !== undefined) {
            node.attribs.style = undefined;
          }
          if (
            node.type === "tag" &&
            node.name === "p" &&
            !node.children.length
          ) {
            return null;
          }
        }
      }
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAddFavourite = this.handleAddFavourite.bind(this);
    this.handleDeleteFavourite = this.handleDeleteFavourite.bind(this);
  }

  async componentDidMount() {
    const res = await request.get(this.state.jsonURL);
    this.setState({ data: res.body });
  }

  handleChange(event) {
    this.setState({ keyword: event.target.value });
    if (event.target.value === "") this.setState({ searchResult: [] });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { keyword } = this.state;
    const result = this.state.data.filter(item => {
      if (item.keywords.includes(keyword)) return true;
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

  handleDeleteFavourite(item) {
    if (this.state.favourites.includes(item))
      this.setState({
        favourites: this.state.favourites.filter(
          favourite => favourite.id !== item.id
        )
      });
  }

  render() {
    const {
      keyword,
      favourites,
      searchResult,
      ReactHtmlParserOptions
    } = this.state;

    return (
      <div className="App">
        <header className="appHeader">
          <p>Toronto Waste Lookup</p>
        </header>

        <form onSubmit={this.handleSubmit} className="searchWrapper">
          <input
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
              <div className="itemTitle">
                {favourites.includes(item) ? (
                  <div
                    className="favouriteIcon"
                    onClick={() => this.handleDeleteFavourite(item)}
                  >
                    <FontAwesomeIcon icon={faStar} />
                  </div>
                ) : (
                  <div
                    className="normalIcon"
                    onClick={() => this.handleAddFavourite(item)}
                  >
                    <FontAwesomeIcon icon={faStar} />
                  </div>
                )}
                {ReactHtmlParser(decode(item.title), ReactHtmlParserOptions)}
              </div>
              <div className="itemDescription">
                {ReactHtmlParser(decode(item.body), ReactHtmlParserOptions)}
              </div>
            </div>
          ))}
        </div>

        {favourites.length > 0 && (
          <div className="favouriteContainer">
            <div className="typography">
              <header>Favourites</header>
            </div>
            <div className="items">
              {favourites.map(item => (
                <div className="item">
                  <div className="itemTitle">
                    <div
                      className="favouriteIcon"
                      onClick={() => this.handleDeleteFavourite(item)}
                    >
                      <FontAwesomeIcon icon={faStar} />
                    </div>
                    {ReactHtmlParser(
                      decode(item.title),
                      ReactHtmlParserOptions
                    )}
                  </div>
                  <div className="itemDescription">
                    {ReactHtmlParser(decode(item.body), ReactHtmlParserOptions)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
