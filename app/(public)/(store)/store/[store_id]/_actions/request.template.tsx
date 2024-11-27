import * as React from 'react';

export interface EmailTemplateProps {
  name: string;
  email: string;
  gearType: string;
  message: string;
  storeName: string;
  storeId: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  name,
  email,
  gearType,
  message,
  storeName,
  storeId,
}) => (
  <div>
    <h1>New Gear Request</h1>
    <div>
      <p><strong>Name:</strong> {name}</p>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Gear Type:</strong> {gearType}</p>
      <p><strong>Message:</strong> {message}</p>
      <p><strong>Store:</strong> {storeName}</p>
      <p><strong>Store ID:</strong> {storeId}</p>
    </div>
  </div>
);