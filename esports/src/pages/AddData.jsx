import React, { useState } from 'react';
import '../css/AddData.css'

function AddData() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    image: null
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === 'file' ? e.target.files[0] : value;
    setFormData(prevState => ({
      ...prevState,
      [name]: val
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here, e.g., send data to server
    console.log(formData);
    // Clear form fields after submission
    setFormData({
      name: '',
      email: '',
      message: '',
      image: null
    });
  };

  return (
    <div>
      <h2 className='add-data-header'>Simple Form with Image Upload</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className='add-data-header'>Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email" className='add-data-header'>Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="message" className='add-data-header'>Message:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="image" className='add-data-header'>Upload Image:</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default AddData;
