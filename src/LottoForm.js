import React, { useState, useEffect } from 'react';
import './LottoForm.css';
import { Link } from 'react-router-dom';

const LottoForm = () => {
  const denominations = [2, 3, 4, 5, 10, 20, 25, 30, 50];
  const currentDate = new Date();
  const offset = currentDate.getTimezoneOffset() * 60000; // Get the timezone offset in milliseconds
  const localDate = new Date(currentDate.getTime() - offset); // Adjust the current date based on the offset

  const initialFormData = {
    name: '',
    date: localDate.toISOString().split('T')[0],
    lotto: denominations.reduce((acc, denomination) => {
      acc[denomination] = {
        open: '',
        add: '',
        close: '',
        sold: 0,
        dollar: 0,
      };
      return acc;
    }, {}),
  };

  const [formData, setFormData] = useState(() => {
    const storedFormData = localStorage.getItem('lottoFormData');
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
    localStorage.setItem('lottoFormData', JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e, denomination, type) => {
    const value = e.target.value === '' ? '' : parseFloat(e.target.value);
    const updatedFormData = { ...formData };

    if (denomination) {
      updatedFormData.lotto[denomination][type] = value;

      if (type === 'add' || type === 'close') {
        const addValue = parseFloat(updatedFormData.lotto[denomination].add) || 0;
        const closeValue = parseFloat(updatedFormData.lotto[denomination].close) || 0;

        if (updatedFormData.lotto[denomination].close === '' || updatedFormData.lotto[denomination].close === 0 ) {
          updatedFormData.lotto[denomination].sold = 0;
        } else {
          updatedFormData.lotto[denomination].sold = addValue - closeValue;
        }

        updatedFormData.lotto[denomination].dollar = denomination * updatedFormData.lotto[denomination].sold;
      }
    } else {
      updatedFormData.name = e.target.value;
    }

    setFormData(updatedFormData);
  };

  const handleReset = () => {
    setFormData(initialFormData);
    localStorage.removeItem('lottoFormData');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // You can perform any additional actions here, like submitting the data to a backend
  };

  const totalDollar = Object.values(formData.lotto)
    .reduce((acc, denominationData) => acc + denominationData.dollar, 0)
    .toFixed(2);

  return (
    <div className="lotto-form">
      <h2>Daily Closing Lotto Form</h2>
      <form onSubmit={handleSubmit}>
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
            onChange={(e) => handleChange(e)}
            required
          />
        </div>
        <table>
          <thead>
            <tr>
              <th>Lotto</th>
              <th>Open</th>
              <th>Add</th>
              <th>Close</th>
              <th>Sold</th>
              <th>Dollar</th>
            </tr>
          </thead>
          <tbody>
            {denominations.map((denomination) => (
              <tr key={denomination}>
                <td>{`$${denomination}`}</td>
                <td>
                  <input
                    type="number"
                    value={formData.lotto[denomination].open}
                    onChange={(e) => handleChange(e, denomination, 'open')}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={formData.lotto[denomination].add}
                    onChange={(e) => handleChange(e, denomination, 'add')}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={formData.lotto[denomination].close}
                    onChange={(e) => handleChange(e, denomination, 'close')}
                  />
                </td>
                <td>{formData.lotto[denomination].sold}</td>
                <td>{formData.lotto[denomination].dollar.toFixed(2)}</td>
              </tr>
            ))}
            <tr>
              <td colSpan="2">
                <div className='form-row'>
                  <div className="input-group">
                    <label>Pay-out</label>
                    <input type="number" placeholder="Enter amount" />
                  </div>
                  <div className="input-group">
                    <label>Lottery sale</label>
                    <input type="number" placeholder="Enter amount" />
                  </div>
                </div>
              </td>
              <td colSpan="2">Total</td>
              <td colSpan="2">{totalDollar}</td>
            </tr>
          </tbody>
        </table>
        <div className="form-row">
          <button type="submit">Submit</button>
          <button type="button" onClick={handleReset}>Reset</button>
        </div>
      </form>
      <div className="form-row">
        <Link to="/" className="link-button">Back: Till Form</Link>
      </div>
    </div>
  );
};

export default LottoForm;
