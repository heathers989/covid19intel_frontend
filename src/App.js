import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
//Dejay imports
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import MapContainer from './components/headermap';
import DropDown from  './components/dropdown/dropdown';
import TableComponent from './components/table/table'
import AmChartMap from  './components/amchart/amchart';
import Carousel from 'react-bootstrap/Carousel';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
//Comment imports
import NewForm from './components/NewForm.js'
import Show from './components/Show.js'
import UpdateModal from './components/UpdateForm'
import Table from 'react-bootstrap/Table'
let apiKEY = process.env.REACT_APP_GOOGLE_API_KEY

// if (process.env.NODE_ENV === 'development') {
//   baseURL = 'http://localhost:3003'
// } else {
//   baseURL = 'https://fathomless-sierra-68956.herokuapp.com'
// }



console.log(apiKEY)




// .env BaseURL for React

let baseURL = process.env.REACT_APP_BASEURL


if (process.env.NODE_ENV === 'development') {
  baseURL = 'http://localhost:9000'
} else {
  baseURL = process.env.REACT_APP_BASEURL
}

console.log('current base URL:', baseURL)

fetch(baseURL+ '/covidstats')
  .then(data => {
    return data.json()},
    err => console.log(err))
  .then(parsedData => console.log(parsedData),
   err => console.log(err))



//comment component - to be moved to separate file later
class CommentRequest extends React.Component {

    state = {
      show: false,
      setShow: false,
      requests: []
    }
  
    componentDidMount() {
      this.getComments()
    }
  
    getComments = () => {
      fetch(baseURL+ '/covidstats')
        .then(data => {
          return data.json()},
          err => console.log(err))
          .then(parsedData => this.setState({
            requests: parsedData
          }),
           err=> console.log(err))
    }
  
  //for show route
  getRequest = (request) => {

    this.setState({request, getRequestActive: true, getEditRequestActive: false}) 

  }

    //for edit route
    getEditRequest = (request) => {
      this.setState({request, getRequestActive: false, getEditRequestActive: true, show: true})
    }

    
  
  handleClose = () => {
    this.setState({show: false})
  }
  
  
   // New Form HandleAdd 
    handleAddRequest = (requests) => {
      const copyRequest = [...this.state.requests]
      copyRequest.unshift(requests)
      this.setState({
        requests: copyRequest,
        name: '',
        comments: '',
        location: '',
      })
    }

    handleEditRequest = (data) => {
      const newData = this.state.requests.filter( request => {
        return request._id !== data._id
      })
      newData.push(data);
      this.setState({ 
        requests: newData,
        show: false
      })
    }
  
  
      //function to delete a request and return all the others
      deleteRequest = (id) => {
        fetch(baseURL + '/covidstats/' + id, {
          method: 'DELETE'
        }).then ( res => {
          const requestsArr = this.state.requests.filter( request => {
            return request._id !== id
          })
          this.setState({requests: requestsArr})
        })
      }
  
    render() {
      console.log(this.state.requests)
    return (
  
      // Comments/Requests
      <div className="commentsContainer">
       
        <NewForm baseURL={baseURL}
    handleAddRequest={this.handleAddRequest}/>
  
    {/* this is where the requests will display */}

    <Table striped bordered hover responsive="lg" className="commenttable">
    <tbody>
        <tr>
          <th>Name</th> 
          <th>Comment/request</th> 
          <th>Location</th> 
          <th>Delete</th> 
          <th>Edit</th> 
         </tr> 
      {this.state.requests.map(request => (
         <tr key={request._id}
         onMouseOver={() => this.getRequest(request)}>
          <td>{request.name}</td>
          <td>{request.comments}</td>
          <td>{request.location}</td>

          <td className="delete"><Button variant="secondary" onClick={() => this.deleteRequest(request._id)}>Delete</Button></td>
          <td className="edit"><Button className="Edit-Button" govariant="primary" onClick={() => {this.getEditRequest(request)} }>Edit</Button></td>
          </tr>
      ))}
    </tbody>
  </Table>
  {this.state.getRequestActive ? <Show request={this.state.request}/> : null}
  <br/>
  <br/>
  
  {this.state.getEditRequestActive ? <UpdateModal baseURL={baseURL}request={this.state.request} showUp={this.state.show}  hideModal={this.handleClose} handleEditRequest={this.handleEditRequest}/> : null}

      </div>
    );
  }
  }

  
  //Dejay app component
class App extends React.Component {

  state = {
    //create a placeholder for 208 array of objects
    covidData: {countries_stat:[...Array(208).fill({...Object})]},
    flagData: [...Array(249).fill({...Object})]
  }


//compDidmount method
componentDidMount() {
  this.getCovidStats();

  this.getFlagImage();

}

//make fetch request to get data from api
 getCovidStats = () => {
   fetch('https://coronavirus-monitor.p.rapidapi.com/coronavirus/cases_by_country.php', {
     "method": "GET",
     headers: {
      'x-rapidapi-host': 'coronavirus-monitor.p.rapidapi.com',
      'x-rapidapi-key': `${apiKEY}`


     }
   }).then(data => data.json(), err => console.log(err))
     .then(parsedData => this.setState({covidData: parsedData}), err => console.log('parsedData', err))
 }



    showModal = () => {
      this.setState({ show: true });
    };
  
    hideModal = () => {
      this.setState({ show: false });
    };

    

 getFlagImage = () => {
  fetch('https://restcountries.eu/rest/v2/all', {
    "method": "GET"
  }).then(data => data.json(), err => console.log(err))
    .then(parsedData => this.setState({flagData: parsedData}), err => console.log('parsedData', err))

 }



  render() {

    

  return (
 
    <div className="App">
      {/* Dejay skelaton */}

        <Container >
            {/* Mapcontainer component on col */}
            <Row>
              <Col>
              <MapContainer/>
              </Col>
            </Row>
          {/* amchart component on col */}
            <Row>
              <Col>
              <Carousel>
                <Carousel.Item>
                <AmChartMap/>
                </Carousel.Item>
                <Carousel.Item>
                <img fluid  className="slider"
              src="https://www.cdc.gov/coronavirus/2019-ncov/images/social/covid19-prevention-fb.png"
              alt="First slide"/>
                </Carousel.Item>
              </Carousel>
              </Col>
            </Row>
          {/* dropdown component on col */}
            <Row>
              <Col>
              <DropDown covidData={this.state.covidData}  covidFlag={this.state.flagData}/>
              </Col>
            </Row>
          {/* table component on col */}
            <Row>
              <Col>
              <TableComponent covidApiData={this.state.covidData}/>
              </Col>
            </Row>
             <Row>
              <Col>
              <CommentRequest/>
              
              </Col>
            </Row>
        </Container>


    </div>
  );
}
}


export default App
