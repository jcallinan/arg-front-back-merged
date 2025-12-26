import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import type { ToasterProps } from '@type-definitions/accounts-payable.types';


const Toaster: React.FC<ToasterProps> = ({ type, title, subtitle, onClose }) => {

  return (
    <div className={`toaster ${type}`}>
      <div className={`icon ${type}`} />
      <div className="content">
        <h5 className="title">{title}</h5>
        <p className="subtitle" style={{ whiteSpace: 'pre-line' }}>{subtitle}</p>
      </div>
      <CloseOutlined className="close-icon" onClick={onClose} />
    </div>
  );
};

export default Toaster;
