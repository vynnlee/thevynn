import React from 'react';
import styles from './ChatBubble.module.css';

interface ChatBubbleProps {
  message: string;
  isSender: boolean;
  label: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isSender, label }) => {
  const bubbleClass = isSender ? `${styles.container} ${styles.send}` : `${styles.container} ${styles.receive}`;

  return (
    <>
      <p className="font-geist font-regular text-md text-neutral-500 mb-1">{label}</p>
      <p className={`font-geist font-regular text-md text-neutral-900 ${bubbleClass}`}>
        <span>{message}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="31"
          height="30"
          viewBox="0 0 31 30"
          fill="none"
          className={styles.svgTail}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d={
              isSender
                ? 'M10.6316 12.94C10.3974 11.727 10.2748 10.4744 10.2748 9.1931V0.401144H29.9275V28.8457C25.1684 28.8457 20.8045 27.1542 17.4041 24.3395C14.0117 26.5995 8.57204 28.7478 1.99998 27.5528C3.81009 26.7771 10.7919 22.1225 10.5334 12.8134C10.5648 12.8565 10.5975 12.8987 10.6316 12.94Z'
                : 'M20.3684 12.94C20.6026 11.727 20.7252 10.4744 20.7252 9.1931V0.401144H1.07254V28.8457C5.83157 28.8457 10.1955 27.1542 13.5959 24.3395C16.9883 26.5995 22.428 28.7478 28.0001 27.5528C26.1899 26.7771 19.2081 22.1225 19.4666 12.8134C19.4352 12.8565 19.4025 12.8987 19.3684 12.94Z'
            }
            fill="#e5e5ea"
          />
        </svg>
      </p>
    </>
  );
};

export default ChatBubble;
