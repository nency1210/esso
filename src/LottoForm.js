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
        close: '',
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
    const value = parseFloat(e.target.value) || 0;
    const updatedFormData = { ...formData };

    updatedFormData.lotto[denomination][type] = value;

    if (type === 'add' || type === 'close') {
      if (updatedFormData.lotto[denomination].close === 0 || updatedFormData.lotto[denomination].close === '') {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseFloat(value) || 0 });
  };

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
            onChange={handleInputChange}
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
