import * as React from 'react';

interface EmailTemplateProps {
  items: { [key: string]: number };
  comment: string;
  orderDate: string;
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({
  items,
  comment,
  orderDate,
}) => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ backgroundColor: '#ff0000', padding: '20px', textAlign: 'center' }}>
        <h1 style={{ color: '#ffcc00', fontSize: '28px', margin: '0' }}>
          McDonald&apos;s Order Notification
        </h1>
      </div>
      
      <div style={{ padding: '20px', backgroundColor: '#fff' }}>
        <h2 style={{ color: '#333', fontSize: '22px' }}>New Order Details</h2>
        
        <div style={{ marginTop: '20px', backgroundColor: '#f9f9f9', borderRadius: '5px', padding: '15px' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#ff0000' }}>Ordered Items:</h3>
          
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd' }}>
                <th style={{ textAlign: 'left', padding: '8px' }}>Item</th>
                <th style={{ textAlign: 'center', padding: '8px' }}>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(items).map(([item, count]) => (
                <tr key={item} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '8px' }}>{item}</td>
                  <td style={{ textAlign: 'center', padding: '8px' }}>{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#ff0000' }}>Customer Comment:</h3>
          <p style={{ backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '5px', margin: '0' }}>
            {comment || 'No comment provided'}
          </p>
        </div>
      </div>
      
      <div style={{ backgroundColor: '#ffcc00', padding: '15px', textAlign: 'center' }}>
        <p style={{ margin: '0', color: '#333' }}>
          Order received on {orderDate}
        </p>
      </div>
    </div>
  );
};

export default EmailTemplate;