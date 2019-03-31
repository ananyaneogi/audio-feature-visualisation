import React, { Component } from 'react';
import './App.scss';
import SChart from './components/SChart'

class App extends Component {
    constructor(props) {
        super(props);
        this.child = React.createRef();

        this.state = {
            searchTerm: '',
            searchResults: '',
            chartValue: '',
            chartLabels: '',
            // searchResults: [
            //     {
            //         "id": "5WvAo7DNuPRmk4APhdPzi8",
            //         "name": "No Brainer",
            //         "primary_artist": "DJ Khaled"
            //     },
            //     {
            //         "id": "3DXncPQOG4VBw3QHh3S817",
            //         "name": "I'm the One (feat. Justin Bieber, Quavo, Chance the Rapper & Lil Wayne)",
            //         "primary_artist": "DJ Khaled"
            //     },
            //     {
            //         "id": "1OAh8uOEOvTDqkKFsKksCi",
            //         "name": "Wild Thoughts (feat. Rihanna & Bryson Tiller)",
            //         "primary_artist": "DJ Khaled"
            //     },
            //     {
            //         "id": "6u5M4jPpYkoRV4vVHDQvkd",
            //         "name": "All I Do Is Win",
            //         "primary_artist": "DJ Khaled"
            //     },
            //     {
            //         "id": "5iqrbO0fhuLMiy9tYGanv6",
            //         "name": "C'est La Vie",
            //         "primary_artist": "Khaled"
            //     },
            //     {
            //         "id": "1W6wxOOYyJyyok8fqYSZ3m",
            //         "name": "Top Off",
            //         "primary_artist": "DJ Khaled"
            //     },
            //     {
            //         "id": "22mQXNE0nCuWq4yOwcadIn",
            //         "name": "Dinero",
            //         "primary_artist": "Jennifer Lopez"
            //     },
            //     {
            //         "id": "608a1wIsSd5KzMEqm1O7w3",
            //         "name": "I'm On One",
            //         "primary_artist": "DJ Khaled"
            //     }
            // ],
            
            // chartLabels: [
            //     "danceability💃",
            //     "energy💃",
            //     "speechiness💃",
            //     "acousticness💃",
            //     "instrumentalness💃",
            //     "liveness💃",
            //     "valence💃"
            // ],
            // chartValue: [
            //     0.552,
            //     0.76,
            //     0.342,
            //     0.0733,
            //     0,
            //     0.0865,
            //     0.639
            // ],
            showChart: false,
            showLoading: false
        }
    }

    componentDidMount() {

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
                    {this.state.showChart ? <SChart ref={this.child} labels={this.state.chartLabels} values={this.state.chartValue} /> : ''}
                </div>
            </div>
        </div>
    );
  }
}

export default App;
