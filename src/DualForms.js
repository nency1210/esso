import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from './FireBase'; // Import the app instance

const db = getFirestore(app);

function CombinedForm() {
  const initialFormData = {
    name: '',
    date: '',
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
    },
    lotto: [1, 2, 3, 5, 10, 20, 25, 30, 50].reduce((acc, denomination) => {
      acc[denomination] = {
        open: '',
        add: '',
        close: '',
        sold: '',
        dollar: 0
      };
      return acc;
    }, {})
  };

  const [formData, setFormData] = useState(() => {
    const storedFormData = localStorage.getItem('formData');
    return storedFormData ? JSON.parse(storedFormData) : initialFormData;
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerID = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timerID);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [section, denomination] = name.split('.');
    const inputValue = value.trim();

    if (section === 'lotto') {
      const [denom, type] = denomination.split('-');
      setFormData(prevState => {
        const updatedLotto = { ...prevState.lotto };
        updatedLotto[denom][type] = parseFloat(inputValue) || 0;
        if (type === 'add' || type === 'close') {
          updatedLotto[denom].sold = updatedLotto[denom].add - updatedLotto[denom].close;
          updatedLotto[denom].dollar = denom * updatedLotto[denom].sold;
        }
        return { ...prevState, lotto: updatedLotto };
      });
    } else {
      setFormData(prevState => ({
        ...prevState,
        [section]: {
          ...prevState[section],
          [denomination]: inputValue
        }
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    localStorage.setItem('formData', JSON.stringify(formData));

    const lottoFormRef = collection(db, 'lottoForm');
    try {
      await addDoc(lottoFormRef, formData.lotto);
      console.log('Lotto form data stored in Firestore:', formData.lotto);
    } catch (error) {
      console.error('Error storing lotto form data in Firestore:', error);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    localStorage.removeItem('formData');
  };

  const calculateTotalCash = () => {
    let total = 0;
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

  const calculateTotalLottoDollar = () => {
    return Object.values(formData.lotto).reduce((acc, denomData) => acc + denomData.dollar, 0).toFixed(2);
  };

  return (
    <div className="form-container">
      <h2>Daily Closing Form</h2>
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-section">
          <label>
            Name:
            <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </label>
          <label>
            Date:
            <input type="date" name="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
          </label>
          <p>Time: {currentTime.toLocaleTimeString()}</p>
        </div>
        <div className="form-section">
          <h3>Cash</h3>
          {Object.entries(formData.cash).map(([denomination, quantity]) => (
            <div key={denomination} className="form-row">
              <label>{`$${denomination}:`}</label>
              <input
                type="number"
                name={`cash.${denomination}`}
                value={quantity === '' ? '' : parseFloat(quantity)}
                onChange={handleChange}
              />
              <span>${(denomination * (parseFloat(quantity) || 0)).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="form-section">
          <h3>Cents</h3>
          {Object.entries(formData.cent).map(([denomination, quantity]) => (
            <div key={denomination} className="form-row">
              <label>{`$${denomination}:`}</label>
              <input
                type="number"
                name={`cent.${denomination}`}
                value={quantity === '' ? '' : parseFloat(quantity)}
                onChange={handleChange}
              />
              <span>${(denomination * quantity / 100).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="form-section">
          <h3>Lotto</h3>
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
              {Object.entries(formData.lotto).map(([denomination, data]) => (
                <tr key={denomination}>
                  <td>{`$${denomination}`}</td>
                  <td>
                    <input
                      type="number"
                      name={`lotto.${denomination}-open`}
                      value={data.open}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name={`lotto.${denomination}-add`}
                      value={data.add}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name={`lotto.${denomination}-close`}
                      value={data.close}
                      onChange={handleChange}
                    />
                  </td>
                  <td>{data.sold}</td>
                  <td>{data.dollar.toFixed(2)}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="2">
                  <div className="input-group">
                    <label>Pay-out</label>
                    <input type="number" placeholder="Enter amount" />
                  </div>
                  <div className="input-group">
                    <label>Lottery sale</label>
                    <input type="number" placeholder="Enter amount" />
                  </div>
                </td>
                <td colSpan="2">Total</td>
                <td colSpan="2">{calculateTotalLottoDollar()}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="form-row">
          <button type="submit">Submit</button>
          <button type="button" onClick={handleReset}>Reset</button>
        </div>
      </form>
      <div className="total">
        <p>Total Cash In: ${calculateTotalCash()}</p>
        <p>Total Lotto Dollar: ${calculateTotalLottoDollar()}</p>
      </div>
    </div>
  );
}

export default CombinedForm;
