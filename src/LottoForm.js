import React, { useState, useEffect } from 'react';
import './LottoForm.css';
import { Link } from 'react-router-dom';

const LottoForm = () => {
  const denominations = [2, 3, 5, 10, 20, 25, 30, 50];
  const currentDate = new Date();
  const offset = currentDate.getTimezoneOffset() * 60000; 
  const localDate = new Date(currentDate.getTime() - offset); 

  const initialFormData = {
    name: '',
    date: localDate.toISOString().split('T')[0],
    lotto: denominations.reduce((acc, denomination) => {
      acc[denomination] = {
        open: '',
        add: '',
        close: 0,
        sold: '',
        dollar: 0,
      };
      return acc;
    }, {}),
    payout: 0,
    lotterySale: 0,
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
    const { name, value } = e.target;
    const updatedFormData = { ...formData };

    if (name === 'name' || name === 'payout' || name === 'lotterySale') {
      updatedFormData[name] = value;
    } else {
      const numValue = parseFloat(value) || 0;
      updatedFormData.lotto[denomination][type] = numValue;

      if (type === 'add' || type === 'close') {
        if (updatedFormData.lotto[denomination].close === 0 ) {
          updatedFormData.lotto[denomination].sold = 0;
          updatedFormData.lotto[denomination].dollar = denomination * updatedFormData.lotto[denomination].add;
        } else {
          updatedFormData.lotto[denomination].sold =
            updatedFormData.lotto[denomination].add -
            updatedFormData.lotto[denomination].close;
          updatedFormData.lotto[denomination].dollar =
            denomination * updatedFormData.lotto[denomination].sold;
        }
      }
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
            onChange={handleChange}
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
                <div className="form-row">
                 <div className="input-group">
  <label>Pay-out</label>
  <input
    type="number"
    name="payout"
    value={formData.payout}
    onChange={(e) => handleChange(e)}
    placeholder="Enter amount"
  />
</div>
<div className="input-group">
  <label>Lottery sale</label>
  <input
    type="number"
    name="lotterySale"
    value={formData.lotterySale}
    onChange={(e) => handleChange(e)}
    placeholder="Enter amount"
  />
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
