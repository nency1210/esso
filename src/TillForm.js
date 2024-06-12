import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TillForm.css';

function TillForm() {
  const initialFormData = {
    name: '',
    date: new Date().toISOString().split('T')[0], // Get current date in YYYY-MM-DD format
    cash: {
      100: '',
      50: '',
      20: '',
      10: '',
      5: '',
      2: '',
      1: '',
    },
    cent: {
      25: '',
      10: '',
      5: ''
    }
  };

  const [formData, setFormData] = useState(() => {
    const storedFormData = localStorage.getItem('tillFormData');
    return storedFormData ? JSON.parse(storedFormData) : initialFormData;
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerID = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timerID);
  }, []);

  useEffect(() => {
    localStorage.setItem('tillFormData', JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCashChange = (e) => {
    const { name, value } = e.target;
    const denomination = parseInt(name, 10);
    const inputValue = parseFloat(value) || ''; // Allow empty string if user deletes input

    setFormData(prevState => ({
      ...prevState,
      cash: {
        ...prevState.cash,
        [denomination]: inputValue
      }
    }));
  };

  const handleCentChange = (e) => {
    const { name, value } = e.target;
    const denomination = parseInt(name, 10);
    const inputValue = parseFloat(value) || '';

    setFormData(prevState => ({
      ...prevState,
      cent: {
        ...prevState.cent,
        [denomination]: inputValue
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // You can perform any additional actions here, like submitting the data to a backend
  };

  const handleReset = () => {
    setFormData(initialFormData);
    localStorage.removeItem('tillFormData');
  };

  const calculateTotal = () => {
    let total = -264;
    for (const denomination in formData.cash) {
      const quantity = parseFloat(formData.cash[denomination]) || 0;
      total += denomination * quantity;
    }
    for (const denomination in formData.cent) {
      const quantity = parseFloat(formData.cent[denomination]) || 0;
      total += denomination * quantity / 100;
    }
    return total.toFixed(2);
  };

  return (
    <div className="form-container">
      <h2>Daily Closing Tills Form</h2>
      
      <form onSubmit={handleSubmit} className="form-grid">
      <div className="form-row">
      <p>Date: {formData.date}</p>
      <p>Time: {currentTime.toLocaleTimeString()}</p>
</div>
        <div className="form-row">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-section">
          {Object.entries(formData.cash).map(([denomination, quantity]) => (
            <div key={denomination} className="form-row">
              <label>{`$${denomination}:`}</label>
              <input
                type="number"
                name={denomination}
                value={quantity}
                onChange={handleCashChange}
              />
              <span>${(denomination * quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="form-section">
          <label>Cents</label>
          {Object.entries(formData.cent).map(([denomination, quantity]) => (
            <div key={denomination} className="form-row">
              <label>{`$${denomination}:`}</label>
              <input
                type="number"
                name={denomination}
                value={quantity}
                onChange={handleCentChange}
              />
              <span>${(denomination * quantity / 100).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="form-row">
          <button type="submit">Submit</button>
          <button type="button" onClick={handleReset}>Reset</button>
        </div>
      </form>
      <div className="total">
        <p>Total Cash In: ${calculateTotal()}</p>
      </div>
      <div className="form-row">
        <Link to="/lotto" className="link-button">Next: Lotto Form</Link>
      </div>
    </div>
  );
}

export default TillForm;
