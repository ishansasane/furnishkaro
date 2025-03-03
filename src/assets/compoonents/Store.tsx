import React, { useState, useRef, useEffect } from 'react';

interface Store {
  name: string;
  phone: string;
  email: string;
  address: string;
}

const Store: React.FC = () => {
  const [stores, setStores] = useState<Store>([
    { name: 'Sheela Decor', phone: '-', email: '-', address: '-' },
    { name: 'Dense', phone: '-', email: '-', address: '-' },
  ]);
  const [isAddStoreOpen, setIsAddStoreOpen] = useState(false);
  const [newStoreName, setNewStoreName] = useState('');
  const [newStorePhone, setNewStorePhone] = useState(''); // Added phone state
  const [newStoreEmail, setNewStoreEmail] = useState(''); // Added email state
  const [newStoreAddress, setNewStoreAddress] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [editingStore, setEditingStore] = useState<Store | null>(null);

  const handleAddStoreClick = () => {
    setIsAddStoreOpen(true);
  };

  const handleCloseAddStore = () => {
    setIsAddStoreOpen(false);
    setNewStoreName('');
    setNewStorePhone(''); // Reset phone
    setNewStoreEmail(''); // Reset email
    setNewStoreAddress('');
    setDropdownOpen(null);
    setEditingStore(null);
  };

  const handleSaveStore = () => {
    if (editingStore) {
      const updatedStores = stores.map((store) =>
        store.name === editingStore.name
          ? {
              ...store,
              name: newStoreName,
              phone: newStorePhone, // Update phone
              email: newStoreEmail, // Update email
              address: newStoreAddress,
            }
          : store
      );
      setStores(updatedStores);
      setEditingStore(null);
    } else {
      const newStore: Store = {
        name: newStoreName,
        phone: newStorePhone,
        email: newStoreEmail,
        address: newStoreAddress,
      };
      setStores([...stores, newStore]);
    }
    handleCloseAddStore();
  };

  const toggleDropdown = (index: number) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const handleEdit = (store: Store) => {
    setEditingStore(store);
    setNewStoreName(store.name);
    setNewStorePhone(store.phone); // Set phone
    setNewStoreEmail(store.email); // Set email
    setNewStoreAddress(store.address);
    setIsAddStoreOpen(true);
    setDropdownOpen(null);
  };

  const handleDelete = (store: Store) => {
    const updatedStores = stores.filter((s) => s.name !== store.name);
    setStores(updatedStores);
    setDropdownOpen(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  },);

  return (
    <div style={{ padding: '20px' , backgroundColor: '#f0f2f5' , borderRadius: '20px'}}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 className='font-bold text-3xl m-5'>Stores</h2>
        <button
          onClick={handleAddStoreClick}
          style={{
            backgroundColor: '#1890ff',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
          }}
        >
          + Add Store
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Q Search Stores..."
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            width: '300px',
          }}
        />
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #eee' }}>Store Name</th>
            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #eee' }}>Phone</th>
            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #eee' }}>Email</th>
            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #eee' }}>Address</th>
            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #eee' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((store, index) => (
            <tr key={index}>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{store.name}</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{store.phone}</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{store.email}</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{store.address}</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee', position: 'relative' }}>
                <button onClick={() => toggleDropdown(index)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                ⋮ 
                </button>
                {dropdownOpen === index && (
                  <div
                    ref={dropdownRef}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: '0',
                      backgroundColor: 'white',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      padding: '8px',
                      zIndex: 10,
                    }}
                  >
                    <button onClick={() => handleEdit(store)} style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'block', padding: '4px 8px' }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(store)} style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'block', padding: '4px 8px', color: 'red' }}>
                      Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      

      {isAddStoreOpen && (
        <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          width: '400px',
        }}
      >
        <h3 style={{ marginBottom: '15px', textAlign: 'center' }}> {/* Centered title */}
          {editingStore ? 'Edit Store' : 'Add Store'}
        </h3>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Store Name:</label>
          <input
            type="text"
            value={newStoreName}
            onChange={(e) => setNewStoreName(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              width: '100%',
            }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Phone:</label>
          <input
            type="text"
            value={newStorePhone}
            onChange={(e) => setNewStorePhone(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              width: '100%',
            }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input
            type="text"
            value={newStoreEmail}
            onChange={(e) => setNewStoreEmail(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              width: '100%',
            }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Address:</label>
          <input
            type="text"
            value={newStoreAddress}
            onChange={(e) => setNewStoreAddress(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              width: '100%',
            }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}> {/* Aligned buttons to the right */}
          <button
            onClick={handleSaveStore}
            style={{
              backgroundColor: '#1890ff',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              marginRight: '10px',
            }}
          >
            Save
          </button>
          <button onClick={handleCloseAddStore} style={{ padding: '8px 16px', borderRadius: '4px' }}> {/* Added padding to Cancel button */}
            Cancel
          </button>
        </div>
      </div>
      )}
    </div>
  );
};

export default Store;