import React, { useState } from 'react';
import MailIcon from '@mui/icons-material/Mail';
import CallRoundedIcon from '@mui/icons-material/CallRounded';
import Person2Icon from '@mui/icons-material/Person2';

const ChatDetailsSidebar = ({ selectedContact, profileImage }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleButtonClick = () => {
    setIsClicked(!isClicked);
    // Implement logic for handling Instagram/WhatsApp button click
    // You can use isClicked state to conditionally render different behavior
  };

  const handleRedirect = () => {
    window.location.href = 'https://www.facebook.com/v18.0/dialog/oauth?client_id=1546607802575879&redirect_uri=https%3A%2F%2Fcrm.nuren.ai%2Fll%2Fchatbot&response_type=code&config_id=1573657073196264&state=pass-through%20value';
    // Implement logic for sign up button click
  };

  const styles = {
    chatbotContactSection: {
      padding: '30px',
    //   border: '1px solid #ccc',
      borderRadius: '5px',
      backgroundColor: '#f0f0f0',
      Width: '40vw',
    //   margin: '0 auto',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    chatbotDetails: {
      marginBottom: '10px',
      fontSize: '24px',
      textAlign: 'center',
      fontWeight: 'bold',
    },
    chatbotContactDetails: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    profileInfo: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '20px',
    },
    chatbotProfileImage: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      marginBottom: '10px',
    },
    accountCircle: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      backgroundColor: '#ccc',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: '10px',
      fontSize: '14px',
    },
    chatbotContactsDetails: {
      textAlign: 'center',
      fontWeight: 'bold',
    },
    contactItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '5px 0',
    },
    headerIcon: {
      marginRight: '5px',
    },
    chatbotButtonSection: {
      display: 'flex',
      justifyContent: 'center',
      gap: '10px',
      marginBottom: '20px',
    },
    button: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      color: '#fff',
    },
    instaButton: {
      backgroundColor: '#405DE6',
    },
    whatsappButton: {
      backgroundColor: '#25D366',
    },
    signupButton: {
      backgroundColor: '#3b5998',
    },
  };

  return (
    <div style={styles.chatbotContactSection}>
      <div style={styles.chatbotButtonSection}>
        <button
          style={{
            ...styles.button,
            ...styles.instaButton,
            ...(isClicked && styles.whatsappButton),
          }}
          onClick={handleButtonClick}
        >
          {isClicked ? 'WhatsApp' : 'Instagram'}
        </button>
        <button style={{ ...styles.button, ...styles.signupButton }} onClick={handleRedirect}>
          Sign Up
        </button>
      </div>
      <h1 style={styles.chatbotDetails}>Contact Details</h1>
      {selectedContact && (
        <div style={styles.chatbotContactDetails}>
          <div style={styles.profileInfo}>
            {profileImage ? (
              <img src={profileImage} alt="Profile" style={styles.chatbotProfileImage} />
            ) : (
              <span style={styles.accountCircle}><Person2Icon style={{fontSize:'5rem'}}/></span>
            )}
            <h2>{selectedContact.first_name} {selectedContact.last_name}</h2>
            <div style={styles.chatbotContactsDetails}>
              <p style={styles.contactItem}>
                <CallRoundedIcon style={styles.headerIcon} />
                {selectedContact.phone}
              </p>
              <p style={styles.contactItem}>
                <MailIcon style={styles.headerIcon} />
                {selectedContact.email}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatDetailsSidebar;
