import React from 'react';

function TillDisplay() {
  const tills = []; // Set tills data here

  return (
    <div>
      <h2>Daily Closing Tills Display</h2>
      <ul>
        {tills.map(till => (
          <li key={till.id}>
            {/* Display closing tills data */}
            <p>Name: {till.name}</p>
            <p>Date: {till.date}</p>
            <p>Bills:</p>
            <ul>
              {Object.entries(till.bills).map(([bill, count]) => (
                <li key={bill}>{`$${bill}: ${count}`}</li>
              ))}
            </ul>
            <p>Coins:</p>
            <ul>
              {Object.entries(till.coins).map(([coin, count]) => (
                <li key={coin}>{`$${coin}: ${count}`}</li>
              ))}
            </ul>
            <p>Cash In: ${till.cashIn.toFixed(2)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TillDisplay;
