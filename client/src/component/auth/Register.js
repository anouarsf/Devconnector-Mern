import React , {Fragment, useState} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {register} from '../../actions/auth';

 const Register = ({register}) => {
   const [formData, setFormData] = useState({
name: '',
email: '',
password: '',
password2: ''
   });

   const { name , email, password, password2} = formData;
   const onChange = e => setFormData({
     ...formData, [e.target.name]:e.target.value
   });

   const onSubmit = async e => {
     e.preventDefault();
     if (password !== password2) {
console.log('Password dont match');
     } else{
register( { name , email, password});
}

     
   };

  return (
    <Fragment>
 <h1 className='large text-primary'>Sign Up</h1>
      <p className='lead'>
        <i className='fas fa-user' /> Create Your Account
      </p>
      <form className='form' onSubmit={e => onSubmit(e)}
>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Name'
            name='name'
            value={name}
            onChange={e =>onChange(e)}
            
          />
        </div>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            onChange={e =>onChange(e)}
            value={email}

          />
        
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            onChange={e =>onChange(e)}
            value={password}

          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Confirm Password'
            name='password2'
            onChange={e =>onChange(e)}
            value={password2}

          />
        </div>
        <input type='submit' className='btn btn-primary' value='Register'
        />
      </form>
      <p className='my-1'>
        Already have an account? <Link to='/login'>Sign In</Link>
      </p>
          </Fragment>
  );
};


export default connect (null, {register}) (Register) ;