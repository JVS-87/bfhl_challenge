import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './App.css';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const [response, setResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const options = [
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'highest_alphabet', label: 'Highest Alphabet' }
  ];

  const handleSubmit = async () => {
    try {
      const parsedInput = JSON.parse(jsonInput);
      if (!parsedInput.data) {
        throw new Error('Invalid JSON: Missing "data" field');
      }
      setError('');
      const res = await axios.post('http://localhost:3000/bfhl', parsedInput);
      setResponse(res.data);
    } catch (err) {
      setError(err.message);
      setResponse(null);
    }
  };

  const handleSelectChange = (selected) => {
    setSelectedOptions(selected);
  };

  const renderResponse = () => {
    if (!response) return null;

    const selectedValues = selectedOptions.map(option => option.value);
    const responseData = selectedValues.reduce((acc, key) => {
      if (response[key]) {
        acc[key] = response[key];
      }
      return acc;
    }, {});

    return <pre>{JSON.stringify(responseData, null, 2)}</pre>;
  };

  return (
    <div className="App">
      <h1>20BEC0215</h1>
      <textarea
        rows="10"
        cols="50"
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder='Enter JSON, e.g., { "data": ["A", "C", "z"] }'
      />
      <br />
      <button onClick={handleSubmit}>Submit</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {response && (
        <>
          <Select
            isMulti
            options={options}
            onChange={handleSelectChange}
          />
          {renderResponse()}
        </>
      )}
    </div>
  );
}

export default App;
