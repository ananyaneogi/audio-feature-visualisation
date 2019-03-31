import React, { Component } from 'react';
import './App.scss';
import MusicChart from './components/MusicChart'

class App extends Component {
    constructor(props) {
        super(props);
        this.child = React.createRef();

        this.state = {
            searchTerm: '',
            searchResults: '',
            chartValue: '',
            chartLabels: '',
            showChart: false,
            showLoading: false
        }
    }

    handleInputChange = (e) => {
        this.setState({
            searchTerm: e.target.value,
        })
    }

    searchMusic = () => {
        const results = [];
        // url = `https://api.spotify.com/v1/search?q=${this.state.searchTerm}&type=track&limit=10`
        fetch(`/search?term=${this.state.searchTerm}`).then(res => {
            res.json().then(data => {
                data.tracks.items.map(track => {
                    console.log(track.album.images[1])
                    const data = {
                        id: track.id,
                        name: track.name,
                        primary_artist: track.artists[0].name,
                        image: track.album.images[2].url
                    }
                    results.push(data);
                    return true;
                });

                this.setState({
                    searchResults: results 
                });
            })
        })
    }

    searchAudioFeature = (track) => {
        let labels = [];
        let values = [];
    
        this.setState({
            showChart: false,
            showLoading: true
        });
        fetch(`/features?id=${track.id}`).then(res => {
            res.json().then(data => {
                for (let feature in data) {
                    if (data.hasOwnProperty(feature) && feature !== 'key' && feature !== 'mode') {
                        if (data[feature] <= 1 && data[feature] >= 0) {
                            labels.push(feature);
                            values.push(data[feature]);
                        }
                    }
                }
                this.setState({
                    chartLabels: labels,
                    chartValue: values,
                    showChart: true, 
                    showLoading: false,
                    selectedTrack: track
                });
                const myChartRef = this.child.current.chartRef.current.getContext("2d");
                this.child.current.createNewChart(myChartRef)
            });
        })
    }

  render() {
      let showSearchResults;
      if (this.state.searchResults) {
          showSearchResults = this.state.searchResults.map(data => (
            <li key={data.id} onClick={() => this.searchAudioFeature(data)} className="search-result" tabIndex='0'>
                <img src={data.image} alt={data.name}></img>
                <div style={{marginLeft:'10px'}}>
                        <h3>{data.name}</h3>
                        <p>{data.primary_artist}</p>
                </div>
            </li>
          ))
      }

    return (
        <div className="App">
            <div className="container">
                <h1>Search for a track & get it's audio features!</h1>
                <div className="search-container">
                        <label htmlFor="search">Search for track...</label>
                        <input id="search" value={this.state.searchTerm} onChange={(e) => this.handleInputChange(e)}></input>
                        <button type="submit" onClick={this.searchMusic}>SEARCH</button>
                </div>
                <ul>
                    {this.state.searchResults ? showSearchResults : ''}
                </ul>
                {this.state.showLoading ? <div className="loading-text"> Wait for it...<span role="img" aria-label="dancing figures">💃💃💃</span></div>: ''}
                <div style={{minHeight: '480px', margin: '50px auto', maxWidth:'1000px', width:'100%'}}>
                    {this.state.showChart ? <h5>{this.state.selectedTrack.name} by {this.state.selectedTrack.primary_artist}</h5> : ''}
                    {this.state.showChart ? <MusicChart ref={this.child} labels={this.state.chartLabels} values={this.state.chartValue} /> : ''}
                </div>
            </div>
        </div>
    );
  }
}

export default App;
