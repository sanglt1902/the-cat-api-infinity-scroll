import React, { Component } from 'react';
import InfiniteScroll from "react-infinite-scroll-component";
import axio from 'axios';
import './App.css';

const style = {
  margin: 6,
  padding: 8,
  width: "100%",
  maxWidth: "400px",
  height: "auto",
};

const api = 'https://thecatapi.com/api/images/get?format=xml&results_per_page=5';
let parser = new DOMParser();

class App extends Component {
  state = {
    items: [],
  };
  fetchMoreData = () => {
    let xmlDoc, images;
    axio.get(api).then((response) => {
      xmlDoc = parser.parseFromString(response.data, "application/xml");
      images = xmlDoc.getElementsByTagName('image');
      for (var xmlObject of images) {
        let image = {
          url: '',
          src: ''
        }
        image.url = xmlObject.getElementsByTagName('url')[0].innerHTML;
        image.src = xmlObject.getElementsByTagName('source_url')[0].innerHTML
        this.state.items.push(image);
      }

    }).catch((error) => {
      console.error(error);
    });
    setTimeout(() => {
      this.setState({
        items: this.state.items
      });
    }, 10);
  }
  render() {
    return (
      <div className="App">
        <InfiniteScroll dataLength={this.state.items.length}
          next={this.fetchMoreData}
          hasMore={true}
          loader={<div><h4>Loading...</h4><img src={'https://loading.io/spinners/cutiefox/lg.cutie-fox-spinner.gif'}  style={style}/></div>}>
          {(this.state.items[0]) ?
            this.state.items.map((i, index) => (
              <div key={index} >
                <div>
                  <img src={i.url} alt={i.src}  style={style}/>
                </div> </div>
            )) : this.fetchMoreData()}
        </InfiniteScroll>
      </div>
    );
  }
}

export default App;
