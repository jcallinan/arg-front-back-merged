import { CopyrightOutlined } from '@ant-design/icons';
import './core.scss';

export default function Footer() {
  return (
    <div className="custom-footer">
      <span>
        <CopyrightOutlined className="footer-icon" />
         2025 American Refining Group Inc. All Rights Reserved.
      </span>
    </div>
  );
}
