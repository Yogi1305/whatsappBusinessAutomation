import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import MailIcon from '@mui/icons-material/Mail';
import CallRoundedIcon from '@mui/icons-material/CallRounded';
import Person2Icon from '@mui/icons-material/Person2';

const Sidebar = ({
  contacts,
  firebaseContacts,
  searchText,
  setSearchText,
  handleContactSelection,
  profileImage,
  selectedContact,
}) => {
  const filteredContacts = [
    ...contacts,
    ...firebaseContacts
  ].filter(contact => {
    const firstName = contact.first_name?.toLowerCase() || '';
    const lastName = contact.last_name?.toLowerCase() || '';
    const firebaseName = contact.name?.toLowerCase() || '';
    const search = searchText.toLowerCase();
    return firstName.includes(search) || lastName.includes(search) || firebaseName.includes(search);
  });

  return (
    <div style={{ width: '400px', height: '100%', backgroundColor: '#f0f0f0', borderRight: '1px solid #ccc', overflow: 'hidden' }}>
      <div style={{ backgroundColor: '#4caf50', color: '#fff', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: '2rem', margin: '0', fontWeight: '800', color: 'white' }}>Contacts</h1>
        <div style={{ display: 'flex', alignItems: 'center', padding: '10px', backgroundColor: '#fff', borderRadius: '5px', marginTop: '10px' }}>
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchText}
            style={{ flex: '1', border: 'none', outline: 'none', padding: '8px', fontSize: '1rem', color: 'black' }}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <SearchIcon className="search-icon" style={{ cursor: 'pointer', color: '#555' }} />
        </div>
      </div>
      <div style={{ padding: '20px', maxHeight: 'calc(100vh - 140px)', overflowY: 'auto' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>All Contacts</h2>
        {filteredContacts.map(contact => (
          <div
            key={contact.id}
            className={`contact-item ${selectedContact?.id === contact.id ? 'active' : ''}`}
            onClick={() => handleContactSelection(contact)}
            style={{
              padding: '10px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              backgroundColor: selectedContact?.id === contact.id ? '#e0e0e0' : 'inherit',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#ccc', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#666' }}>
                {profileImage ? (
                  <img src={profileImage} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                ) : (
                  <Person2Icon style={{ fontSize: '3rem' }} />
                )}
              </div>
              <div style={{ marginLeft: '10px', flex: '1' }}>
                <h3 style={{ margin: '0', fontSize: '1.5rem' }}>{contact.first_name} {contact.last_name} {contact.name}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
