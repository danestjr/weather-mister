import { useState } from "react"
import './App.css';
import Weather from './components/weather.js'
import { Navbar, NavbarBrand, Container, Form, Input } from 'reactstrap';

function App() {
  const [search, setSearch] = useState('San Francisco')

  const handleSearch = (e) => {
    e.preventDefault()
    const query = e.target.query.value;
    setSearch(query)
  }

  return (
    <>
    <Navbar
          color="warning"
          light
        >
        <NavbarBrand href="/">
        Weather App
        </NavbarBrand>
        <Form onSubmit={handleSearch}>
            <Input type="text" placeholder="Search" name="query" id="query" />
        </Form>
        
      </Navbar>
    <Container className="App">
      <Weather query={search}></Weather>
      <footer>Estrada Codes 2023 - Data provided by OpenWeather</footer>
    </Container>
    </>
  );
}

export default App;
